import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/stats - Get dashboard statistics
export async function GET() {
    try {
        // Get total products and stock
        const products = await prisma.product.findMany()
        const totalStock = products.reduce((acc, p) => acc + p.stock, 0)
        // Only flag as low-stock when minStock is explicitly set (> 0) AND stock is at or below it
        const lowStockProducts = products.filter(p => p.minStock > 0 && p.stock <= p.minStock)
        const lowStockCount = lowStockProducts.length

        // Calculate total asset value (stock × selling price for each product)
        const totalAssetValue = products.reduce(
            (acc, p) => acc + (p.stock * Number(p.price)), 0
        )
        const totalItems = products.reduce((acc, p) => acc + p.stock, 0)

        // Get today's transactions
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const todayTransactions = await prisma.transaction.findMany({
            where: {
                createdAt: { gte: today }
            }
        })

        const todayRevenue = todayTransactions.reduce(
            (acc, t) => acc + Number(t.totalAmount),
            0
        )

        // Get total revenue (all time)
        const allTransactions = await prisma.transaction.findMany()
        const totalRevenue = allTransactions.reduce(
            (acc, t) => acc + Number(t.totalAmount),
            0
        )

        // Get weekly revenue (last 7 days)
        const weeklyRevenue = []
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)

            const nextDate = new Date(date)
            nextDate.setDate(date.getDate() + 1)

            const dayTransactions = await prisma.transaction.findMany({
                where: {
                    createdAt: {
                        gte: date,
                        lt: nextDate
                    }
                }
            })

            const total = dayTransactions.reduce((acc, t) => acc + Number(t.totalAmount), 0)
            weeklyRevenue.push({
                name: days[date.getDay()],
                total
            })
        }

        // Get recent activity (last 10 transactions)
        const recentActivity = await prisma.transaction.findMany({
            take: 10,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return NextResponse.json({
            totalRevenue,
            totalStock,
            lowStockCount,
            todaySales: todayTransactions.length,
            todayRevenue,
            productCount: products.length,
            totalAssetValue,
            totalItems,
            weeklyRevenue,
            recentActivity,
            lowStockProducts: lowStockProducts.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                stock: p.stock,
                minStock: p.minStock,
            }))
        })
    } catch (error) {
        console.error("Error fetching stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        )
    }
}
