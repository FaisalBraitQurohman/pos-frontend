"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Package, ChevronDown, Search, X } from "lucide-react"
import { getApiUrl, resolveImageUrl } from "@/lib/api"

interface Product {
    id: string
    name: string
    brand: string | null
    size: string | null
    price: number
    category: string | null
    stock: number
    imageUrl?: string | null
}

interface ProductGridProps {
    onAddToCart: (product: Product) => void
    searchTerm?: string
}

export function ProductGrid({ onAddToCart, searchTerm = "" }: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>("All")
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
    const [categorySearch, setCategorySearch] = useState("")
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch(`${getApiUrl()}/api/products?limit=1000`)
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
    }, [])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setCategoryDropdownOpen(false)
                setCategorySearch("")
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64" style={{ color: "hsl(24 10% 55%)" }}>
                <Loader2 className="h-8 w-8 animate-spin mb-3" style={{ color: "hsl(22 80% 42%)" }} />
                <p className="text-sm">Memuat produk...</p>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border"
                style={{ backgroundColor: "hsl(36 33% 97%)", borderColor: "hsl(36 20% 88%)" }}>
                <Package className="h-10 w-10 mb-3" style={{ color: "hsl(36 20% 72%)" }} />
                <p className="text-sm" style={{ color: "hsl(24 10% 55%)" }}>Tidak ada produk tersedia</p>
            </div>
        )
    }

    const categories = ["All", ...Array.from(new Set(products.map(p => p.category || "General"))).sort()]
    const filteredCategories = categorySearch
        ? categories.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase()))
        : categories
    
    const categoryFiltered = selectedCategory === "All" 
        ? products 
        : products.filter(p => (p.category || "General") === selectedCategory)
    
    const displayedProducts = searchTerm
        ? categoryFiltered.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : categoryFiltered

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Category Dropdown */}
            <div className="flex items-center gap-3 shrink-0 px-1" ref={dropdownRef}>
                <div className="relative">
                    <button
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition-all"
                        style={{
                            backgroundColor: "white",
                            borderColor: "hsl(36 20% 88%)",
                            color: "hsl(24 15% 25%)"
                        }}
                        onClick={() => {
                            setCategoryDropdownOpen(!categoryDropdownOpen)
                            setCategorySearch("")
                        }}
                    >
                        <span className="text-xs font-medium" style={{ color: "hsl(24 10% 55%)" }}>Kategori:</span>
                        {selectedCategory}
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                            style={{ color: "hsl(24 10% 55%)" }} />
                    </button>

                    {categoryDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-64 rounded-xl shadow-lg z-50 overflow-hidden border"
                            style={{ backgroundColor: "white", borderColor: "hsl(36 20% 86%)" }}>
                            <div className="p-2 border-b" style={{ borderColor: "hsl(36 20% 91%)" }}>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
                                        style={{ color: "hsl(24 10% 55%)" }} />
                                    <input
                                        type="text"
                                        placeholder="Cari kategori..."
                                        value={categorySearch}
                                        onChange={(e) => setCategorySearch(e.target.value)}
                                        className="w-full h-8 pl-8 pr-3 text-sm rounded-lg outline-none border"
                                        style={{
                                            backgroundColor: "hsl(36 33% 96%)",
                                            borderColor: "hsl(36 20% 88%)",
                                            color: "hsl(24 15% 25%)"
                                        }}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto py-1 custom-scrollbar">
                                {filteredCategories.length === 0 ? (
                                    <p className="text-center text-sm py-3" style={{ color: "hsl(24 10% 60%)" }}>Tidak ditemukan</p>
                                ) : (
                                    filteredCategories.map((cat) => (
                                        <button
                                            key={cat}
                                            className="w-full text-left px-4 py-2 text-sm font-medium transition-colors"
                                            style={selectedCategory === cat
                                                ? { backgroundColor: "hsl(22 80% 42%)", color: "white" }
                                                : { color: "hsl(24 15% 28%)" }
                                            }
                                            onMouseEnter={e => {
                                                if (selectedCategory !== cat)
                                                    (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(36 33% 94%)"
                                            }}
                                            onMouseLeave={e => {
                                                if (selectedCategory !== cat)
                                                    (e.currentTarget as HTMLElement).style.backgroundColor = ""
                                            }}
                                            onClick={() => {
                                                setSelectedCategory(cat)
                                                setCategoryDropdownOpen(false)
                                                setCategorySearch("")
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {selectedCategory !== "All" && (
                    <button
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                        style={{ color: "hsl(24 15% 40%)" }}
                        onClick={() => setSelectedCategory("All")}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(36 20% 88%)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = ""}
                    >
                        <X className="h-3 w-3" />
                        Reset
                    </button>
                )}

                <span className="text-xs ml-auto" style={{ color: "hsl(24 10% 55%)" }}>
                    {displayedProducts.length} produk
                </span>
            </div>

            {/* Product Table */}
            <div className="flex-1 overflow-y-auto min-h-0 mt-3 rounded-2xl border custom-scrollbar backdrop-blur-2xl shadow-xl"
                style={{ backgroundColor: "hsla(36, 33%, 97%, 0.75)", borderColor: "rgba(255,255,255,0.5)" }}>
                <table className="w-full table-fixed">
                    <thead className="sticky top-0 z-10"
                        style={{ backgroundColor: "hsla(36, 33%, 96%, 0.9)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                        <tr>
                            <th className="text-left text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider pl-3 pr-1 sm:px-4 py-2.5"
                                style={{ color: "hsl(24 10% 50%)" }}>Produk</th>
                            <th className="text-right text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-1 sm:px-4 py-2.5 w-[75px] sm:w-24"
                                style={{ color: "hsl(24 10% 50%)" }}>Harga</th>
                            <th className="text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-1 sm:px-4 py-2.5 w-[50px] sm:w-20"
                                style={{ color: "hsl(24 10% 50%)" }}>Stok</th>
                            <th className="w-9 sm:w-12 pr-2 sm:pr-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedProducts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-12">
                                    <Package className="h-8 w-8 mx-auto mb-2" style={{ color: "hsl(36 20% 75%)" }} />
                                    <p className="text-sm" style={{ color: "hsl(24 10% 60%)" }}>Tidak ada produk ditemukan</p>
                                </td>
                            </tr>
                        ) : (
                            displayedProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b transition-all duration-300 relative group"
                                    style={{
                                        borderColor: "rgba(0,0,0,0.03)",
                                        opacity: product.stock <= 0 ? 0.45 : 1,
                                        cursor: product.stock > 0 ? "pointer" : "not-allowed",
                                        backgroundColor: "transparent"
                                    }}
                                    onClick={() => product.stock > 0 && onAddToCart(product)}
                                    onMouseEnter={e => {
                                        if (product.stock > 0) {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.8)";
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                                    }}
                                >
                                    <td className="pl-3 pr-1 sm:px-4 py-2.5 sm:py-3 overflow-hidden">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            {product.imageUrl ? (
                                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg overflow-hidden shrink-0"
                                                    style={{ backgroundColor: "hsl(36 30% 92%)" }}>
                                                    <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="h-full w-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{ backgroundColor: "hsl(36 30% 92%)" }}>
                                                    <Package className="h-4 w-4 sm:h-4 sm:w-4" style={{ color: "hsl(36 20% 68%)" }} />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[13px] sm:text-sm font-bold truncate" style={{ color: "hsl(24 15% 20%)" }}>{
                                                    product.brand || product.name}</p>
                                                {product.size && (
                                                    <p className="text-[11px] sm:text-xs truncate" style={{ color: "hsl(24 10% 50%)" }}>{product.size}</p>
                                                )}
                                                <p className="text-[9px] sm:text-[10px] mt-0.5 truncate" style={{ color: "hsl(24 10% 60%)" }}>
                                                    {product.category || "General"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-1 sm:px-4 py-2.5 sm:py-3 text-right">
                                        <span className="text-[11px] sm:text-sm font-bold" style={{ color: "hsl(22 80% 38%)" }}>
                                            Rp {Number(product.price).toLocaleString("id-ID")}
                                        </span>
                                    </td>
                                    <td className="px-1 sm:px-4 py-2.5 sm:py-3 text-center">
                                        <span className="text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full" style={{
                                            backgroundColor: product.stock <= 0
                                                ? "hsl(36 20% 90%)"
                                                : product.stock <= 5
                                                    ? "hsl(28 90% 93%)"
                                                    : "hsl(120 28% 92%)",
                                            color: product.stock <= 0
                                                ? "hsl(24 10% 58%)"
                                                : product.stock <= 5
                                                    ? "hsl(22 80% 40%)"
                                                    : "hsl(130 35% 32%)"
                                        }}>
                                            {product.stock <= 0 ? "Habis" : product.stock}
                                        </span>
                                    </td>
                                    <td className="pr-2 sm:pr-4 pl-1 sm:pl-3 py-2.5 sm:py-3 text-center">
                                        <button
                                            disabled={product.stock <= 0}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (product.stock > 0) onAddToCart(product)
                                            }}
                                            className="h-7 w-7 rounded-lg flex items-center justify-center transition-all mx-auto"
                                            style={{
                                                backgroundColor: product.stock <= 0 ? "hsl(36 20% 92%)" : "hsl(22 80% 42%)",
                                                color: product.stock <= 0 ? "hsl(24 10% 65%)" : "white",
                                                cursor: product.stock <= 0 ? "not-allowed" : "pointer"
                                            }}
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
