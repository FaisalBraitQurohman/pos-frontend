"use client"

import { useState } from "react"
import { ProductGrid } from "./ProductGrid"
import { Cart } from "./Cart"
import { Input } from "@/components/ui/input"
import { Search, ShoppingBag, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getApiUrl } from "@/lib/api"
import { useEffect } from "react"

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
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        if (cart.length === 0 && isMobileCartOpen) {
            setIsMobileCartOpen(false)
        }
    }, [cart.length, isMobileCartOpen])

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

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <div className="flex flex-col xl:flex-row h-full gap-4 p-3 sm:p-5 relative">
            {/* Left: Product Area */}
            <div className="flex-1 flex flex-col gap-3 min-w-0 min-h-0">
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

            {/* Right: Cart (Desktop Only) */}
            <div className="hidden xl:block w-[380px] shrink-0 h-full">
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

            {/* Mobile Floating Cart Summary */}
            {!isMobileCartOpen && cart.length > 0 && (
                <div className="xl:hidden fixed bottom-20 left-3 right-3 z-40 transition-all animate-in slide-in-from-bottom-5">
                    <div 
                        onClick={() => setIsMobileCartOpen(true)}
                        className="rounded-2xl shadow-[0_8px_30px_rgba(234,88,12,0.3)] flex items-center justify-between p-3.5 cursor-pointer text-white border border-white/20"
                        style={{ background: "linear-gradient(to right, hsl(22, 80%, 45%), hsl(28, 90%, 45%))" }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-white drop-shadow-md" />
                                <span className="absolute -top-1.5 -right-2 bg-white text-xs font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-sm"
                                    style={{ color: "hsl(22 80% 42%)" }}>
                                    {cart.length}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm drop-shadow-md">Rp {total.toLocaleString("id-ID")}</span>
                                <span className="text-[11px] text-white/90 font-medium">{totalItems} barang</span>
                            </div>
                        </div>
                        <div className="font-bold text-sm bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm transition-colors hover:bg-white/30">
                            Checkout
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Cart Modal */}
            {isMobileCartOpen && (
                <div className="xl:hidden fixed inset-0 z-[60] flex flex-col bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="flex-1" onClick={() => setIsMobileCartOpen(false)} />
                    <div className="bg-white rounded-t-3xl h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
                        <div className="p-4 border-b flex justify-between items-center shrink-0" style={{ backgroundColor: "hsl(36 33% 97%)" }}>
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" style={{ color: "hsl(24 15% 20%)" }} />
                                <h3 className="font-bold text-base" style={{ color: "hsl(24 15% 20%)" }}>Keranjang Saya</h3>
                            </div>
                            <button 
                                onClick={() => setIsMobileCartOpen(false)}
                                className="h-8 w-8 bg-black/5 rounded-full flex items-center justify-center transition-colors hover:bg-black/10 active:scale-95"
                            >
                                <X className="h-4 w-4" style={{ color: "hsl(24 15% 20%)" }} />
                            </button>
                        </div>
                        <div className="flex-1 min-h-0 bg-white p-3">
                            {/* Reusing Cart Component but making it fill the modal */}
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
                </div>
            )}
        </div>
    )
}
