"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Settings, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

const routes = [
    { label: "Dashboard", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Inventory", href: "/inventory" },
    { label: "POS System", href: "/pos" },
    { label: "History", href: "/history" },
    { label: "Analytics", href: "/eoq" },
]

export function Topbar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("pos-logged-in")
            localStorage.removeItem("pos-user")
            router.push("/login")
        }
    }

    return (
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm z-20 shrink-0">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-1">
                {routes.map((route) => {
                    const isActive = pathname === route.href || (pathname.startsWith(route.href) && route.href !== "/")
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`relative px-4 py-2 text-sm font-bold transition-colors ${
                                isActive 
                                    ? "text-slate-900" 
                                    : "text-slate-400 hover:text-slate-900"
                            }`}
                        >
                            {route.label}
                            {isActive && (
                                <span className="absolute bottom-[-26px] left-0 right-0 h-[3px] bg-slate-900 rounded-t-md" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
                
                <div className="flex items-center space-x-1 text-slate-400">
                    <div className="relative">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-white" />
                    </div>
                    <Link href="/settings">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100" title="Settings">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center space-x-3 pl-4 border-l border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="hidden md:flex flex-col">
                            <span className="text-sm font-semibold text-slate-800">Admin</span>
                            <span className="text-xs text-slate-500">ID: 1587963</span>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 ml-2" 
                        title="Logout"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
