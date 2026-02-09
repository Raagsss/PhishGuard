import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scanner from './components/Scanner';
import ResultCard from './components/ResultCard';
import Header from './components/Header';
import Stats from './components/Stats';
import Features from './components/Features';
import SnowfallEffect from './components/Snowfall';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanComplete = (result) => {
    setScanResult(result);
    setIsScanning(false);
  };

  const handleScanStart = () => {
    setIsScanning(true);
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Snowfall Effect */}
      <SnowfallEffect />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient from-purple-400 via-pink-400 to-blue-400">
                Phishing Link
              </span>
              <br />
              <span className="text-white">Scanner</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Instantly detect malicious URLs, phishing attempts, and suspicious links.
              <span className="block mt-2 text-purple-300">Advanced AI-free security analysis.</span>
            </p>
          </motion.div>

          {/* Scanner Component */}
          <Scanner 
            onScanComplete={handleScanComplete}
            onScanStart={handleScanStart}
            isScanning={isScanning}
          />

          {/* Results */}
          <AnimatePresence mode="wait">
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ResultCard result={scanResult} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features Section */}
          {!scanResult && !isScanning && <Features />}

          {/* Stats Section */}
          <Stats />

        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-400">
          <p>Built with ❤️ for cybersecurity | Open Source on GitHub</p>
          <p className="text-sm mt-2">Protecting users from phishing attacks, one URL at a time 🛡️</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
