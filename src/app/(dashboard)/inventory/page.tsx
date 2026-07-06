"use client"

import { useEffect, useState } from "react"
import { Loader2, Package, AlertTriangle } from "lucide-react"
import { StockDialog } from "@/components/inventory/StockDialog"
import { getApiUrl } from "@/lib/api"

interface Product {
    id: string
    sku: string
    name: string
    brand: string | null
    size: string | null
    category: string | null
    price: number
    costPrice: number
    stock: number
    minStock: number
    imageUrl?: string | null
}

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleStockUpdated = () => {
        setRefreshKey(prev => prev + 1)
    }

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true)
            try {
                const res = await fetch(`${getApiUrl()}/api/products?limit=10000`)
                const data = await res.json()
                const sorted = (data.data || []).sort((a: Product, b: Product) =>
                    a.name.localeCompare(b.name, "id")
                )
                setProducts(sorted)
            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [refreshKey])

    return (
        <div className="flex flex-col h-full p-6 lg:p-8 gap-4">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(24 15% 18%)" }}>
                        Inventory Management
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: "hsl(24 10% 50%)" }}>
                        Daftar seluruh produk dan stok yang tersedia. Menampilkan {products.length} produk.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <StockDialog type="in" onStockUpdated={handleStockUpdated} />
                    <StockDialog type="out" onStockUpdated={handleStockUpdated} />
                </div>
            </div>

            {/* Table container — fills all remaining space */}
            <div className="flex-1 min-h-0 bg-white rounded-2xl border overflow-hidden"
                style={{ borderColor: "hsl(36 20% 88%)", boxShadow: "0 2px 12px rgba(120,80,40,0.06)" }}>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin mb-3" style={{ color: "hsl(22 80% 42%)" }} />
                        <p className="text-sm" style={{ color: "hsl(24 10% 55%)" }}>Memuat data produk...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Package className="h-10 w-10 mb-3" style={{ color: "hsl(36 20% 72%)" }} />
                        <p className="text-sm" style={{ color: "hsl(24 10% 60%)" }}>Belum ada produk</p>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 z-10"
                                style={{ backgroundColor: "hsl(36 33% 97%)", borderBottom: "2px solid hsl(36 20% 88%)" }}>
                                <tr>
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider w-12 text-center"
                                        style={{ color: "hsl(24 10% 50%)" }}>No</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider w-16"
                                        style={{ color: "hsl(24 10% 50%)" }}>Gambar</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider"
                                        style={{ color: "hsl(24 10% 50%)" }}>SKU</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider"
                                        style={{ color: "hsl(24 10% 50%)" }}>Produk</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider"
                                        style={{ color: "hsl(24 10% 50%)" }}>Kategori</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider"
                                        style={{ color: "hsl(24 10% 50%)" }}>Harga Jual</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-center"
                                        style={{ color: "hsl(24 10% 50%)" }}>Stok</th>
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-center"
                                        style={{ color: "hsl(24 10% 50%)" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id}
                                        className="border-b transition-colors duration-150"
                                        style={{ borderColor: "rgba(0,0,0,0.04)" }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(36 33% 98%)"
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = ""
                                        }}
                                    >
                                        <td className="px-4 py-2.5 text-center text-xs font-medium"
                                            style={{ color: "hsl(24 10% 55%)" }}>
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            {product.imageUrl ? (
                                                <div className="h-9 w-9 rounded-lg overflow-hidden shrink-0"
                                                    style={{ backgroundColor: "hsl(36 30% 92%)" }}>
                                                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{ backgroundColor: "hsl(36 30% 92%)" }}>
                                                    <Package className="h-4 w-4" style={{ color: "hsl(36 20% 68%)" }} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2.5 text-xs font-medium" style={{ color: "hsl(24 15% 45%)" }}>
                                            {product.sku}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <p className="text-sm font-bold" style={{ color: "hsl(24 15% 20%)" }}>
                                                {product.brand || product.name}
                                            </p>
                                            {product.size && (
                                                <p className="text-xs" style={{ color: "hsl(24 10% 50%)" }}>{product.size}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-2.5 text-xs" style={{ color: "hsl(24 10% 50%)" }}>
                                            {product.category || "-"}
                                        </td>
                                        <td className="px-4 py-2.5 text-sm font-bold" style={{ color: "hsl(24 15% 25%)" }}>
                                            Rp {Number(product.price).toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-4 py-2.5 text-center">
                                            <span className="text-sm font-semibold" style={{ color: "hsl(24 15% 25%)" }}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-center">
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1" style={{
                                                backgroundColor: product.stock <= product.minStock
                                                    ? "hsl(0 60% 95%)"
                                                    : "hsl(120 28% 92%)",
                                                color: product.stock <= product.minStock
                                                    ? "hsl(0 65% 50%)"
                                                    : "hsl(130 35% 32%)"
                                            }}>
                                                {product.stock <= product.minStock && (
                                                    <AlertTriangle className="h-3 w-3" />
                                                )}
                                                {product.stock <= product.minStock ? "Low Stock" : "Aman"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
