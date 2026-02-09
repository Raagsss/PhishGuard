import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return null;
  }

  const statItems = [
    {
      icon: TrendingUp,
      label: 'Total Scans',
      value: stats.totalScans.toLocaleString(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: Shield,
      label: 'Phishing Blocked',
      value: stats.phishingDetected.toLocaleString(),
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      icon: AlertTriangle,
      label: 'Suspicious Detected',
      value: stats.suspiciousDetected.toLocaleString(),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      icon: CheckCircle,
      label: 'Safe URLs',
      value: stats.safeURLs.toLocaleString(),
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Live Statistics
        </h2>
        <p className="text-gray-400">Real-time threat detection metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-xl border border-white/10 text-center"
          >
            <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-3`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className={`text-3xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-gray-400 text-sm">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
