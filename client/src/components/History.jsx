import { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function History({ user }) {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadHistory = async () => {
      try {
        const response = await axios.get('/api/scans', { withCredentials: true });
        setScans(response.data.scans || []);
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };

    loadHistory();
  }, [user]);

  if (!user) {
    return null;
  }

  const iconForRisk = (level) => {
    if (level === 'dangerous') return ShieldX;
    if (level === 'suspicious') return ShieldAlert;
    return ShieldCheck;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Scan History</h2>
        <p className="text-gray-400">Your most recent scans and reports</p>
      </div>

      <div className="glass p-6 rounded-2xl border border-white/10">
        {scans.length === 0 ? (
          <p className="text-gray-400 text-sm">No scans yet. Start scanning to build history.</p>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => {
              const Icon = iconForRisk(scan.riskLevel);
              return (
                <div
                  key={scan._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-purple-300" />
                    <div>
                      <p className="text-white text-sm break-all">{scan.url}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(scan.createdAt).toLocaleString()} · Score {scan.riskScore}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/api/scans/${scan._id}/report`}
                    className="mt-3 md:mt-0 inline-flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg text-white text-xs hover:bg-white/20 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Report</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
