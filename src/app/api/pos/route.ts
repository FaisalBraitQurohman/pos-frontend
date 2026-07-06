import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createPOSTransactionSchema } from "@/lib/validations"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Decimal } from "@prisma/client/runtime/library"

// POST /api/pos - Create a new POS transaction
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Get user ID from session or use default admin for testing
        let userId: string
        if (session?.user?.id) {
            userId = session.user.id
        } else {
            // Find default admin user for testing
            const adminUser = await prisma.user.findFirst({
                where: { role: "ADMIN" }
            })
            if (!adminUser) {
                return NextResponse.json({ error: "No admin user found" }, { status: 500 })
            }
            userId = adminUser.id
        }

        const body = await request.json()
        const validatedData = createPOSTransactionSchema.parse(body)

        // Parse optional transactionDate
        const transactionDate = validatedData.transactionDate
            ? new Date(validatedData.transactionDate)
            : undefined


        // Start database transaction
        const result = await prisma.$transaction(async (tx) => {
            // Get all products and check stock
            const productIds = validatedData.items.map((item) => item.productId)
            const products = await tx.product.findMany({
                where: { id: { in: productIds } },
            })

            // Validate all products exist
            if (products.length !== productIds.length) {
                throw new Error("One or more products not found")
            }

            // Check stock availability and calculate total
            let totalAmount = new Decimal(0)
            const itemsWithPrice = validatedData.items.map((item) => {
                const product = products.find((p) => p.id === item.productId)!
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`)
                }
                const itemTotal = product.price.mul(item.quantity)
                totalAmount = totalAmount.add(itemTotal)
                return {
                    ...item,
                    price: product.price,
                    productName: product.name,
                }
            })

            // Create transaction
            const transaction = await tx.transaction.create({
                data: {
                    userId: userId,
                    totalAmount,
                    paymentMethod: validatedData.paymentMethod,
                    ...(transactionDate && { createdAt: transactionDate }),
                    items: {
                        create: itemsWithPrice.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: { select: { name: true, sku: true } },
                        },
                    },
                },
            })

            // Update stock and create history for each item
            for (const item of validatedData.items) {
                const product = products.find((p) => p.id === item.productId)!

                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: product.stock - item.quantity },
                })

                await tx.stockHistory.create({
                    data: {
                        productId: item.productId,
                        userId: userId,
                        changeAmount: -item.quantity,
                        type: "SALE",
                        reason: `Transaction #${transaction.id}`,
                        ...(transactionDate && { createdAt: transactionDate }),
                    },
                })
            }

            return transaction
        })

        return NextResponse.json(result, { status: 201 })
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            )
        }
        if (
            error.message.includes("not found") ||
            error.message.includes("Insufficient")
        ) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        console.error("Error creating transaction:", error)
        return NextResponse.json(
            { error: "Failed to create transaction" },
            { status: 500 }
        )
    }
}

// GET /api/pos - Get transaction history
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get("limit") || "50")
        const page = parseInt(searchParams.get("page") || "1")

        const skip = (page - 1) * limit

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true } },
                    items: {
                        include: {
                            product: { select: { name: true, sku: true } },
                        },
                    },
                },
            }),
            prisma.transaction.count(),
        ])

        return NextResponse.json({
            data: transactions,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        })
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        )
    }
}
