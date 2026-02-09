import { useState } from 'react';
import { Search, Loader2, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import QueueStatus from './QueueStatus';

export default function Scanner({ onScanComplete, onScanStart, isScanning }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL to scan');
      return;
    }

    setError('');
    onScanStart();
    setJobId(null);

    try {
      const response = await axios.post('/api/scan', { url: url.trim() }, { withCredentials: true });
      
      if (response.data.jobId) {
        setJobId(response.data.jobId);
        return;
      }

      onScanComplete(response.data);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scan URL. Please try again.');
      onScanComplete(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const exampleURLs = [
    { url: 'http://paypaI-verification.com', label: 'Phishing Example' },
    { url: 'https://192.168.1.1/login', label: 'IP-based URL' },
    { url: 'https://google.com', label: 'Safe Example' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
      className="max-w-3xl mx-auto mb-12"
    >
      <div className="glass p-8 rounded-2xl shadow-2xl border-2 border-purple-500/30">
        <form onSubmit={handleScan} className="space-y-6">
          <div className="relative">
            <div className="flex items-center space-x-2 bg-white/5 rounded-xl border-2 border-white/10 focus-within:border-purple-500/50 transition-all">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste any link here... (e.g., https://suspicious-site.com)"
                className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-4  outline-none"
                disabled={isScanning}
              />
              <button
                type="button"
                onClick={handlePaste}
                className="px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                disabled={isScanning}
              >
                Paste
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="flex items-center space-x-2 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {jobId && (
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <QueueStatus jobId={jobId} onComplete={onScanComplete} />
            </div>
          )}

          <button
            type="submit"
            disabled={isScanning}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing URL...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Scan for Threats</span>
              </>
            )}
          </button>
        </form>

        {/* Example URLs */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-gray-400 text-sm mb-3">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleURLs.map((example, index) => (
              <button
                key={index}
                onClick={() => setUrl(example.url)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 hover:text-white transition-all"
                disabled={isScanning}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
