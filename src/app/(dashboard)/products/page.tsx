"use client"

import { useState } from "react"
import { ProductTable } from "@/components/products/ProductTable"
import { AddProductDialog } from "@/components/products/AddProductDialog"

export default function ProductsPage() {
    const [refreshKey, setRefreshKey] = useState(0)

    const handleProductAdded = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className="flex flex-col h-full pt-4 sm:pt-6 lg:pt-8 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-3 px-4 sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: "hsl(24 15% 18%)" }}>
                        Inventaris
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: "hsl(24 10% 50%)" }}>
                        Kelola inventaris produk toko Anda di sini.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <AddProductDialog onProductAdded={handleProductAdded} />
                </div>
            </div>

            {/* Table fills all remaining space — no extra wrapper */}
            <div className="flex-1 min-h-0">
                <ProductTable key={refreshKey} />
            </div>
        </div>
    )
}
