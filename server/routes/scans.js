import express from 'express';
import { Scan } from '../models/Scan.js';
import { requireAuth } from '../middleware/auth.js';
import { generateScanReport } from '../report.js';

export const scanRouter = express.Router();

scanRouter.use(requireAuth);

scanRouter.get('/', async (req, res) => {
  const scans = await Scan.find({ owner: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json({ scans });
});

scanRouter.get('/:id', async (req, res) => {
  const scan = await Scan.findOne({ _id: req.params.id, owner: req.user.id }).lean();
  if (!scan) {
    return res.status(404).json({ error: 'Scan not found' });
  }

  return res.json({ scan });
});

scanRouter.get('/:id/report', async (req, res) => {
  const scan = await Scan.findOne({ _id: req.params.id, owner: req.user.id }).lean();
  if (!scan) {
    return res.status(404).json({ error: 'Scan not found' });
  }

  return generateScanReport(scan, res);
});
