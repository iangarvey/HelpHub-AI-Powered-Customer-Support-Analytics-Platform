// Configures the Prisma client for database interactions. 
// Key Features: Ensures a singleton instance of the Prisma client for efficient database connections. 
// Prevents unnecessary re-initialization in development environments.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    return prisma;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

export default prisma;