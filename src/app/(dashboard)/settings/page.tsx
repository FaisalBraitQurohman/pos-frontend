"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Save, Store, Percent, Bell, CheckCircle } from "lucide-react"

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        storeName: "My POS Store",
        storeAddress: "Jl. Example No. 123",
        taxRate: "11",
        currency: "IDR",
        enableNotifications: true,
        lowStockAlert: "5",
    })
    const [saved, setSaved] = useState(false)

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("pos-settings")
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings))
            } catch (e) {
                console.error("Failed to parse settings:", e)
            }
        }
    }, [])

    const handleSave = () => {
        localStorage.setItem("pos-settings", JSON.stringify(settings))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="p-8 space-y-8 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: "hsl(24 15% 18%)" }}>
                        Pengaturan
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: "hsl(24 10% 50%)" }}>
                        Kelola preferensi dan konfigurasi toko Anda.
                    </p>
                </div>
                {saved && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
                        style={{ backgroundColor: "hsl(120 30% 93%)", borderColor: "hsl(120 25% 85%)", color: "hsl(130 40% 30%)" }}>
                        <CheckCircle className="h-4 w-4" />
                        <span>Pengaturan disimpan!</span>
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-2xl border p-6 space-y-4"
                    style={{ borderColor: "hsl(36 20% 88%)", boxShadow: "0 2px 12px rgba(120,80,40,0.06)" }}>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Store className="h-4 w-4" style={{ color: "hsl(22 80% 42%)" }} />
                            <h2 className="font-semibold text-sm" style={{ color: "hsl(24 15% 20%)" }}>Informasi Toko</h2>
                        </div>
                        <p className="text-xs" style={{ color: "hsl(24 10% 55%)" }}>Informasi dasar tentang toko Anda.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="storeName" style={{ color: "hsl(24 15% 30%)" }}>Nama Toko</Label>
                        <Input
                            id="storeName"
                            value={settings.storeName}
                            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                            className="border rounded-xl"
                            style={{ borderColor: "hsl(36 20% 85%)", backgroundColor: "hsl(36 33% 97%)" }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="storeAddress" style={{ color: "hsl(24 15% 30%)" }}>Alamat Toko</Label>
                        <Input
                            id="storeAddress"
                            value={settings.storeAddress}
                            onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                            className="border rounded-xl"
                            style={{ borderColor: "hsl(36 20% 85%)", backgroundColor: "hsl(36 33% 97%)" }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currency" style={{ color: "hsl(24 15% 30%)" }}>Mata Uang</Label>
                        <Input
                            id="currency"
                            value={settings.currency}
                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                            className="border rounded-xl"
                            style={{ borderColor: "hsl(36 20% 85%)", backgroundColor: "hsl(36 33% 97%)" }}
                        />
                    </div>
                </div>



                <div className="bg-white rounded-2xl border p-6 space-y-4"
                    style={{ borderColor: "hsl(36 20% 88%)", boxShadow: "0 2px 12px rgba(120,80,40,0.06)" }}>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Bell className="h-4 w-4" style={{ color: "hsl(22 80% 42%)" }} />
                            <h2 className="font-semibold text-sm" style={{ color: "hsl(24 15% 20%)" }}>Notifikasi</h2>
                        </div>
                        <p className="text-xs" style={{ color: "hsl(24 10% 55%)" }}>Konfigurasi peringatan dan notifikasi.</p>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border"
                        style={{ backgroundColor: "hsl(36 33% 97%)", borderColor: "hsl(36 20% 87%)" }}>
                        <div className="space-y-0.5">
                            <Label style={{ color: "hsl(24 15% 25%)" }}>Aktifkan Notifikasi</Label>
                            <p className="text-xs" style={{ color: "hsl(24 10% 55%)" }}>
                                Terima peringatan untuk item stok rendah
                            </p>
                        </div>
                        <Switch
                            checked={settings.enableNotifications}
                            onCheckedChange={(checked) =>
                                setSettings({ ...settings, enableNotifications: checked })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lowStockAlert" style={{ color: "hsl(24 15% 30%)" }}>Batas Stok Minimum</Label>
                        <Input
                            id="lowStockAlert"
                            type="number"
                            value={settings.lowStockAlert}
                            onChange={(e) => setSettings({ ...settings, lowStockAlert: e.target.value })}
                            className="border rounded-xl"
                            style={{ borderColor: "hsl(36 20% 85%)", backgroundColor: "hsl(36 33% 97%)" }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} size="lg" className="rounded-xl font-semibold"
                    style={{ backgroundColor: "hsl(22 80% 42%)", color: "white" }}>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Pengaturan
                </Button>
            </div>
        </div>
    )
}
