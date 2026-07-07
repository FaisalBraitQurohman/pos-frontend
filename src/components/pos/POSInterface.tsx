"use client"

import { useState } from "react"
import { ProductGrid } from "./ProductGrid"
import { Cart } from "./Cart"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getApiUrl } from "@/lib/api"

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    stock: number
}

export default function POSInterface() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [transactionDate, setTransactionDate] = useState("")
    const { toast } = useToast()

    const addToCart = (product: any) => {
        const productStock = product.stock || 0

        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                // Check if adding 1 more would exceed stock
                if (existing.quantity >= productStock) {
                    toast({
                        title: "Stok tidak cukup!",
                        description: `${product.name} hanya tersedia ${productStock} unit.`,
                        variant: "destructive",
                    })
                    return prev
                }
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }

            // Check if stock is available at all
            if (productStock <= 0) {
                toast({
                    title: "Stok habis!",
                    description: `${product.name} tidak tersedia.`,
                    variant: "destructive",
                })
                return prev
            }

            return [...prev, {
                id: product.id,
                name: product.name,
                price: Number(product.price),
                quantity: 1,
                stock: productStock,
            }]
        })
    }

    const updateQuantity = (id: string, delta: number) => {
        setCart((prev) => {
            return prev.map((item) => {
                if (item.id === id) {
                    const newQty = item.quantity + delta

                    // Don't allow exceeding stock
                    if (newQty > item.stock) {
                        toast({
                            title: "Stok tidak cukup!",
                            description: `${item.name} hanya tersedia ${item.stock} unit.`,
                            variant: "destructive",
                        })
                        return item
                    }

                    return { ...item, quantity: Math.max(0, newQty) }
                }
                return item
            }).filter((item) => item.quantity > 0)
        })
    }

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id))
    }

    const handleCheckout = async () => {
        if (cart.length === 0) return

        setIsProcessing(true)

        try {
            const response = await fetch(`${getApiUrl()}/api/pos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cart.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                    })),
                    paymentMethod: "CASH",
                    ...(transactionDate && { transactionDate }),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to process transaction")
            }

            toast({
                title: "Transaction Complete!",
                description: `Total: Rp ${Number(data.totalAmount).toLocaleString("id-ID")}`,
            })

            setCart([])

            // Trigger a page reload to refresh product stock
            window.location.reload()

        } catch (error: any) {
            toast({
                title: "Transaction Failed",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="flex flex-col xl:flex-row h-full gap-4 p-3 sm:p-5">
            {/* Left: Product Area */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
                {/* Search Bar */}
                <div className="relative shrink-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"
                        style={{ color: "hsl(24 10% 55%)" }} />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none border transition-all"
                        style={{
                            backgroundColor: "white",
                            borderColor: "hsl(36 20% 88%)",
                            color: "hsl(24 15% 20%)",
                            boxShadow: "0 2px 8px rgba(120,80,40,0.05)"
                        }}
                        onFocus={e => (e.target as HTMLInputElement).style.borderColor = "hsl(22 80% 42%)"}
                        onBlur={e => (e.target as HTMLInputElement).style.borderColor = "hsl(36 20% 88%)"}
                    />
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-hidden min-h-0 xl:min-h-[400px]">
                    <ProductGrid onAddToCart={addToCart} searchTerm={searchTerm} />
                </div>
            </div>

            {/* Right: Cart */}
            <div className="w-full xl:w-[380px] shrink-0 h-[45vh] min-h-0 xl:h-full">
                <Cart
                    items={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onCheckout={handleCheckout}
                    isProcessing={isProcessing}
                    transactionDate={transactionDate}
                    onDateChange={setTransactionDate}
                />
            </div>
        </div>
    )
}
