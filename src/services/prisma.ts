import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var globalPrisma: PrismaClient;
}

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaInstance = new PrismaClient();
} else {
  if (!global.globalPrisma) {
    globalThis.globalPrisma = new PrismaClient();
  }
  prismaInstance = global.globalPrisma;
}

export const prisma = prismaInstance;
