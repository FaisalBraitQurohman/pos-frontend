import { Sidebar } from "@/components/Sidebar"
import { BottomNav } from "@/components/BottomNav"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard>
            <div
                className="h-[100dvh] w-screen overflow-hidden flex flex-col md:flex-row gap-0"
                style={{ backgroundColor: "hsl(36 40% 93%)" }}
            >
                {/* Sidebar — hidden on mobile, visible on desktop */}
            <Sidebar />

            {/* Main content area */}
            <div
                className="flex-1 flex flex-col overflow-hidden m-0 rounded-none pb-16 md:pb-0"
                style={{
                    backgroundColor: "hsl(36 33% 96%)",
                    boxShadow: "0 2px 20px rgba(120,80,40,0.05)",
                }}
            >
                <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
                    {children}
                </main>
            </div>
            
            {/* Bottom Nav — visible on mobile, hidden on desktop */}
            <BottomNav />
        </div>
        </AuthGuard>
    )
}
