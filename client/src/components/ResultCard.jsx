import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  ShieldCheck, ShieldAlert, ShieldX, 
  AlertTriangle, CheckCircle2, XCircle,
  Globe, Lock, Link2, Eye, Download
} from 'lucide-react';

export default function ResultCard({ result }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  if (!result) return null;

  const getRiskConfig = () => {
    switch (result.riskLevel) {
      case 'safe':
        return {
          icon: ShieldCheck,
          title: '✅ Safe Link',
          description: 'This URL appears to be legitimate and safe to visit.',
          bgGradient: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-500/50',
          textColor: 'text-green-400',
          iconBg: 'bg-green-500/20',
        };
      case 'suspicious':
        return {
          icon: ShieldAlert,
          title: '⚠️ Suspicious Link',
          description: 'This URL shows some warning signs. Proceed with caution.',
          bgGradient: 'from-yellow-500/20 to-orange-500/20',
          borderColor: 'border-yellow-500/50',
          textColor: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
        };
      case 'dangerous':
        return {
          icon: ShieldX,
          title: '🚨 Dangerous Link',
          description: 'This URL is likely malicious. Do NOT visit this site!',
          bgGradient: 'from-red-500/20 to-pink-500/20',
          borderColor: 'border-red-500/50',
          textColor: 'text-red-400',
          iconBg: 'bg-red-500/20',
        };
      default:
        return {
          icon: ShieldAlert,
          title: 'Unknown',
          description: 'Unable to determine risk level.',
          bgGradient: 'from-gray-500/20 to-slate-500/20',
          borderColor: 'border-gray-500/50',
          textColor: 'text-gray-400',
          iconBg: 'bg-gray-500/20',
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    setDownloadError('');

    try {
      const response = await axios.post(
        '/api/report',
        { scan: result },
        { responseType: 'blob' }
      );

      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('application/pdf')) {
        const text = await response.data.text();
        let message = 'Failed to generate report';
        try {
          const parsed = JSON.parse(text);
          message = parsed.error || message;
        } catch {
          message = text || message;
        }
        throw new Error(message);
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      const safeName = (result.url || 'scan')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'report';

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `scan-${safeName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Report download failed:', error);
      setDownloadError(error.message || 'Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="max-w-4xl mx-auto mb-12"
    >
      {/* Main Result Card */}
      <div className={`glass p-8 rounded-2xl border-2 ${config.borderColor} bg-gradient-to-br ${config.bgGradient} shadow-2xl`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-4 ${config.iconBg} rounded-xl`}>
              <Icon className={`w-10 h-10 ${config.textColor}`} />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${config.textColor}`}>
                {config.title}
              </h2>
              <p className="text-gray-300 mt-1">{config.description}</p>
            </div>
          </div>
          
          {/* Risk Score */}
          <div className="text-right">
            <div className={`text-5xl font-bold ${config.textColor}`}>
              {result.riskScore}
            </div>
            <p className="text-gray-400 text-sm">Risk Score</p>
            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="mt-3 inline-flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg text-white text-xs hover:bg-white/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
            </button>
            {downloadError && (
              <p className="mt-2 text-xs text-red-300">{downloadError}</p>
            )}
          </div>
        </div>

        {/* Scanned URL */}
        <div className="bg-black/30 rounded-lg p-4 mb-6 border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm font-medium">Scanned URL:</span>
          </div>
          <p className="text-white font-mono text-sm break-all">{result.url}</p>
        </div>

        {/* Flags / Issues Found */}
        {result.flags && result.flags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className={`w-5 h-5 ${config.textColor}`} />
              <h3 className="text-white font-semibold text-lg">
                Issues Detected ({result.flags.length})
              </h3>
            </div>
            
            <div className="space-y-2">
              {result.flags.map((flag, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 bg-white/5 rounded-lg p-3 border border-white/10"
                >
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-200 text-sm">{flag}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem 
            icon={Lock}
            label="HTTPS Encryption"
            value={result.details.https ? 'Enabled' : 'Disabled'}
            status={result.details.https}
          />
          <DetailItem 
            icon={Link2}
            label="URL Shortener"
            value={result.details.isShortener ? 'Yes' : 'No'}
            status={!result.details.isShortener}
          />
          <DetailItem 
            icon={Globe}
            label="IP-based URL"
            value={result.details.usesIP ? 'Yes (Suspicious)' : 'No'}
            status={!result.details.usesIP}
          />
          <DetailItem 
            icon={Eye}
            label="URL Length"
            value={`${result.details.urlLength} characters`}
            status={!result.details.excessiveLength}
          />
        </div>

        {/* Typosquatting Alert */}
        {result.details.typosquatting?.detected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <h4 className="text-red-300 font-bold mb-1">Typosquatting Detected!</h4>
                <p className="text-red-200 text-sm">
                  This domain looks similar to <strong>{result.details.typosquatting.similarTo}</strong>
                  {' '}(similarity: {(result.details.typosquatting.similarity * 100).toFixed(0)}%)
                </p>
                <p className="text-red-200/80 text-xs mt-2">
                  Attackers often create fake sites that mimic legitimate ones to steal credentials.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendation */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-white font-semibold mb-2">💡 Recommendation</h4>
          <p className="text-gray-300 text-sm">
            {result.riskLevel === 'safe' && 
              "This link appears safe, but always verify the sender and use caution with sensitive information."}
            {result.riskLevel === 'suspicious' && 
              "Exercise caution. Verify the link source before clicking. Don't enter passwords or personal information."}
            {result.riskLevel === 'dangerous' && 
              "DO NOT click this link! It shows multiple signs of being a phishing attempt. Delete any messages containing this URL."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function DetailItem({ icon: Icon, label, value, status }) {
  return (
    <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3 border border-white/10">
      <Icon className="w-5 h-5 text-gray-400" />
      <div className="flex-1">
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-white text-sm font-medium">{value}</p>
      </div>
      {status !== undefined && (
        status ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400" />
        )
      )}
    </div>
  );
}
