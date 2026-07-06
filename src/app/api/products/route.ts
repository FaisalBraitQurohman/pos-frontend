import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createProductSchema } from "@/lib/validations"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/products - List all products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search") || ""

        const where = search
            ? {
                OR: [
                    { name: { contains: search } },
                    { sku: { contains: search } },
                    { brand: { contains: search } },
                ],
            }
            : {}

        // When limit is very large (>=1000) or 0, fetch ALL products without pagination
        const fetchAll = limit === 0 || limit >= 1000

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                ...(fetchAll ? {} : { skip: (page - 1) * limit, take: limit }),
                orderBy: { createdAt: "desc" },
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json({
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: fetchAll ? 1 : Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Error fetching products:", error)
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        )
    }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
    try {
        // Skip auth check for development (remove in production)
        // const session = await getServerSession(authOptions)
        // if (!session || session.user.role !== "ADMIN") {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        // }

        const body = await request.json()
        const validatedData = createProductSchema.parse(body)

        // Check if SKU already exists
        const existingProduct = await prisma.product.findUnique({
            where: { sku: validatedData.sku },
        })

        if (existingProduct) {
            return NextResponse.json(
                { error: "Product with this SKU already exists" },
                { status: 400 }
            )
        }

        const product = await prisma.product.create({
            data: validatedData,
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            )
        }
        console.error("Error creating product:", error)
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        )
    }
}
