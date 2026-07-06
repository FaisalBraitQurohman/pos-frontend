import { LoginForm } from "@/components/auth/LoginForm"
import { Store } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex bg-white">

            {/* ── Left: Image Panel ── */}
            <div className="hidden lg:block lg:w-[48%] relative">
                <div className="absolute inset-3 rounded-3xl overflow-hidden"
                    style={{ backgroundColor: "hsl(30 50% 93%)" }}>
                    {/* Brand badge */}
                    <div className="absolute top-6 left-6 z-10 flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: "hsl(22 80% 42%)", boxShadow: "0 4px 12px rgba(220,100,20,0.3)" }}>
                            <Store className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-bold" style={{ color: "hsl(24 15% 25%)" }}>
                            Barokah Plastik
                        </span>
                    </div>

                    {/* Image — uses user's image from Gambar folder or fallback */}
                    <img
                        src="/login-illustration.png"
                        alt="Ilustrasi Toko"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* ── Right: Login Form ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
                <div className="w-full max-w-[400px]">

                    {/* Mobile brand (hidden on lg+) */}
                    <div className="flex items-center gap-2.5 mb-12 lg:hidden">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: "hsl(22 80% 42%)" }}>
                            <Store className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-base font-bold" style={{ color: "hsl(24 15% 20%)" }}>
                            Barokah Plastik
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-extrabold tracking-tight mb-8"
                        style={{ color: "hsl(24 15% 15%)" }}>
                        Login
                    </h1>

                    {/* Form */}
                    <LoginForm />

                    {/* Footer */}
                    <p className="text-xs mt-10 text-center" style={{ color: "hsl(24 10% 70%)" }}>
                        &copy; {new Date().getFullYear()} Barokah Plastik
                    </p>
                </div>
            </div>
        </div>
    )
}
