import { PrismaClient } from '../generated/prisma/client';

// Reuse a single PrismaClient across the app to avoid connection pool exhaustion.
const prisma = new PrismaClient();

export default prisma;
