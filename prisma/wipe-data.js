const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reset() {
  console.log("Menghapus data transaksi...");
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  
  console.log("Menghapus riwayat stok...");
  await prisma.stockHistory.deleteMany();
  
  console.log("Menghapus riwayat perhitungan EOQ...");
  await prisma.eOQResult.deleteMany();
  
  console.log("Menghapus daftar produk...");
  await prisma.product.deleteMany();
  
  console.log("✅ Database berhasil di-reset! (Akun Admin tetap dipertahankan)");
}

reset()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
