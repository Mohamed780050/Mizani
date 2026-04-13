import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { db: PrismaClient };

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

export const db = globalForPrisma.db ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

export default db;