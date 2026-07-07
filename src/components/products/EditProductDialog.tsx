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
import { Edit, Loader2 } from "lucide-react"
import { getApiUrl } from "@/lib/api"

interface EditProductDialogProps {
    product: any
    onProductUpdated: () => void
}

export function EditProductDialog({ product, onProductUpdated }: EditProductDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        sku: "",
        brand: "",
        size: "",
        name: "",
        description: "",
        price: "",
        costPrice: "",
        stock: "",
        minStock: "",
        category: "",
    })
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        if (open) {
            setFormData({
                sku: product.sku || "",
                brand: product.brand || "",
                size: product.size || "",
                name: product.name || "",
                description: product.description || "",
                price: product.price ? product.price.toString() : "",
                costPrice: product.costPrice ? product.costPrice.toString() : "",
                stock: product.stock ? product.stock.toString() : "0",
                minStock: product.minStock ? product.minStock.toString() : "0",
                category: product.category || "",
            })
            setImageFile(null)
        }
    }, [open, product])

    // Auto-generate product name from brand + size
    const updateName = (brand: string, size: string) => {
        const name = [brand, size].filter(Boolean).join(" ")
        setFormData(prev => ({ ...prev, brand, size, name }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let uploadedImageUrl = product.imageUrl // Keep existing by default
            if (imageFile) {
                const uploadData = new FormData()
                uploadData.append("file", imageFile)
                const uploadRes = await fetch(`${getApiUrl()}/api/upload`, {
                    method: "POST",
                    body: uploadData,
                })
                
                if (!uploadRes.ok) {
                    const errorData = await uploadRes.json()
                    throw new Error(errorData.error || "Failed to upload image")
                }
                
                const data = await uploadRes.json()
                uploadedImageUrl = data.url
            }

            const res = await fetch(`${getApiUrl()}/api/products/${product.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sku: formData.sku,
                    name: formData.name,
                    brand: formData.brand || undefined,
                    size: formData.size || undefined,
                    description: formData.description || undefined,
                    price: parseFloat(formData.price),
                    costPrice: parseFloat(formData.costPrice),
                    stock: parseInt(formData.stock) || 0,
                    minStock: parseInt(formData.minStock) || 0,
                    category: formData.category || undefined,
                    imageUrl: uploadedImageUrl,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to update product")
            }

            alert("Product updated successfully!")
            setOpen(false)
            onProductUpdated()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6 rounded-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Ubah detail produk di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`sku-${product.id}`}>SKU *</Label>
                                <Input
                                    id={`sku-${product.id}`}
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`category-${product.id}`}>Kategori</Label>
                                <Input
                                    id={`category-${product.id}`}
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Brand + Size -> Auto Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`brand-${product.id}`}>Merk</Label>
                                <Input
                                    id={`brand-${product.id}`}
                                    value={formData.brand}
                                    onChange={(e) => updateName(e.target.value, formData.size)}
                                    placeholder="Contoh: BOYO"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`size-${product.id}`}>Ukuran</Label>
                                <Input
                                    id={`size-${product.id}`}
                                    value={formData.size}
                                    onChange={(e) => updateName(formData.brand, e.target.value)}
                                    placeholder="Contoh: 1/2 ONS"
                                />
                            </div>
                        </div>

                        {/* Auto-generated name (editable) */}
                        <div className="space-y-2">
                            <Label htmlFor={`name-${product.id}`}>Nama Produk (Otomatis) *</Label>
                            <Input
                                id={`name-${product.id}`}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="bg-slate-50 font-semibold"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`description-${product.id}`}>Deskripsi</Label>
                            <Input
                                id={`description-${product.id}`}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`imageFile-${product.id}`}>Gambar Produk - Kosongkan jika tidak ingin mengubah</Label>
                            <Input
                                id={`imageFile-${product.id}`}
                                type="file"
                                accept="image/jpeg, image/png, image/webp"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`price-${product.id}`}>Harga Jual * (Rp)</Label>
                                <Input
                                    id={`price-${product.id}`}
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`costPrice-${product.id}`}>Harga Beli * (Rp)</Label>
                                <Input
                                    id={`costPrice-${product.id}`}
                                    type="number"
                                    value={formData.costPrice}
                                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`stock-${product.id}`}>Stok Saat Ini</Label>
                                <Input
                                    id={`stock-${product.id}`}
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`minStock-${product.id}`}>Stok Minimum</Label>
                                <Input
                                    id={`minStock-${product.id}`}
                                    type="number"
                                    value={formData.minStock}
                                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Product"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
