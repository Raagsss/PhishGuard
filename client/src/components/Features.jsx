import { motion } from 'framer-motion';
import { Shield, Zap, Eye, Lock, Database, Award } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Advanced Detection',
      description: 'Detects phishing, typosquatting, IP-based URLs, and more',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get security insights in under 2 seconds',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Eye,
      title: 'Detailed Analysis',
      description: 'See exactly why a link is flagged as suspicious',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'No data stored, no tracking, completely anonymous',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Database,
      title: 'No API Limits',
      description: '100% free with unlimited scans',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Open Source',
      description: 'Transparent security you can verify yourself',
      gradient: 'from-indigo-500 to-purple-500'
    },
  ];

  return (
    <div id="features" className="mb-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-4">
          Why Use PhishGuard?
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Enterprise-grade security scanning, completely free and open source
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 1, ease: 'easeOut' }}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            className="glass p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-400 text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
