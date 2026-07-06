import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateEOQSchema } from "@/lib/validations"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// EOQ Formula: sqrt(2 * D * S / H)
function calculateEOQ(D: number, S: number, H: number): number {
    if (D <= 0 || S <= 0 || H <= 0) {
        throw new Error("All values must be positive")
    }
    return Math.round(Math.sqrt((2 * D * S) / H))
}

// POST /api/eoq - Calculate and save EOQ
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = calculateEOQSchema.parse(body)

        // Verify product exists
        const product = await prisma.product.findUnique({
            where: { id: validatedData.productId },
        })

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        // Calculate EOQ
        const eoqValue = calculateEOQ(
            validatedData.annualDemand,
            Number(validatedData.setupCost),
            Number(validatedData.holdingCost)
        )

        // Save result
        const eoqResult = await prisma.eOQResult.create({
            data: {
                productId: validatedData.productId,
                annualDemand: validatedData.annualDemand,
                setupCost: validatedData.setupCost,
                holdingCost: validatedData.holdingCost,
                eoqValue,
            },
            include: {
                product: { select: { name: true, sku: true } },
            },
        })

        return NextResponse.json(
            {
                ...eoqResult,
                recommendation: `Optimal order quantity for ${product.name} is ${eoqValue} units per order.`,
            },
            { status: 201 }
        )
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            )
        }
        console.error("Error calculating EOQ:", error)
        return NextResponse.json(
            { error: "Failed to calculate EOQ" },
            { status: 500 }
        )
    }
}

// GET /api/eoq - Get EOQ history
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get("productId")

        const where = productId ? { productId } : {}

        const results = await prisma.eOQResult.findMany({
            where,
            orderBy: { calculatedAt: "desc" },
            take: 50,
            include: {
                product: { select: { name: true, sku: true } },
            },
        })

        return NextResponse.json(results)
    } catch (error) {
        console.error("Error fetching EOQ results:", error)
        return NextResponse.json(
            { error: "Failed to fetch EOQ results" },
            { status: 500 }
        )
    }
}
