"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react"

interface Product {
    id: string
    name: string
    sku: string
    stock: number
}

interface StockDialogProps {
    type: "in" | "out"
    onStockUpdated: () => void
}

export function StockDialog({ type, onStockUpdated }: StockDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [formData, setFormData] = useState({
        productId: "",
        quantity: "",
        reason: "",
    })

    useEffect(() => {
        if (open) {
            fetch("/api/products?limit=100")
                .then(res => res.json())
                .then(data => setProducts(data.data || []))
                .catch(err => console.error(err))
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`/api/stock?action=${type}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: formData.productId,
                    quantity: parseInt(formData.quantity),
                    reason: formData.reason || undefined,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || `Failed to stock ${type}`)
            }

            alert(`Stock ${type} successful!`)
            setFormData({ productId: "", quantity: "", reason: "" })
            setOpen(false)
            onStockUpdated()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    {type === "in" ? (
                        <><ArrowDown className="mr-2 h-4 w-4" /> Stock In</>
                    ) : (
                        <><ArrowUp className="mr-2 h-4 w-4" /> Stock Out</>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {type === "in" ? "Add Stock (Stock In)" : "Remove Stock (Stock Out)"}
                        </DialogTitle>
                        <DialogDescription>
                            {type === "in"
                                ? "Add inventory to a product."
                                : "Remove inventory from a product."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="product">Select Product *</Label>
                            <Select
                                value={formData.productId}
                                onValueChange={(value) => setFormData({ ...formData, productId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.name} ({product.sku}) - Stock: {product.stock}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="10"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Input
                                id="reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder={type === "in" ? "Restock from supplier" : "Damaged / Expired"}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !formData.productId}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                type === "in" ? "Add Stock" : "Remove Stock"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
