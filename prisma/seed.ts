import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding database (admin only)...")

    // Create admin user only
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.upsert({
        where: { email: "admin@pos.com" },
        update: {},
        create: {
            email: "admin@pos.com",
            name: "Administrator",
            password: hashedPassword,
            role: "ADMIN",
        },
    })
    console.log("✅ Admin user created:", admin.email)

    console.log("🎉 Database ready! You can now add products manually.")
}

main()
    .catch((e) => {
        console.error("Error seeding:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
