"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { getApiUrl } from "@/lib/api"

interface StockHistory {
    id: string
    createdAt: string
    product: { name: string; sku: string }
    type: "IN" | "OUT" | "SALE" | "ADJUSTMENT"
    changeAmount: number
    reason: string | null
    user: { name: string } | null
}

export function StockHistoryTable() {
    const [history, setHistory] = useState<StockHistory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await fetch(`${getApiUrl()}/api/stock?limit=10000`)
                const data = await res.json()
                setHistory(data || [])
            } catch (error) {
                console.error("Failed to fetch stock history:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>User</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                No stock history found
                            </TableCell>
                        </TableRow>
                    ) : (
                        history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{formatDate(item.createdAt)}</TableCell>
                                <TableCell className="font-medium">{item.product.name}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            item.type === "IN"
                                                ? "default"
                                                : item.type === "SALE"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {item.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className={item.changeAmount > 0 ? "text-green-600" : "text-red-600"}>
                                    {item.changeAmount > 0 ? "+" : ""}{item.changeAmount}
                                </TableCell>
                                <TableCell>{item.reason || "-"}</TableCell>
                                <TableCell>{item.user?.name || "System"}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
