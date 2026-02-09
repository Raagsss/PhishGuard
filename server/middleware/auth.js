import crypto from 'crypto';
import { ApiKey } from '../models/ApiKey.js';

export function requireAuth(req, res, next) {
  if (req.user) {
    return next();
  }

  return res.status(401).json({ error: 'Authentication required' });
}

export async function apiKeyOrSession(req, res, next) {
  const apiKey = req.header('x-api-key');

  if (apiKey) {
    const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyDoc = await ApiKey.findOne({ hash, disabled: false }).populate('user');

    if (!keyDoc) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    keyDoc.lastUsedAt = new Date();
    await keyDoc.save();

    req.user = keyDoc.user;
    req.apiKey = keyDoc;
    return next();
  }

  return next();
}
