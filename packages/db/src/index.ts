import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type { Prisma } from "@prisma/client";
