import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateProductSchema } from "@/lib/validations"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/products/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const product = await prisma.product.findUnique({
            where: { id },
        })

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error("Error fetching product:", error)
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        )
    }
}

// PUT /api/products/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Skip auth check for development
        // const session = await getServerSession(authOptions)
        // if (!session || session.user.role !== "ADMIN") {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        // }

        const { id } = await params
        const body = await request.json()
        const validatedData = updateProductSchema.parse(body)

        const product = await prisma.product.update({
            where: { id },
            data: validatedData,
        })

        return NextResponse.json(product)
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }
        console.error("Error updating product:", error)
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        )
    }
}

// DELETE /api/products/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Skip auth check for development
        // const session = await getServerSession(authOptions)
        // if (!session || session.user.role !== "ADMIN") {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        // }

        const { id } = await params
        
        // Delete related records first within a transaction to avoid foreign key constraints
        await prisma.$transaction([
            prisma.stockHistory.deleteMany({ where: { productId: id } }),
            prisma.transactionItem.deleteMany({ where: { productId: id } }),
            prisma.eOQResult.deleteMany({ where: { productId: id } }),
            prisma.product.delete({
                where: { id },
            })
        ])

        return NextResponse.json({ message: "Product deleted successfully" })
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }
        console.error("Error deleting product:", error)
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        )
    }
}
