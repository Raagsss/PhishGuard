import { Queue } from 'bullmq';
import IORedis from 'ioredis';

let scanQueue = null;

export function getScanQueue() {
  if (scanQueue) {
    return scanQueue;
  }

  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL not set. Queue disabled.');
    return null;
  }

  const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  });

  scanQueue = new Queue('scan', { connection });
  return scanQueue;
}
