"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, Info, ChevronDown } from "lucide-react"
import { getApiUrl } from "@/lib/api"

const SETUP_COST = 15000 // Biaya pemesanan tetap Rp 15.000
const HOLDING_PERCENTAGE = 0.1 // 10% dari harga beli

interface Product {
    id: string
    name: string
    costPrice: number
    price: number
    category: string | null
}

export function EOQCalculator() {
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProductId, setSelectedProductId] = useState("")
    const [demand, setDemand] = useState("")
    const [costPrice, setCostPrice] = useState("")
    const [productName, setProductName] = useState("")
    const [result, setResult] = useState<{ eoq: number; holdingCost: number } | null>(null)

    // Fetch products from API
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch(`${getApiUrl()}/api/products?limit=100`)
                const data = await res.json()
                setProducts(data.data || [])
            } catch (error) {
                console.error("Failed to fetch products:", error)
            }
        }
        fetchProducts()
    }, [])

    const handleProductChange = (productId: string) => {
        setSelectedProductId(productId)
        const product = products.find(p => p.id === productId)
        if (product) {
            setCostPrice(String(Number(product.costPrice)))
            setProductName(product.name)
        } else {
            setCostPrice("")
            setProductName("")
        }
        setResult(null)
    }

    const calculate = () => {
        const D_monthly = parseFloat(demand)
        const hargaBeli = parseFloat(costPrice)

        if (D_monthly > 0 && hargaBeli > 0) {
            const D_annual = D_monthly * 12
            const H_annual = HOLDING_PERCENTAGE * hargaBeli
            const eoq = Math.sqrt((2 * D_annual * SETUP_COST) / H_annual)
            setResult({ eoq: Math.round(eoq), holdingCost: H_annual })
        } else {
            setResult(null)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="border shadow-[0_8px_30px_rgba(120,80,40,0.06)] rounded-3xl relative overflow-hidden"
                style={{ backgroundColor: "white", borderColor: "hsl(36 20% 88%)" }}>
                <div className="absolute left-6 top-6 bottom-6 w-1 rounded-full" style={{ backgroundColor: "hsl(22 80% 55%)" }} />
                <CardHeader className="pl-12 pr-6 pb-2">
                    <CardTitle className="text-xl font-bold" style={{ color: "hsl(24 15% 18%)" }}>Kalkulator EOQ</CardTitle>
                    <CardDescription style={{ color: "hsl(24 10% 55%)" }}>
                        Pilih produk dan masukkan jumlah permintaan bulanan.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pl-12 pr-6 pb-6">
                    {/* Product Selector */}
                    <div className="space-y-2">
                        <Label htmlFor="product" className="font-semibold text-sm" style={{ color: "hsl(24 15% 30%)" }}>Pilih Produk</Label>
                        <div className="relative">
                            <select
                                id="product"
                                value={selectedProductId}
                                onChange={(e) => handleProductChange(e.target.value)}
                                className="w-full h-12 rounded-xl px-4 pr-10 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all border"
                                style={{
                                    backgroundColor: "hsl(36 33% 97%)",
                                    borderColor: "hsl(36 20% 88%)",
                                    color: "hsl(24 15% 20%)"
                                }}
                            >
                                <option value="">-- Pilih Produk --</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} — Rp {Number(product.costPrice).toLocaleString("id-ID")}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none"
                                style={{ color: "hsl(24 10% 55%)" }} />
                        </div>
                    </div>

                    {/* Cost Price (auto-filled, read-only) */}
                    <div className="space-y-2">
                        <Label htmlFor="costPrice" className="font-semibold text-sm" style={{ color: "hsl(24 15% 30%)" }}>Harga Beli per Unit (Rp)</Label>
                        <Input
                            id="costPrice"
                            type="number"
                            placeholder="Otomatis dari produk"
                            value={costPrice}
                            readOnly
                            className="h-12 rounded-xl cursor-not-allowed border"
                            style={{
                                backgroundColor: "hsl(36 20% 94%)",
                                borderColor: "hsl(36 20% 88%)",
                                color: "hsl(24 10% 55%)"
                            }}
                        />
                    </div>

                    {/* Monthly Demand */}
                    <div className="space-y-2">
                        <Label htmlFor="demand" className="font-semibold text-sm" style={{ color: "hsl(24 15% 30%)" }}>Permintaan per Bulan (Unit)</Label>
                        <Input
                            id="demand"
                            type="number"
                            placeholder="Contoh: 100"
                            value={demand}
                            onChange={(e) => setDemand(e.target.value)}
                            className="h-12 rounded-xl border focus-visible:ring-2 focus-visible:ring-offset-1"
                            style={{
                                backgroundColor: "hsl(36 33% 97%)",
                                borderColor: "hsl(36 20% 88%)",
                                color: "hsl(24 15% 20%)"
                            }}
                        />
                    </div>

                    {/* Fixed parameters info */}
                    <div className="flex items-start gap-3 p-4 rounded-xl border"
                        style={{ backgroundColor: "hsl(28 90% 95%)", borderColor: "hsl(28 80% 88%)" }}>
                        <Info className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "hsl(22 80% 45%)" }} />
                        <div className="text-xs space-y-1" style={{ color: "hsl(24 15% 35%)" }}>
                            <p><strong style={{ color: "hsl(24 15% 20%)" }}>Biaya Pemesanan (S):</strong> Rp {SETUP_COST.toLocaleString("id-ID")} /pesanan</p>
                            <p><strong style={{ color: "hsl(24 15% 20%)" }}>Biaya Simpan (H):</strong> {HOLDING_PERCENTAGE * 100}% dari harga beli /tahun</p>
                        </div>
                    </div>

                    <Button 
                        className="w-full h-12 rounded-xl text-white font-bold transition-all" 
                        onClick={calculate}
                        disabled={!selectedProductId || !demand}
                        style={{
                            backgroundColor: (!selectedProductId || !demand) ? "hsl(36 20% 88%)" : "hsl(22 80% 42%)",
                            color: (!selectedProductId || !demand) ? "hsl(24 10% 60%)" : "white"
                        }}
                        onMouseEnter={e => {
                            if (selectedProductId && demand) (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(22 80% 38%)"
                        }}
                        onMouseLeave={e => {
                            if (selectedProductId && demand) (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(22 80% 42%)"
                        }}
                    >
                        <Calculator className="mr-2 h-5 w-5" /> Hitung EOQ
                    </Button>
                </CardContent>
            </Card>

            <Card className="flex flex-col border shadow-[0_8px_30px_rgba(120,80,40,0.06)] rounded-3xl relative overflow-hidden"
                style={{ backgroundColor: "white", borderColor: "hsl(36 20% 88%)" }}>
                <div className="absolute left-6 top-6 bottom-6 w-1 rounded-full" style={{ backgroundColor: "hsl(130 35% 45%)" }} />
                <CardHeader className="pl-12 pr-6 pb-2">
                    <CardTitle className="text-xl font-bold" style={{ color: "hsl(24 15% 18%)" }}>Jumlah Pesanan Optimal</CardTitle>
                </CardHeader>
                <CardContent className="text-center w-full pl-12 pr-6 flex-1 flex flex-col justify-center">
                    {result !== null ? (
                        <div className="space-y-3">
                            <div className="text-6xl font-black tracking-tighter" style={{ color: "hsl(130 35% 40%)" }}>{result.eoq}</div>
                            <p className="font-medium text-sm" style={{ color: "hsl(24 10% 55%)" }}>Unit per Pesanan</p>
                            <div className="p-4 rounded-2xl border text-left text-sm space-y-2 shadow-inner"
                                style={{ backgroundColor: "hsl(36 33% 97%)", borderColor: "hsl(36 20% 88%)" }}>
                                <p className="flex justify-between"><span style={{ color: "hsl(24 10% 55%)" }}>Produk:</span> <strong className="text-right ml-2 truncate" style={{ color: "hsl(24 15% 20%)" }}>{productName}</strong></p>
                                <p className="flex justify-between"><span style={{ color: "hsl(24 10% 55%)" }}>Permintaan / Bulan:</span> <strong style={{ color: "hsl(24 15% 20%)" }}>{demand} unit</strong></p>
                                <p className="flex justify-between"><span style={{ color: "hsl(24 10% 55%)" }}>Harga Beli:</span> <strong style={{ color: "hsl(24 15% 20%)" }}>Rp {parseInt(costPrice || "0").toLocaleString("id-ID")}</strong></p>
                                <hr className="my-1" style={{ borderColor: "hsl(36 20% 88%)" }} />
                                <p className="flex justify-between"><span style={{ color: "hsl(24 10% 55%)" }}>Biaya Pesan (S):</span> <strong style={{ color: "hsl(24 15% 20%)" }}>Rp {SETUP_COST.toLocaleString("id-ID")}</strong></p>
                                <p className="flex justify-between"><span style={{ color: "hsl(24 10% 55%)" }}>Biaya Simpan (H):</span> <strong style={{ color: "hsl(24 15% 20%)" }}>Rp {result.holdingCost.toLocaleString("id-ID")}/thn</strong></p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center" style={{ color: "hsl(24 10% 65%)" }}>
                            <Calculator className="h-14 w-14 mb-3 opacity-30" />
                            <p className="font-medium text-sm">Hasil akan muncul di sini</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
