import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stockInSchema, stockOutSchema } from "@/lib/validations"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// POST /api/stock - Handle stock in/out operations
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const action = searchParams.get("action") // "in" or "out"

        if (!action || !["in", "out"].includes(action)) {
            return NextResponse.json(
                { error: "Invalid action. Use ?action=in or ?action=out" },
                { status: 400 }
            )
        }

        const body = await request.json()
        const schema = action === "in" ? stockInSchema : stockOutSchema
        const validatedData = schema.parse(body)

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            // Get current product
            const product = await tx.product.findUnique({
                where: { id: validatedData.productId },
            })

            if (!product) {
                throw new Error("Product not found")
            }

            const changeAmount =
                action === "in" ? validatedData.quantity : -validatedData.quantity

            // Check stock for stock-out
            if (action === "out" && product.stock < validatedData.quantity) {
                throw new Error("Insufficient stock")
            }

            // Update product stock
            const updatedProduct = await tx.product.update({
                where: { id: validatedData.productId },
                data: { stock: product.stock + changeAmount },
            })

            // Create stock history
            const stockHistory = await tx.stockHistory.create({
                data: {
                    productId: validatedData.productId,
                    userId: session.user.id,
                    changeAmount,
                    type: action === "in" ? "IN" : "OUT",
                    reason: validatedData.reason,
                },
            })

            return { product: updatedProduct, stockHistory }
        })

        return NextResponse.json(result, { status: 201 })
    } catch (error: any) {
        if (error.message === "Product not found") {
            return NextResponse.json({ error: error.message }, { status: 404 })
        }
        if (error.message === "Insufficient stock") {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        console.error("Error processing stock:", error)
        return NextResponse.json(
            { error: "Failed to process stock operation" },
            { status: 500 }
        )
    }
}

// GET /api/stock - Get stock history
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get("productId")
        const limitParam = parseInt(searchParams.get("limit") || "0");
        const take = limitParam > 0 ? limitParam : undefined;

        const where = productId ? { productId } : {}

        const history = await prisma.stockHistory.findMany({
            where,
            ...(take ? { take } : {}),
            orderBy: { createdAt: "desc" },
            include: {
                product: { select: { name: true, sku: true } },
                user: { select: { name: true } },
            },
        })

        return NextResponse.json(history)
    } catch (error) {
        console.error("Error fetching stock history:", error)
        return NextResponse.json(
            { error: "Failed to fetch stock history" },
            { status: 500 }
        )
    }
}
