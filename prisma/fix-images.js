const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function fix() {
    const products = await p.product.findMany({
        where: { imageUrl: { startsWith: '/uploads/' } }
    });
    
    for (const prod of products) {
        const newUrl = prod.imageUrl.replace('/uploads/', '/api/uploads/');
        await p.product.update({
            where: { id: prod.id },
            data: { imageUrl: newUrl }
        });
        console.log(`Updated: ${prod.name} -> ${newUrl}`);
    }
    
    console.log(`Done! Fixed ${products.length} products.`);
    await p.$disconnect();
}

fix();
