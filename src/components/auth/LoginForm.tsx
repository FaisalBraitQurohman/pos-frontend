"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Eye, EyeOff } from "lucide-react"
import { getApiUrl } from "@/lib/api"

export function LoginForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [focused, setFocused] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${getApiUrl()}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })
            const data = await res.json()

            if (res.ok) {
                localStorage.setItem("pos-logged-in", "true")
                localStorage.setItem("pos-user", JSON.stringify({
                    email: data.email,
                    name: data.name,
                    role: data.role
                }))
                router.push("/")
            } else {
                setError(data.error || "Email atau password salah.")
            }
        } catch (error) {
            setError("Gagal terhubung ke server.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium"
                    style={{
                        backgroundColor: "hsl(0 70% 97%)",
                        border: "1px solid hsl(0 50% 90%)",
                        color: "hsl(0 65% 45%)",
                    }}>
                    <span className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                        style={{ backgroundColor: "hsl(0 65% 50%)", color: "white" }}>!</span>
                    {error}
                </div>
            )}

            {/* Email */}
            <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-semibold block"
                    style={{ color: "hsl(24 15% 20%)" }}>
                    Email
                </label>
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none rounded-l-xl"
                        style={{
                            backgroundColor: focused === "email" ? "hsl(36 30% 90%)" : "hsl(36 30% 93%)",
                            transition: "background-color 0.2s",
                        }}>
                        <Mail className="h-4 w-4"
                            style={{ color: focused === "email" ? "hsl(22 80% 42%)" : "hsl(24 10% 55%)", transition: "color 0.2s" }} />
                    </div>
                    <input
                        id="login-email"
                        type="email"
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        required
                        autoComplete="email"
                        className="w-full h-12 pl-14 pr-4 rounded-xl text-sm outline-none transition-all"
                        style={{
                            backgroundColor: "hsl(36 33% 97%)",
                            border: focused === "email"
                                ? "1.5px solid hsl(22 80% 42%)"
                                : "1.5px solid hsl(36 20% 88%)",
                            color: "hsl(24 15% 18%)",
                        }}
                    />
                </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-semibold block"
                    style={{ color: "hsl(24 15% 20%)" }}>
                    Password
                </label>
                <div className="relative">
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center rounded-l-xl transition-colors cursor-pointer"
                        style={{
                            backgroundColor: focused === "password" ? "hsl(36 30% 90%)" : "hsl(36 30% 93%)",
                        }}
                    >
                        {showPassword
                            ? <EyeOff className="h-4 w-4" style={{ color: "hsl(22 80% 42%)", transition: "color 0.2s" }} />
                            : <Eye className="h-4 w-4" style={{ color: focused === "password" ? "hsl(22 80% 42%)" : "hsl(24 10% 55%)", transition: "color 0.2s" }} />
                        }
                    </button>
                    <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused(null)}
                        required
                        autoComplete="current-password"
                        className="w-full h-12 pl-14 pr-4 rounded-xl text-sm outline-none transition-all"
                        style={{
                            backgroundColor: "hsl(36 33% 97%)",
                            border: focused === "password"
                                ? "1.5px solid hsl(22 80% 42%)"
                                : "1.5px solid hsl(36 20% 88%)",
                            color: "hsl(24 15% 18%)",
                        }}
                    />
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 mt-3"
                style={{
                    background: loading
                        ? "hsl(22 60% 55%)"
                        : "linear-gradient(135deg, hsl(22 80% 52%), hsl(15 75% 48%))",
                    boxShadow: loading ? "none" : "0 4px 20px rgba(230,100,60,0.35)",
                    cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={e => {
                    if (!loading) {
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(230,100,60,0.5)"
                        ;(e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"
                    }
                }}
                onMouseLeave={e => {
                    if (!loading) {
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(230,100,60,0.35)"
                        ;(e.currentTarget as HTMLElement).style.transform = "translateY(0)"
                    }
                }}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Masuk...</span>
                    </>
                ) : (
                    "Log In"
                )}
            </button>
        </form>
    )
}
