import { prisma } from "./prisma";

export function fetchCategories() {
  return prisma.category.findMany();
}
