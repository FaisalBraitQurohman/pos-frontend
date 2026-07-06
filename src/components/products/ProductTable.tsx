"use client"

import { useEffect, useState } from "react"
import { Trash2, Loader2, Package } from "lucide-react"
import { EditProductDialog } from "./EditProductDialog"
import { AddProductDialog } from "./AddProductDialog"

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
    description?: string | null
}

export function ProductTable() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/products?limit=10000")
            const data = await res.json()
            setProducts(data.data || [])
        } catch (error) {
            console.error("Failed to fetch products:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id))
            } else {
                alert("Failed to delete product")
            }
        } catch (error) {
            console.error("Error deleting product:", error)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin mb-3" style={{ color: "hsl(22 80% 42%)" }} />
                <p className="text-sm" style={{ color: "hsl(24 10% 55%)" }}>Memuat data produk...</p>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Package className="h-10 w-10 mb-3" style={{ color: "hsl(36 20% 72%)" }} />
                <p className="text-sm" style={{ color: "hsl(24 10% 60%)" }}>Belum ada produk</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "hsla(36, 33%, 97%, 0.75)", borderColor: "hsl(36 20% 88%)", boxShadow: "0 2px 12px rgba(120,80,40,0.06)" }}>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="sticky top-0 z-10"
                        style={{ backgroundColor: "hsl(36 33% 96%)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <tr>
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
                            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-right"
                                style={{ color: "hsl(24 10% 50%)" }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b transition-colors duration-150"
                                style={{ borderColor: "rgba(0,0,0,0.03)", backgroundColor: "transparent" }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.8)"
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
                                }}
                            >
                                <td className="px-4 py-2.5">
                                    {product.imageUrl ? (
                                        <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0"
                                            style={{ backgroundColor: "hsl(36 30% 92%)" }}>
                                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
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
                                <td className="px-4 py-2.5 text-center text-sm font-semibold" style={{ color: "hsl(24 15% 25%)" }}>
                                    {product.stock}
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{
                                        backgroundColor: product.stock <= product.minStock
                                            ? "hsl(0 60% 95%)"
                                            : "hsl(120 28% 92%)",
                                        color: product.stock <= product.minStock
                                            ? "hsl(0 65% 50%)"
                                            : "hsl(130 35% 32%)"
                                    }}>
                                        {product.stock <= product.minStock ? "Low Stock" : "Aman"}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5">
                                    <div className="flex items-center justify-end gap-1">
                                        <AddProductDialog
                                            onProductAdded={fetchProducts}
                                            prefillData={{
                                                name: product.name,
                                                brand: product.brand || "",
                                                category: product.category || "",
                                                costPrice: String(Number(product.costPrice)),
                                                price: String(Number(product.price)),
                                                minStock: String(product.minStock),
                                                imageUrl: product.imageUrl || "",
                                                description: product.description || "",
                                            }}
                                        />
                                        <EditProductDialog product={product} onProductUpdated={fetchProducts} />
                                        <button
                                            className="h-8 w-8 rounded-lg flex items-center justify-center transition-all opacity-70 hover:opacity-100"
                                            style={{ color: "hsl(0 65% 50%)" }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(0 60% 95%)"}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = ""}
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Footer showing total count */}
            <div className="shrink-0 px-4 py-2 text-xs font-medium border-t"
                style={{ color: "hsl(24 10% 50%)", borderColor: "hsl(36 20% 88%)", backgroundColor: "hsl(36 33% 97%)" }}>
                Total: {products.length} produk
            </div>
        </div>
    )
}
