import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const account = await prisma.account.findFirst({
    where: { name: "Nubank" },
  });

  if (!account) {
    await prisma.account.create({
      data: {
        name: "Nubank",
        balance: 0,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
