"use client"

import { useState } from "react"
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
import { Plus, Loader2 } from "lucide-react"
import { getApiUrl } from "@/lib/api"

interface AddProductDialogProps {
    onProductAdded: () => void
    prefillData?: {
        name: string
        brand: string
        category: string
        costPrice: string
        price: string
        minStock: string
        imageUrl: string
        description: string
    }
}

export function AddProductDialog({ onProductAdded, prefillData }: AddProductDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        sku: "",
        brand: prefillData?.brand || "",
        size: "",
        name: "",
        description: prefillData?.description || "",
        price: prefillData?.price || "",
        costPrice: prefillData?.costPrice || "",
        stock: "",
        minStock: prefillData?.minStock || "",
        category: prefillData?.category || "",
    })
    const [imageFile, setImageFile] = useState<File | null>(null)

    // Auto-generate product name from brand + size
    const updateName = (brand: string, size: string) => {
        const name = [brand, size].filter(Boolean).join(" ")
        setFormData(prev => ({ ...prev, brand, size, name }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let uploadedImageUrl = prefillData?.imageUrl || undefined
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

            const res = await fetch(`${getApiUrl()}/api/products`, {
                method: "POST",
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
                throw new Error(data.error || "Failed to add product")
            }

            alert("Product added successfully!")
            setFormData({
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
            setImageFile(null)
            setOpen(false)
            onProductAdded()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    // When dialog opens with prefill data, reset size and generate new SKU
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (isOpen && prefillData) {
            setFormData({
                sku: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
                brand: prefillData.brand,
                size: "",
                name: prefillData.brand,
                description: prefillData.description,
                price: prefillData.price,
                costPrice: prefillData.costPrice,
                stock: "",
                minStock: prefillData.minStock,
                category: prefillData.category,
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {prefillData ? (
                    <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700" title="Duplikat Produk">
                        <Plus className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6 rounded-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{prefillData ? "Duplikat Produk (Varian Baru)" : "Add New Product"}</DialogTitle>
                        <DialogDescription>
                            {prefillData
                                ? `Buat varian baru dari "${prefillData.name}". Cukup ubah ukuran dan harganya.`
                                : "Isi Merk dan Ukuran, nama produk akan otomatis terbentuk."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU / Kode Barang *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="sku"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        placeholder="Contoh: IND-01"
                                        required
                                    />
                                    <Button 
                                        type="button" 
                                        variant="secondary" 
                                        onClick={() => setFormData({ ...formData, sku: `PRD-${Math.floor(1000 + Math.random() * 9000)}` })}
                                        className="shrink-0 text-xs px-3"
                                        title="Generate Random SKU"
                                    >
                                        Auto
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Plastik, Makanan, dll"
                                />
                            </div>
                        </div>

                        {/* Brand + Size -> Auto Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="brand">Merk</Label>
                                <Input
                                    id="brand"
                                    value={formData.brand}
                                    onChange={(e) => updateName(e.target.value, formData.size)}
                                    placeholder="Contoh: BOYO"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="size">Ukuran</Label>
                                <Input
                                    id="size"
                                    value={formData.size}
                                    onChange={(e) => updateName(formData.brand, e.target.value)}
                                    placeholder="Contoh: 1/2 ONS"
                                    autoFocus={!!prefillData}
                                />
                            </div>
                        </div>

                        {/* Auto-generated name (editable) */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Produk (Otomatis) *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Otomatis dari Merk + Ukuran"
                                required
                                className="bg-slate-50 font-semibold"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Deskripsi produk..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageFile">Gambar Produk</Label>
                            <Input
                                id="imageFile"
                                type="file"
                                accept="image/jpeg, image/png, image/webp"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            />
                            {prefillData?.imageUrl && !imageFile && (
                                <p className="text-xs text-emerald-600">✓ Gambar akan menggunakan gambar produk asli</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Harga Jual * (Rp)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="150000"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="costPrice">Harga Beli * (Rp)</Label>
                                <Input
                                    id="costPrice"
                                    type="number"
                                    value={formData.costPrice}
                                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                    placeholder="100000"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stok Awal</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="minStock">Stok Minimum</Label>
                                <Input
                                    id="minStock"
                                    type="number"
                                    value={formData.minStock}
                                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                    placeholder="5"
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
                                    Saving...
                                </>
                            ) : (
                                prefillData ? "Simpan Varian" : "Save Product"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
