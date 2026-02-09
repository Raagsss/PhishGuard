import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

export default function ApiInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass p-6 rounded-2xl border border-white/10 mb-16"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 bg-white/10 rounded-lg">
          <Code2 className="w-5 h-5 text-purple-300" />
        </div>
        <h3 className="text-xl font-bold text-white">Developer API</h3>
      </div>
      <p className="text-gray-400 text-sm mb-3">
        Use the API to scan URLs from your own apps. Authenticate with an API key.
      </p>
      <pre className="bg-black/30 rounded-lg p-3 text-xs text-purple-200 overflow-auto">
{`curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -H "x-api-key: pk_your_key" \
  -d '{"url":"https://example.com"}'`}
      </pre>
    </motion.div>
  );
}
