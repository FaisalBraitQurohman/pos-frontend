"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("pos-logged-in")
        if (isLoggedIn === "true") {
            setIsAuthorized(true)
        } else {
            router.push("/login")
        }
    }, [router])

    if (!isAuthorized) {
        // Blank screen or subtle loading while redirecting to prevent flashing
        return (
            <div className="h-[100dvh] w-screen flex items-center justify-center" style={{ backgroundColor: "hsl(36 40% 93%)" }}>
            </div>
        )
    }

    return <>{children}</>
}
