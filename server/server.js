import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { scanURL } from './scanner.js';
import { getScanQueue } from './queue.js';
import { generateScanReport } from './report.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// 🛡️ Security Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true
  })
); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging

// 🚦 Rate Limiting - Prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

const scanQueue = getScanQueue();

// 📊 Stats tracking (in-memory for fallback)
let stats = {
  totalScans: 0,
  phishingDetected: 0,
  suspiciousDetected: 0,
  safeURLs: 0
};

// 🏠 Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🔐 Phishing Link Scanner API',
    version: '2.0.0-local',
    status: 'running',
    endpoints: {
      scan: 'POST /api/scan',
      stats: 'GET /api/stats'
    }
  });
});

const localOnly = (req, res, next) => {
  const remote = req.socket?.remoteAddress || '';
  const ip = req.ip || '';
  const isLocal =
    remote === '127.0.0.1' ||
    remote === '::1' ||
    remote === '::ffff:127.0.0.1' ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1';

  if (!isLocal) {
    return res.status(403).json({ error: 'Local-only mode: access denied' });
  }

  return next();
};

// 🔍 Main scanning endpoint
app.post('/api/scan', localOnly, async (req, res) => {
  try {
    const { url } = req.body;
    
    // Validation
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'Please provide a valid URL'
      });
    }
    
    if (url.length > 2048) {
      return res.status(400).json({
        error: 'URL is too long (max 2048 characters)'
      });
    }
    
    // Use queue when available
    if (scanQueue) {
      const job = await scanQueue.add(
        'scan',
        {
          url
        },
        {
          removeOnComplete: { age: 3600 },
          removeOnFail: 50
        }
      );

      return res.json({
        jobId: job.id,
        status: 'queued'
      });
    }

    // Fallback to direct scan
    const scanResult = await scanURL(url);
    
    // Update stats
    stats.totalScans++;
    if (scanResult.riskLevel === 'dangerous') {
      stats.phishingDetected++;
    } else if (scanResult.riskLevel === 'suspicious') {
      stats.suspiciousDetected++;
    } else {
      stats.safeURLs++;
    }
    
    // Log suspicious activity
    if (scanResult.riskLevel !== 'safe') {
      console.log(`⚠️  ${scanResult.riskLevel.toUpperCase()} URL detected:`, {
        url: scanResult.url,
        score: scanResult.riskScore,
        flags: scanResult.flags.length,
        ip: req.ip,
        timestamp: scanResult.timestamp
      });
    }
    
    res.json(scanResult);
    
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      error: 'An error occurred while scanning the URL',
      message: error.message
    });
  }
});

app.get('/api/scan/:jobId', localOnly, async (req, res) => {
  if (!scanQueue) {
    return res.status(400).json({ error: 'Queue not configured' });
  }

  const job = await scanQueue.getJob(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const state = await job.getState();
  if (state === 'completed') {
    return res.json({
      status: 'completed',
      result: job.returnvalue?.result,
      scanId: job.returnvalue?.scanId
    });
  }

  return res.json({ status: state });
});

app.post('/api/report', localOnly, (req, res) => {
  const scan = req.body?.scan;

  if (!scan || typeof scan !== 'object') {
    return res.status(400).json({ error: 'Scan payload is required' });
  }

  if (!scan.url || !scan.riskLevel) {
    return res.status(400).json({ error: 'Scan payload is incomplete' });
  }

  const normalizedScan = {
    _id: scan._id || crypto.randomUUID(),
    url: scan.url,
    riskLevel: scan.riskLevel,
    riskScore: scan.riskScore ?? 0,
    flags: Array.isArray(scan.flags) ? scan.flags : [],
    riskBreakdown: Array.isArray(scan.riskBreakdown) ? scan.riskBreakdown : [],
    details: scan.details || {},
    createdAt: scan.createdAt || new Date().toISOString()
  };

  try {
    return generateScanReport(normalizedScan, res);
  } catch (error) {
    console.error('Report generation error:', error);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
});

// 📈 Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    ...stats,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 🚫 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// 💥 Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`\n🔐 Phishing Scanner Server`);
  console.log(`⚡ Running on http://localhost:${PORT}`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/stats`);
  console.log(`🔍 Scan: POST http://localhost:${PORT}/api/scan\n`);
});
