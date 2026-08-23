import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Reuse a single PrismaClient across the app to avoid connection pool exhaustion.
const prisma = new PrismaClient({ adapter });

export default prisma;
