import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const account = { name: "Nubank" };
  const accountRow = await prisma.account.findFirst({
    where: account,
  });
  if (!accountRow) {
    await prisma.account.create({ data: { ...account, balance: 0 } });
  }

  const foodCategory = { name: "Alimentação" };
  const foodCategoryRow = await prisma.category.findFirst({
    where: foodCategory,
  });
  if (!foodCategoryRow) {
    await prisma.category.create({ data: { ...foodCategory } });
  }

  const carCategory = { name: "Carro" };
  const carCategoryRow = await prisma.category.findFirst({
    where: carCategory,
  });
  if (!carCategoryRow) {
    await prisma.category.create({ data: { ...carCategory } });
  }

  if (!accountRow || !foodCategoryRow || !carCategoryRow) return;

  const entries = [
    {
      description: "Almoço",
      value: 20,
      categoryId: foodCategoryRow.id,
      accountId: accountRow.id,
      status: "PENDING",
    },
    {
      description: "Gasolina",
      value: 30,
      categoryId: carCategoryRow.id,
      accountId: accountRow.id,
      status: "EXPIRED",
    },
    {
      description: "Lanche",
      value: 10,
      categoryId: foodCategoryRow.id,
      accountId: accountRow.id,
      status: "COMPLETED",
    },
  ];

  for (const entry of entries) {
    if (!(await prisma.entry.findFirst({ where: entry }))) {
      await prisma.entry.create({
        data: { ...entry, date: new Date() },
      });
    }
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
