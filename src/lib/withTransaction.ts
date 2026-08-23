import { Prisma, PrismaClient } from '../generated/prisma/client';
import prisma from './prisma';

// Prisma v7 TransactionClient type
type TransactionClient = Prisma.TransactionClient;

/**
 * Runs `fn` inside a SERIALIZABLE transaction.
 *
 * On a serialization failure (Prisma P2034 / Postgres 40001) the transaction
 * is retried up to `maxRetries` times with a short random back-off.
 * Every other error is re-thrown immediately.
 */
export async function withTransaction<T>(
  fn: (tx: TransactionClient) => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await (prisma as unknown as PrismaClient).$transaction(fn, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (err) {
      const isSerializationFailure =
        typeof err === 'object' && err !== null &&
        (err as any).code === 'P2034';

      if (isSerializationFailure && attempt < maxRetries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 80));
        continue;
      }

      throw err;
    }
  }
}
