import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("🧹 Clearing transactions and stock history...")

    // Delete all transactions
    await prisma.transactionItem.deleteMany({})
    await prisma.transaction.deleteMany({})

    // Delete all stock history except initial seed
    // Note: In a real app we might want to be more selective, but for "reset revenue" this is safest
    await prisma.stockHistory.deleteMany({})

    console.log("✅ Revenue and history reset complete!")
}

main()
    .catch((e) => {
        console.error("Error clearing data:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
