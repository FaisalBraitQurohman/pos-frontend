import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/history?date=YYYY-MM-DD
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const dateParam = searchParams.get('date')
        
        let targetDate = new Date()
        if (dateParam) {
            targetDate = new Date(dateParam)
        }
        
        // Ensure we cover the entire day from 00:00:00 to 23:59:59 local time
        const startOfDay = new Date(targetDate)
        startOfDay.setHours(0, 0, 0, 0)
        
        const endOfDay = new Date(targetDate)
        endOfDay.setHours(23, 59, 59, 999)

        const transactions = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        })

        const totalRevenue = transactions.reduce(
            (acc, t) => acc + Number(t.totalAmount),
            0
        )

        return NextResponse.json({
            date: startOfDay.toISOString().split('T')[0],
            totalTransactions: transactions.length,
            totalRevenue,
            transactions
        })
    } catch (error) {
        console.error("Error fetching history:", error)
        return NextResponse.json(
            { error: "Failed to fetch transaction history" },
            { status: 500 }
        )
    }
}
