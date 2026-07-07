"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, Loader2, ShoppingBag, AlertTriangle, TrendingUp } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { getApiUrl } from "@/lib/api"

interface TransactionItem {
    id: string
    quantity: number
    price: number
    product: { name: string }
}

interface Transaction {
    id: string
    totalAmount: number
    paymentMethod: string
    createdAt: string
    items: TransactionItem[]
}

interface WeeklyRevenue {
    name: string
    total: number
}

interface LowStockProduct {
    id: string
    name: string
    category: string
    stock: number
    minStock: number
}

interface Stats {
    totalRevenue: number
    totalStock: number
    lowStockCount: number
    todaySales: number
    todayRevenue: number
    productCount: number
    totalAssetValue: number
    totalItems: number
    weeklyRevenue: WeeklyRevenue[]
    recentActivity: Transaction[]
    lowStockProducts: LowStockProduct[]
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch(`${getApiUrl()}/api/stats`)
                const data = await res.json()
                setStats(data)
            } catch (error) {
                console.error("Failed to fetch stats:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full" style={{ backgroundColor: "hsl(36 33% 96%)" }}>
                <Loader2 className="h-10 w-10 animate-spin" style={{ color: "hsl(22 80% 42%)" }} />
            </div>
        )
    }

    /* Latest transaction */
    const latestTx = stats?.recentActivity?.[0] ?? null

    return (
        <div className="flex flex-col h-full p-5 gap-4">

            {/* ── 4 Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 shrink-0">

                {/* Omzet hari ini */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(234,88,12,0.15)] transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group"
                    style={{ borderColor: "rgba(255,255,255,0.8)", boxShadow: "0 4px 16px rgba(120,80,40,0.05)" }}>
                    <div className="absolute top-0 right-0 p-8 bg-gradient-to-bl from-orange-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />
                    <div className="flex items-start justify-between relative z-10">
                        <p className="text-xs font-medium" style={{ color: "hsl(24 10% 50%)" }}>Omzet hari ini</p>
                        <ArrowUpRight className="h-3.5 w-3.5 mt-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "hsl(24 10% 65%)" }} />
                    </div>
                    <p className="text-2xl font-bold leading-none relative z-10" style={{ color: "hsl(24 15% 18%)" }}>
                        Rp {(stats?.todayRevenue || 0).toLocaleString("id-ID")}
                    </p>
                    <p className="text-[11px] leading-snug relative z-10" style={{ color: "hsl(24 10% 55%)" }}>
                        Akumulasi transaksi yang sudah masuk sejak pagi.
                    </p>
                </div>

                {/* Transaksi hari ini — green */}
                <div className="rounded-2xl p-4 border hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(34,197,94,0.15)] transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group"
                    style={{ backgroundColor: "rgba(235, 248, 235, 0.8)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.8)", boxShadow: "0 4px 16px rgba(60,120,60,0.05)" }}>
                    <div className="absolute top-0 right-0 p-8 bg-gradient-to-bl from-green-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />
                    <div className="flex items-start justify-between relative z-10">
                        <p className="text-xs font-medium" style={{ color: "hsl(130 20% 38%)" }}>Transaksi hari ini</p>
                        <ArrowUpRight className="h-3.5 w-3.5 mt-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "hsl(130 20% 50%)" }} />
                    </div>
                    <p className="text-2xl font-bold leading-none relative z-10" style={{ color: "hsl(130 30% 22%)" }}>
                        {stats?.todaySales || 0} transaksi
                    </p>
                    <p className="text-[11px] leading-snug relative z-10" style={{ color: "hsl(130 15% 42%)" }}>
                        Ringkasan cepat untuk memantau ritme kasir.
                    </p>
                </div>

                {/* Stok menipis — orange glowing */}
                <div className="rounded-2xl p-4 border hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(234,88,12,0.4)] transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group bg-gradient-to-br from-orange-500 to-amber-600"
                    style={{ borderColor: "rgba(255,255,255,0.2)", boxShadow: "0 8px 24px rgba(234,88,12,0.25)" }}>
                    <div className="absolute top-0 right-0 p-8 bg-gradient-to-bl from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />
                    <div className="flex items-start justify-between relative z-10">
                        <p className="text-xs font-medium text-orange-50">Stok menipis</p>
                        <ArrowUpRight className="h-3.5 w-3.5 mt-0.5 text-orange-200 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="text-2xl font-bold leading-none text-white relative z-10 drop-shadow-md">
                        {stats?.lowStockCount || 0} item
                    </p>
                    <p className="text-[11px] leading-snug text-orange-100 relative z-10">
                        Barang yang mulai rawan kosong dan sebaiknya segera dicek.
                    </p>
                </div>

                {/* Total produk */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(120,80,40,0.1)] transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group"
                    style={{ borderColor: "rgba(255,255,255,0.8)", boxShadow: "0 4px 16px rgba(120,80,40,0.05)" }}>
                    <div className="absolute top-0 right-0 p-8 bg-gradient-to-bl from-slate-100/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />
                    <div className="flex items-start justify-between relative z-10">
                        <p className="text-xs font-medium" style={{ color: "hsl(24 10% 50%)" }}>SKU aktif</p>
                        <ArrowUpRight className="h-3.5 w-3.5 mt-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "hsl(24 10% 65%)" }} />
                    </div>
                    <p className="text-2xl font-bold leading-none relative z-10" style={{ color: "hsl(24 15% 18%)" }}>
                        {stats?.productCount || 0} produk
                    </p>
                    <p className="text-[11px] leading-snug relative z-10" style={{ color: "hsl(24 10% 55%)" }}>
                        Total {(stats?.totalItems || 0).toLocaleString("id-ID")} unit tersedia di gudang.
                    </p>
                </div>
            </div>

            {/* ── Bottom Row — fills remaining space ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-3 flex-1 min-h-0">

                {/* ── Aktivitas Terbaru (3/5) ── */}
                <div className="xl:col-span-3 bg-white/80 backdrop-blur-xl rounded-2xl border p-4 flex flex-col gap-3 shadow-[0_8px_30px_rgba(120,80,40,0.04)] min-h-0"
                    style={{ borderColor: "rgba(255,255,255,0.7)" }}>
                    <div className="shrink-0">
                        <h2 className="text-base font-bold" style={{ color: "hsl(24 15% 18%)" }}>Aktivitas terbaru</h2>
                        <p className="text-[11px] mt-0.5" style={{ color: "hsl(24 10% 52%)" }}>
                            Semua ringkasan yang sebelumnya membuat layar kasir terasa penuh dipindahkan ke sini.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 flex-1 min-h-0">
                        {/* Transaksi Terakhir — dark card (2/5) */}
                        <div className="md:col-span-2 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group"
                            style={{ backgroundColor: "hsl(20 18% 15%)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ShoppingBag className="h-3.5 w-3.5 text-orange-300" />
                                    <span className="text-xs font-semibold text-orange-200">Transaksi terakhir</span>
                                </div>
                                {latestTx ? (
                                    <>
                                        <p className="text-2xl font-bold text-white leading-none">
                                            Rp {Number(latestTx.totalAmount).toLocaleString("id-ID")}
                                        </p>
                                        <p className="text-[11px] text-orange-200/70 mt-1">
                                            {latestTx.paymentMethod} • {new Date(latestTx.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                        {/* Items */}
                                        <div className="mt-3 space-y-1.5">
                                            {latestTx.items.slice(0, 4).map(item => (
                                                <div key={item.id} className="flex items-center justify-between">
                                                    <span className="text-[11px] text-white/70 truncate pr-2">{item.product.name} x{item.quantity}</span>
                                                    <span className="text-[11px] text-white/90 font-medium whitespace-nowrap">
                                                        Rp {(item.quantity * Number(item.price)).toLocaleString("id-ID")}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-white/40 mt-2">Belum ada transaksi yang tersimpan.</p>
                                )}
                            </div>
                        </div>

                        {/* Timeline Transaksi (3/5) */}
                        <div className="md:col-span-3 flex flex-col gap-2 min-h-0 overflow-hidden mt-2 md:mt-0">
                            <div className="flex items-center gap-1.5 shrink-0">
                                <TrendingUp className="h-3.5 w-3.5" style={{ color: "hsl(22 80% 42%)" }} />
                                <span className="text-xs font-semibold" style={{ color: "hsl(24 15% 35%)" }}>Timeline transaksi</span>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 custom-scrollbar">
                                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                    stats.recentActivity.map(tx => (
                                        <div key={tx.id}
                                            className="rounded-xl px-3 py-2.5 hover:scale-[1.01] transition-transform duration-150"
                                            style={{ backgroundColor: "hsl(36 33% 96%)", border: "1px solid hsl(36 20% 90%)" }}>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold" style={{ color: "hsl(24 15% 18%)" }}>
                                                    Rp {Number(tx.totalAmount).toLocaleString("id-ID")}
                                                </p>
                                                <p className="text-[11px]" style={{ color: "hsl(24 10% 55%)" }}>
                                                    {new Date(tx.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}, {new Date(tx.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                            <p className="text-[11px] mt-0.5" style={{ color: "hsl(24 10% 55%)" }}>
                                                {tx.items.length} produk • {tx.paymentMethod}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full py-6"
                                        style={{ color: "hsl(24 10% 65%)" }}>
                                        <p className="text-sm">Belum ada transaksi.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Kanan (2/5) ── */}
                <div className="xl:col-span-2 flex flex-col gap-3 min-h-0">

                    {/* Stok perlu perhatian */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border p-4 flex flex-col gap-3 shadow-[0_8px_30px_rgba(120,80,40,0.04)] flex-1 min-h-0"
                        style={{ borderColor: "rgba(255,255,255,0.7)" }}>
                        <div className="flex items-start justify-between shrink-0">
                            <div>
                                <h2 className="text-base font-bold" style={{ color: "hsl(24 15% 18%)" }}>Stok perlu perhatian</h2>
                                <p className="text-[11px] mt-0.5" style={{ color: "hsl(24 10% 52%)" }}>
                                    Cocok dibuka sebelum restok atau saat mau tutup toko.
                                </p>
                            </div>
                            {(stats?.lowStockProducts ?? []).length > 0 && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ml-2"
                                    style={{ backgroundColor: "hsl(22 80% 42%)", color: "white" }}>
                                    {stats!.lowStockProducts.length} item
                                </span>
                            )}
                        </div>

                        {(stats?.lowStockProducts ?? []).length === 0 ? (
                            <div className="rounded-xl px-3 py-2.5 text-sm font-medium"
                                style={{ backgroundColor: "hsl(120 28% 93%)", color: "hsl(130 30% 30%)" }}>
                                Semua stok aman. Belum ada produk yang menyentuh batas minimum.
                            </div>
                        ) : (
                            <div className="space-y-1.5 overflow-y-auto pr-0.5 flex-1 min-h-0 custom-scrollbar">
                                {stats!.lowStockProducts.map(p => (
                                    <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                                        style={{ backgroundColor: "hsl(36 33% 96%)", border: "1px solid hsl(36 20% 90%)" }}>
                                        <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: "hsl(28 90% 94%)" }}>
                                            <AlertTriangle className="h-3.5 w-3.5" style={{ color: "hsl(22 80% 45%)" }} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-semibold truncate" style={{ color: "hsl(24 15% 20%)" }}>
                                                {p.name}
                                            </p>
                                            <p className="text-[10px]" style={{ color: "hsl(24 10% 55%)" }}>
                                                {p.category}
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                                            style={{ backgroundColor: "hsl(22 80% 42%)", color: "white" }}>
                                            {p.stock} / min {p.minStock}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Revenue mingguan mini chart */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border p-4 flex flex-col gap-2 shadow-[0_8px_30px_rgba(120,80,40,0.04)] shrink-0"
                        style={{ borderColor: "rgba(255,255,255,0.7)" }}>
                        <div>
                            <h2 className="text-sm font-bold" style={{ color: "hsl(24 15% 18%)" }}>Revenue mingguan</h2>
                            <p className="text-[11px] mt-0.5" style={{ color: "hsl(24 10% 52%)" }}>7 hari terakhir</p>
                        </div>
                        <div style={{ height: "110px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.weeklyRevenue || []} barSize={16} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" stroke="hsl(24 10% 65%)" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(24 10% 65%)" fontSize={9} tickLine={false} axisLine={false}
                                        tickFormatter={v => v === 0 ? "0" : `${v / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: "hsl(36 33% 95%)" }}
                                        contentStyle={{ borderRadius: "10px", border: "1px solid hsl(36 20% 88%)", fontSize: "11px" }}
                                        formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, "Revenue"]}
                                    />
                                    <Bar dataKey="total" fill="hsl(22 80% 42%)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
