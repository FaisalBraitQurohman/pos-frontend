"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    History,
    Calculator,
    Settings,
} from "lucide-react"

const navItems = [
    { icon: LayoutDashboard, href: "/",         label: "Dashboard" },
    { icon: ShoppingCart,    href: "/pos",      label: "Kasir" },
    { icon: Package,         href: "/products", label: "Inventaris" },
    { icon: History,         href: "/history",  label: "Riwayat" },
    { icon: Calculator,      href: "/eoq",      label: "Analitik" },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-4px_20px_rgba(120,80,40,0.08)] pb-safe">
            <div className="flex items-center justify-around h-16 px-1 sm:px-2">
                {navItems.map((item) => {
                    const isActive = item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
                                isActive ? "text-[hsl(22,80%,42%)]" : "text-[hsl(24,15%,45%)]"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center w-10 h-8 rounded-full transition-all duration-300",
                                isActive ? "bg-[hsl(22,80%,42%,0.15)] scale-110" : "bg-transparent hover:bg-[hsl(36,30%,90%)]"
                            )}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-medium leading-none">
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
                <Link
                    href="/settings"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
                        pathname.startsWith("/settings") ? "text-[hsl(22,80%,42%)]" : "text-[hsl(24,15%,45%)]"
                    )}
                >
                    <div className={cn(
                        "flex items-center justify-center w-10 h-8 rounded-full transition-all duration-300",
                        pathname.startsWith("/settings") ? "bg-[hsl(22,80%,42%,0.15)] scale-110" : "bg-transparent hover:bg-[hsl(36,30%,90%)]"
                    )}>
                        <Settings className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-medium leading-none">
                        Setting
                    </span>
                </Link>
            </div>
        </nav>
    )
}
