import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // 1️⃣ Clear old data (URUTAN PENTING)
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 2️⃣ Seed Users (dengan points)
  const alice = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@gmail.com",
      points: 1500,
    },
  });

  const ayu = await prisma.user.create({
    data: {
      name: "Ayu",
      email: "ayu@gmail.com",
      points: 800,
    },
  });

  const andini = await prisma.user.create({
    data: {
      name: "Andini",
      email: "andini@gmail.com",
      points: 300,
    },
  });

  // 3️⃣ Seed Products
  const keyboard = await prisma.product.create({
    data: { name: "Keyboard", price: 350_000, stock: 10 },
  });

  const mouse = await prisma.product.create({
    data: { name: "Mouse", price: 30_000, stock: 15 },
  });

  const monitor = await prisma.product.create({
    data: { name: "Monitor", price: 700_000, stock: 20 },
  });

  const laptop = await prisma.product.create({
    data: { name: "Laptop", price: 8_050_000, stock: 5 },
  });

  // 4️⃣ Seed Orders
  await prisma.order.createMany({
    data: [
      { userId: alice.id, productId: keyboard.id, quantity: 2 },
      { userId: alice.id, productId: mouse.id, quantity: 1 },
      { userId: ayu.id, productId: monitor.id, quantity: 1 },
      { userId: andini.id, productId: laptop.id, quantity: 4 },
    ],
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
