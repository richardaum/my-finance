import { prisma } from "./prisma";

export function fetchAccounts() {
  return prisma.account.findMany();
}
