import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Signal, ArrowRight } from 'lucide-react';

const SNRatioCalculator: React.FC = () => {
  const [signalPower, setSignalPower] = useState<string>('');
  const [noisePower, setNoisePower] = useState<string>('');
  const [snr, setSnr] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);

  const calculateSNR = () => {
    const S = parseFloat(signalPower);
    const N = parseFloat(noisePower);

    if (isNaN(S) || isNaN(N) || S <= 0 || N <= 0) {
      setSnr('Invalid input');
      setEmoji(null);
      return;
    }

    // SNR = 10 * log10(S/N)
    const snrValue = 10 * Math.log10(S / N);
    setSnr(snrValue.toFixed(2));

    if (snrValue >= 20) {
      setEmoji('👍 Good');
    } else if (snrValue >= 10 && snrValue < 20) {
      setEmoji('⚠️ Fair');
    } else {
      setEmoji('❌ Poor');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md"
    >
      <div className="flex items-center mb-4">
        <Signal className="w-6 h-6 text-cyan-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Signal-to-Noise Ratio (SNR) Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="signalPower" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Signal Power (e.g., Watts)
          </label>
          <input
            type="number"
            id="signalPower"
            value={signalPower}
            onChange={(e) => setSignalPower(e.target.value)}
            placeholder="Enter signal power"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="noisePower" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Noise Power (e.g., Watts)
          </label>
          <input
            type="number"
            id="noisePower"
            value={noisePower}
            onChange={(e) => setNoisePower(e.target.value)}
            placeholder="Enter noise power"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={calculateSNR}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
        >
          Calculate SNR
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {snr && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 bg-cyan-50 dark:bg-cyan-900 rounded-md"
        >
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            SNR: <span className="font-bold text-cyan-600 dark:text-cyan-300">{snr} dB</span>
          </p>
          {emoji && (
            <p className="text-md text-gray-700 dark:text-gray-200">
              Status: <span className="font-semibold">{emoji}</span>
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SNRatioCalculator;