import { EOQCalculator } from "@/components/eoq/EOQCalculator"

export default function EOQPage() {
    return (
        <div className="flex flex-col h-full p-6 lg:p-8 space-y-4">
            <div className="shrink-0">
                <h1 className="text-2xl font-bold" style={{ color: "hsl(24 15% 18%)" }}>
                    Kalkulator EOQ
                </h1>
                <p className="text-sm mt-0.5" style={{ color: "hsl(24 10% 50%)" }}>
                    Optimasi biaya inventaris Anda menggunakan rumus Economic Order Quantity.
                </p>
            </div>
            <div className="flex-1 min-h-0">
                <EOQCalculator />
            </div>
        </div>
    )
}
