// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> };

function createPrismaClient() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

export const prisma: InstanceType<typeof PrismaClient> =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;