import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

export interface IdempotencyResult {
  isDuplicate: boolean;
  messageId?: string;
  status?: string;
}

export function computePayloadHash(payload: unknown): string {
  const payloadString = JSON.stringify(payload, Object.keys(payload as Record<string, unknown>).sort());
  return crypto.createHash('sha256').update(payloadString).digest('hex');
}

export async function checkIdempotency(
  idempotencyKey: string,
  payloadHash: string
): Promise<IdempotencyResult> {
  try {
    const existing = await prisma.idempotencyKey.findUnique({
      where: { idempotencyKey }
    });

    if (!existing) {
      return { isDuplicate: false };
    }

    // Check if payload hash matches
    if (existing.payloadHash !== payloadHash) {
      logger.warn({
        idempotencyKey,
        existingHash: existing.payloadHash,
        newHash: payloadHash
      }, 'Idempotency key exists with different payload hash');
      
      throw new Error('Idempotency key exists with different payload');
    }

    // Same key and same payload - return existing result
    return {
      isDuplicate: true,
      messageId: existing.messageId,
      status: existing.status
    };
  } catch (error) {
    logger.error({ error, idempotencyKey }, 'Error checking idempotency');
    throw error;
  }
}

export async function storeIdempotencyKey(
  idempotencyKey: string,
  payloadHash: string,
  messageId: string,
  status: string = 'queued'
): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.idempotencyKey.create({
      data: {
        idempotencyKey,
        payloadHash,
        messageId,
        status,
        expiresAt
      }
    });

    logger.info({ idempotencyKey, messageId, status }, 'Stored idempotency key');
  } catch (error) {
    logger.error({ error, idempotencyKey, messageId }, 'Error storing idempotency key');
    throw error;
  }
}

export async function updateIdempotencyStatus(
  idempotencyKey: string,
  status: string
): Promise<void> {
  try {
    await prisma.idempotencyKey.update({
      where: { idempotencyKey },
      data: { status }
    });

    logger.info({ idempotencyKey, status }, 'Updated idempotency status');
  } catch (error) {
    logger.error({ error, idempotencyKey, status }, 'Error updating idempotency status');
    throw error;
  }
}
