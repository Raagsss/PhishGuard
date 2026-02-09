import 'dotenv/config';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { scanURL } from './scanner.js';
import { connectDB } from './db.js';
import { Scan } from './models/Scan.js';

await connectDB();

if (!process.env.REDIS_URL) {
  console.error('REDIS_URL is required to run the worker.');
  process.exit(1);
}

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

const worker = new Worker(
  'scan',
  async (job) => {
    const { url, userId, apiKeyId } = job.data;
    const result = await scanURL(url);

    const scanDoc = await Scan.create({
      url,
      normalizedUrl: result.normalizedUrl,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      flags: result.flags,
      riskBreakdown: result.riskBreakdown,
      details: result.details,
      jobId: job.id,
      owner: userId || undefined,
      apiKey: apiKeyId || undefined
    });

    return {
      scanId: scanDoc._id.toString(),
      result
    };
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`✅ Scan job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Scan job ${job?.id} failed`, err);
});
