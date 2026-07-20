"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar, ShoppingBag, Receipt, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getApiUrl } from "@/lib/api"

interface TransactionItem {
    id: string
    quantity: number
    price: number
    product: {
        name: string
        sku: string
    }
}

interface Transaction {
    id: string
    totalAmount: number
    paymentMethod: string
    createdAt: string
    items: TransactionItem[]
}

interface HistoryData {
    date: string
    totalTransactions: number
    totalRevenue: number
    transactions: Transaction[]
}

export default function HistoryPage() {
    const todayStr = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
    const [selectedDate, setSelectedDate] = useState<string>(todayStr)
    const [data, setData] = useState<HistoryData | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${getApiUrl()}/api/history?date=${selectedDate}`)
                const result = await res.json()
                setData(result)
            } catch (error) {
                console.error("Failed to fetch history:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [selectedDate])

    return (
        <div className="flex flex-col h-screen p-6 lg:p-8 space-y-4 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: "hsl(24 15% 18%)" }}>
                        Riwayat Transaksi
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: "hsl(24 10% 50%)" }}>
                        Lihat detail penjualan harian dan rekap transaksi.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border"
                    style={{ borderColor: "hsl(36 20% 88%)", boxShadow: "0 2px 8px rgba(120,80,40,0.06)" }}>
                    <Calendar className="h-5 w-5 ml-2" style={{ color: "hsl(24 10% 55%)" }} />
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border-none shadow-none focus-visible:ring-0 bg-transparent cursor-pointer font-medium w-auto"
                        style={{ color: "hsl(24 15% 25%)" }}
                        max={todayStr}
                    />
                    {selectedDate !== todayStr && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedDate(todayStr)}
                            className="rounded-xl h-8 px-3 text-xs"
                            style={{ backgroundColor: "hsl(36 33% 92%)", color: "hsl(24 15% 30%)" }}
                        >
                            Hari ini
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white rounded-2xl p-5 border flex flex-col gap-2"
                    style={{ borderColor: "hsl(36 20% 88%)", boxShadow: "0 2px 12px rgba(120,80,40,0.06)" }}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium" style={{ color: "hsl(24 10% 50%)" }}>
                            Revenue {selectedDate === todayStr ? "Hari ini" : selectedDate}
                        </span>
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: "hsl(36 33% 93%)" }}>
                            <DollarSign className="h-4 w-4" style={{ color: "hsl(22 80% 42%)" }} />
                        </div>
                    </div>
                    {loading ? (
                        <div className="h-8 rounded animate-pulse" style={{ backgroundColor: "hsl(36 20% 90%)" }} />
                    ) : (
                        <p className="text-3xl font-bold" style={{ color: "hsl(24 15% 18%)" }}>
                            Rp {(data?.totalRevenue || 0).toLocaleString("id-ID")}
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-5 border flex flex-col gap-2"
                    style={{ borderColor: "hsl(36 20% 88%)", boxShadow: "0 2px 12px rgba(120,80,40,0.06)" }}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium" style={{ color: "hsl(24 10% 50%)" }}>Total Transaksi</span>
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: "hsl(120 30% 93%)" }}>
                            <Receipt className="h-4 w-4" style={{ color: "hsl(130 40% 38%)" }} />
                        </div>
                    </div>
                    {loading ? (
                        <div className="h-8 rounded animate-pulse" style={{ backgroundColor: "hsl(36 20% 90%)" }} />
                    ) : (
                        <p className="text-3xl font-bold" style={{ color: "hsl(24 15% 18%)" }}>
                            {data?.totalTransactions || 0}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white/80 backdrop-blur-xl rounded-2xl border overflow-hidden flex flex-col relative shadow-xl"
                style={{ borderColor: "rgba(255,255,255,0.7)" }}>
                <div className="p-5 border-b flex justify-between items-center shrink-0"
                    style={{ borderColor: "hsl(36 20% 90%)" }}>
                    <h2 className="font-bold text-base" style={{ color: "hsl(24 15% 18%)" }}>Detail Transaksi</h2>
                    <span className="text-sm" style={{ color: "hsl(24 10% 55%)" }}>{data?.transactions?.length || 0} data ditemukan</span>
                </div>
                
                <div className="flex-1 min-h-0 overflow-y-auto p-5" style={{ backgroundColor: "hsla(36, 33%, 97%, 0.5)" }}>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 h-24 animate-pulse" />
                            ))}
                        </div>
                    ) : !data?.transactions || data.transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12" style={{ color: "hsl(24 10% 60%)" }}>
                            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 border"
                                style={{ borderColor: "hsl(36 20% 88%)" }}>
                                <Receipt className="h-8 w-8" style={{ color: "hsl(36 20% 75%)" }} />
                            </div>
                            <p className="font-medium text-base">Tidak ada transaksi</p>
                            <p className="text-sm mt-0.5" style={{ color: "hsl(24 10% 65%)" }}>Tidak ada penjualan pada tanggal ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.transactions.map((transaction) => (
                                <div key={transaction.id} className="bg-white/90 p-4 rounded-xl border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                    style={{ borderColor: "rgba(255,255,255,0.8)" }}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: "hsl(36 33% 93%)" }}>
                                                <ShoppingBag className="h-5 w-5" style={{ color: "hsl(22 80% 42%)" }} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm" style={{ color: "hsl(24 15% 20%)" }}>
                                                    Order #{transaction.id.slice(0, 8)}
                                                </p>
                                                <p className="text-xs" style={{ color: "hsl(24 10% 55%)" }}>
                                                    {transaction.paymentMethod}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="font-bold text-base" style={{ color: "hsl(130 40% 38%)" }}>
                                                Rp {Number(transaction.totalAmount).toLocaleString("id-ID")}
                                            </p>
                                            <p className="text-xs" style={{ color: "hsl(24 10% 55%)" }}>
                                                {transaction.items.length} item
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t flex flex-wrap gap-1.5" style={{ borderColor: "hsl(36 20% 92%)" }}>
                                        {transaction.items.map((item) => (
                                            <div key={item.id} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs border"
                                                style={{ backgroundColor: "hsl(36 33% 95%)", borderColor: "hsl(36 20% 87%)", color: "hsl(24 15% 30%)" }}>
                                                <span className="font-medium">{item.product.name}</span>
                                                <span className="mx-1.5" style={{ color: "hsl(36 20% 70%)" }}>•</span>
                                                <span>{item.quantity}x</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
