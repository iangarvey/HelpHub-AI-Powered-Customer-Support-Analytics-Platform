// Configures the Prisma client for database interactions. 
// Key Features: Ensures a singleton instance of the Prisma client for efficient database connections. 
// Prevents unnecessary re-initialization in development environments.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;