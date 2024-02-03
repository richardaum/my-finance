import { prisma } from "./prisma";

export function fetchEntries() {
  return prisma.entry.findMany({ include: { category: true, account: true } });
}
