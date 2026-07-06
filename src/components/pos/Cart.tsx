"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Minus, Plus, Loader2, ShoppingBag, Receipt, Calendar } from "lucide-react"

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
}

interface CartProps {
    items: CartItem[]
    onUpdateQuantity: (id: string, delta: number) => void
    onRemove: (id: string) => void
    onCheckout: () => void
    isProcessing?: boolean
    transactionDate?: string
    onDateChange?: (date: string) => void
}

export function Cart({ items, onUpdateQuantity, onRemove, onCheckout, isProcessing = false, transactionDate = "", onDateChange }: CartProps) {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return (
        <div className="flex flex-col h-full rounded-2xl overflow-hidden border backdrop-blur-2xl shadow-xl"
            style={{ backgroundColor: "hsla(36, 33%, 97%, 0.75)", borderColor: "rgba(255,255,255,0.5)" }}>

            {/* Header */}
            <div className="px-5 py-4 border-b shrink-0"
                style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4" style={{ color: "hsl(22 80% 42%)" }} />
                        <h3 className="font-bold text-base" style={{ color: "hsl(24 15% 18%)" }}>Pesanan</h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                            backgroundColor: items.length > 0 ? "hsl(22 80% 42%)" : "rgba(0,0,0,0.05)",
                            color: items.length > 0 ? "white" : "hsl(24 10% 55%)"
                        }}>
                        {items.length} item
                    </span>
                </div>
            </div>

            {/* Items */}
            <ScrollArea className="flex-1">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[280px] gap-3">
                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
                            <ShoppingBag className="h-8 w-8" style={{ color: "hsl(36 20% 72%)" }} />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-sm" style={{ color: "hsl(24 10% 45%)" }}>Keranjang kosong</p>
                            <p className="text-xs mt-0.5" style={{ color: "hsl(24 10% 60%)" }}>Klik produk untuk menambahkan</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 p-4">
                        {items.map((item) => (
                            <div key={item.id}
                                className="group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                                style={{ borderColor: "rgba(255,255,255,0.6)", backgroundColor: "rgba(255,255,255,0.6)" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "hsl(22 80% 60%)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.6)"}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold leading-tight truncate"
                                        style={{ color: "hsl(24 15% 20%)" }}>{item.name}</p>
                                    <p className="text-xs mt-0.5 font-medium"
                                        style={{ color: "hsl(22 80% 42%)" }}>
                                        Rp {item.price.toLocaleString("id-ID")}
                                    </p>
                                </div>

                                {/* Qty controls */}
                                <div className="flex items-center gap-1 rounded-lg p-0.5"
                                    style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                        className="h-6 w-6 rounded-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                        style={{ backgroundColor: "white", color: "hsl(24 15% 30%)", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(22 80% 42%)";
                                            (e.currentTarget as HTMLElement).style.color = "white";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = "white";
                                            (e.currentTarget as HTMLElement).style.color = "hsl(24 15% 30%)";
                                        }}
                                    >
                                        <Minus className="h-2.5 w-2.5" />
                                    </button>
                                    <span className="w-6 text-center text-sm font-bold"
                                        style={{ color: "hsl(24 15% 18%)" }}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                        className="h-6 w-6 rounded-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                        style={{ backgroundColor: "white", color: "hsl(24 15% 30%)", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(22 80% 42%)";
                                            (e.currentTarget as HTMLElement).style.color = "white";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.backgroundColor = "white";
                                            (e.currentTarget as HTMLElement).style.color = "hsl(24 15% 30%)";
                                        }}
                                    >
                                        <Plus className="h-2.5 w-2.5" />
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <span className="text-sm font-bold w-20 text-right shrink-0"
                                    style={{ color: "hsl(24 15% 18%)" }}>
                                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                </span>

                                {/* Remove */}
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="h-6 w-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                    style={{ color: "hsl(0 65% 50%)" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239, 68, 68, 0.1)"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = ""}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t shrink-0 space-y-3"
                style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                
                {/* Transaction Date Input (Backdate) */}
                <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4" style={{ color: "hsl(24 10% 55%)" }} />
                    <input 
                        type="date" 
                        title="Kosongkan untuk waktu saat ini"
                        value={transactionDate}
                        onChange={(e) => onDateChange?.(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-lg text-sm border outline-none transition-all cursor-pointer"
                        style={{
                            backgroundColor: "white",
                            borderColor: "hsl(36 20% 88%)",
                            color: "hsl(24 15% 30%)"
                        }}
                        onFocus={e => (e.target as HTMLInputElement).style.borderColor = "hsl(22 80% 42%)"}
                        onBlur={e => (e.target as HTMLInputElement).style.borderColor = "hsl(36 20% 88%)"}
                    />
                </div>

                <div className="flex justify-between items-center text-xs"
                    style={{ color: "hsl(24 10% 55%)" }}>
                    <span>{items.length} item × {items.reduce((a, i) => a + i.quantity, 0)} pcs</span>
                    <span className="font-medium">Subtotal</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-sm font-semibold" style={{ color: "hsl(24 15% 35%)" }}>Total</span>
                    <span className="text-2xl font-bold tracking-tight" style={{ color: "hsl(24 15% 15%)" }}>
                        Rp {total.toLocaleString("id-ID")}
                    </span>
                </div>

                <button
                    disabled={items.length === 0 || isProcessing}
                    onClick={onCheckout}
                    className="w-full h-14 rounded-xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                    style={{
                        backgroundColor: items.length === 0 || isProcessing ? "rgba(0,0,0,0.05)" : "transparent",
                        backgroundImage: items.length === 0 || isProcessing ? "none" : "linear-gradient(to right, hsl(22, 80%, 45%), hsl(28, 90%, 45%))",
                        color: items.length === 0 || isProcessing ? "hsl(24 10% 60%)" : "white",
                        cursor: items.length === 0 || isProcessing ? "not-allowed" : "pointer",
                        boxShadow: items.length === 0 || isProcessing ? "none" : "0 8px 24px rgba(234, 88, 12, 0.35)",
                        transform: items.length === 0 || isProcessing ? "none" : "translateY(-1px)"
                    }}
                    onMouseEnter={e => {
                        if (items.length > 0 && !isProcessing) {
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(234, 88, 12, 0.45)";
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                        }
                    }}
                    onMouseLeave={e => {
                        if (items.length > 0 && !isProcessing) {
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(234, 88, 12, 0.35)";
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                        }
                    }}
                >
                    {/* Inner glowing element for hover */}
                    {items.length > 0 && !isProcessing && (
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    )}
                    
                    {isProcessing ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Memproses...</span>
                        </>
                    ) : (
                        `Bayar Rp ${total.toLocaleString("id-ID")}`
                    )}
                </button>
            </div>
        </div>
    )
}
