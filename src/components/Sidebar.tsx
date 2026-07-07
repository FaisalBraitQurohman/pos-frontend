"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    Settings,
    LogOut,
    ShoppingCart,
    History,
    Calculator,
    Store,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react"

const navItems = [
    { icon: LayoutDashboard, href: "/",         label: "Dashboard" },
    { icon: ShoppingCart,    href: "/pos",      label: "Kasir" },
    { icon: Package,         href: "/products", label: "Inventaris" },
    { icon: History,         href: "/history",  label: "Riwayat" },
    { icon: Calculator,      href: "/eoq",      label: "Analitik" },
    { icon: Settings,        href: "/settings", label: "Pengaturan" },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [collapsed, setCollapsed] = useState(false)
    const [brandHovered, setBrandHovered] = useState(false)
    const [user, setUser] = useState<{ name: string; email: string } | null>(null)
    const [savedCount, setSavedCount] = useState(0)

    useEffect(() => {
        const stored = localStorage.getItem("pos-user")
        if (stored) {
            try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
        }
        const saved = localStorage.getItem("pos-saved-transactions")
        if (saved) {
            try { setSavedCount(JSON.parse(saved).length) } catch { /* ignore */ }
        }
    }, [])

    const handleLogout = async () => {
        // Clear local storage
        localStorage.removeItem("pos-logged-in")
        localStorage.removeItem("pos-user")
        
        // Also sign out from NextAuth if it was used
        try {
            const { signOut } = await import("next-auth/react")
            await signOut({ redirect: false })
        } catch (e) {
            // ignore if not setup
        }

        router.push("/login")
    }

    const displayName = user?.name || "Admin"
    const displayEmail = user?.email || "admin@pos.com"
    const initials = displayName.slice(0, 1).toUpperCase()

    return (
        <aside
            className={cn(
                "hidden md:flex h-full flex-col shrink-0 overflow-hidden backdrop-blur-3xl border-r border-white/40 shadow-xl relative z-20",
                "transition-[width] duration-300 ease-in-out"
            )}
            style={{
                width: collapsed ? "72px" : "256px",
                backgroundColor: "hsla(36, 40%, 96%, 0.65)",
            }}
        >
            <div className="flex flex-col h-full px-3 pt-4 pb-3">

                {/* ── Brand Header ── clickable pill, acts as toggle */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    onMouseEnter={() => setBrandHovered(true)}
                    onMouseLeave={() => setBrandHovered(false)}
                    className={cn(
                        "flex items-center rounded-2xl mb-5 shrink-0 w-full text-left",
                        "transition-all duration-300 ease-in-out",
                        collapsed ? "justify-center px-0 py-3" : "justify-between px-3 py-3 gap-2.5"
                    )}
                    style={{
                        backgroundColor: brandHovered
                            ? "hsl(20 18% 20%)"
                            : "hsl(20 18% 16%)",
                    }}
                    title={collapsed ? "Buka sidebar" : undefined}
                >
                    {/* Left: icon + name */}
                    <div className={cn(
                        "flex items-center min-w-0",
                        collapsed ? "justify-center" : "gap-2.5"
                    )}>
                        <div
                            className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200"
                            style={{
                                backgroundColor: "hsl(22 80% 42%)",
                                transform: brandHovered ? "rotate(-8deg) scale(1.08)" : "none",
                            }}
                        >
                            <Store className="h-4 w-4 text-white" />
                        </div>
                        {!collapsed && (
                            <span className="text-sm font-bold text-white whitespace-nowrap overflow-hidden">
                                Barokah Plastik
                            </span>
                        )}
                    </div>

                    {/* Right: collapse hint icon — only when expanded */}
                    {!collapsed && (
                        <div
                            className="shrink-0 transition-all duration-200"
                            style={{
                                color: brandHovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                            }}
                        >
                            <PanelLeftClose className="h-4 w-4" />
                        </div>
                    )}

                </button>

                {/* ── Navigation ── */}
                <nav className="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                className={cn(
                                    "flex items-center rounded-2xl transition-all duration-200",
                                    collapsed
                                        ? "justify-center h-11 w-11 mx-auto"
                                        : "gap-3 px-4 py-3 w-full"
                                )}
                                style={isActive
                                    ? { backgroundColor: "hsl(22 80% 42%)", color: "white" }
                                    : { color: "hsl(24 15% 35%)" }
                                }
                                onMouseEnter={e => {
                                    if (!isActive)
                                        (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(36 30% 86%)"
                                }}
                                onMouseLeave={e => {
                                    if (!isActive)
                                        (e.currentTarget as HTMLElement).style.backgroundColor = ""
                                }}
                            >
                                <item.icon className="shrink-0" style={{ width: "1.1rem", height: "1.1rem" }} />
                                {!collapsed && (
                                    <span className="text-sm font-medium whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* ── Divider ── */}
                <div
                    className="my-3 shrink-0"
                    style={{ height: "1px", backgroundColor: "hsl(36 20% 82%)" }}
                />

                {/* ── User Profile Card ── */}
                {!collapsed ? (
                    <div
                        className="rounded-2xl p-3 space-y-3 shrink-0"
                        style={{ backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid hsl(36 20% 86%)" }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
                                style={{ backgroundColor: "hsl(20 18% 18%)" }}
                            >
                                {initials}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold truncate leading-tight" style={{ color: "hsl(24 15% 18%)" }}>
                                    {displayName}
                                </p>
                                <p className="text-xs truncate" style={{ color: "hsl(24 10% 52%)" }}>
                                    {displayEmail}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                            style={{
                                backgroundColor: "hsl(36 30% 90%)",
                                color: "hsl(24 15% 28%)",
                                border: "1px solid hsl(36 20% 84%)"
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(0 60% 94%)"
                                ;(e.currentTarget as HTMLElement).style.color = "hsl(0 65% 42%)"
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(36 30% 90%)"
                                ;(e.currentTarget as HTMLElement).style.color = "hsl(24 15% 28%)"
                            }}
                        >
                            <LogOut style={{ width: "1rem", height: "1rem" }} />
                            <span>Keluar</span>
                        </button>
                    </div>
                ) : (
                    /* Collapsed: avatar only, click to logout */
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <div
                            className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ backgroundColor: "hsl(20 18% 18%)" }}
                        >
                            {initials}
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Keluar"
                            className="h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-200"
                            style={{ color: "hsl(24 15% 45%)" }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "hsl(0 60% 94%)"
                                ;(e.currentTarget as HTMLElement).style.color = "hsl(0 65% 42%)"
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = ""
                                ;(e.currentTarget as HTMLElement).style.color = "hsl(24 15% 45%)"
                            }}
                        >
                            <LogOut style={{ width: "1rem", height: "1rem" }} />
                        </button>
                    </div>
                )}

                {/* ── Transaksi Tersimpan Card ── */}
                {!collapsed && (
                    <div
                        className="mt-2 rounded-2xl p-3 shrink-0"
                        style={{ backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid hsl(36 20% 86%)" }}
                    >
                        <p className="text-xs" style={{ color: "hsl(24 10% 52%)" }}>Transaksi tersimpan</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: "hsl(24 15% 18%)" }}>
                            {savedCount}
                        </p>
                        <p className="text-[11px] mt-1 leading-snug" style={{ color: "hsl(24 10% 55%)" }}>
                            Data frontend sekarang sudah tersambung ke API route handlers dan backend Postgres.
                        </p>
                    </div>
                )}

            </div>
        </aside>
    )
}
