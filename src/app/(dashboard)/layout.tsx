import { Sidebar } from "@/components/Sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div
            className="h-screen w-screen overflow-hidden flex gap-0"
            style={{ backgroundColor: "hsl(36 40% 93%)" }}
        >
            {/* Sidebar — sits flush on left */}
            <Sidebar />

            {/* Main content area */}
            <div
                className="flex-1 flex flex-col overflow-hidden my-3 mr-3 rounded-2xl"
                style={{
                    backgroundColor: "hsl(36 33% 96%)",
                    boxShadow: "0 2px 20px rgba(120,80,40,0.05)",
                }}
            >
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
