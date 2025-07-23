import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';

const OhmsLawCalculator: React.FC = () => {
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [resistance, setResistance] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    // Clear result when inputs change
    setResult(null);
  }, [voltage, current, resistance]);

  const calculateOhmsLaw = () => {
    const V = parseFloat(voltage);
    const I = parseFloat(current);
    const R = parseFloat(resistance);

    let calculatedValue: number | null = null;
    let calculatedUnit: string = '';

    if (!isNaN(V) && !isNaN(I) && isNaN(R)) {
      // Calculate Resistance (R = V / I)
      if (I === 0) {
        setResult('Error: Current cannot be zero');
        return;
      }
      calculatedValue = V / I;
      calculatedUnit = 'Ohms (Ω)';
    } else if (!isNaN(V) && isNaN(I) && !isNaN(R)) {
      // Calculate Current (I = V / R)
      if (R === 0) {
        setResult('Error: Resistance cannot be zero');
        return;
      }
      calculatedValue = V / R;
      calculatedUnit = 'Amperes (A)';
    } else if (isNaN(V) && !isNaN(I) && !isNaN(R)) {
      // Calculate Voltage (V = I * R)
      calculatedValue = I * R;
      calculatedUnit = 'Volts (V)';
    } else {
      setResult('Please enter exactly two values to calculate the third.');
      return;
    }

    if (calculatedValue !== null) {
      setResult(`${calculatedValue.toFixed(4)} ${calculatedUnit}`);
    } else {
      setResult('Invalid input or too many values provided.');
    }
  };

  const clearInputs = () => {
    setVoltage('');
    setCurrent('');
    setResistance('');
    setResult(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md"
    >
      <div className="flex items-center mb-4">
        <Zap className="w-6 h-6 text-yellow-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Ohm's Law Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="voltage" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Voltage (V)
          </label>
          <input
            type="number"
            id="voltage"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
            placeholder="Enter Voltage"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="current" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Current (A)
          </label>
          <input
            type="number"
            id="current"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Enter Current"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="resistance" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Resistance (Ω)
          </label>
          <input
            type="number"
            id="resistance"
            value={resistance}
            onChange={(e) => setResistance(e.target.value)}
            placeholder="Enter Resistance"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={calculateOhmsLaw}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
          >
            Calculate
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <button
            onClick={clearInputs}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
          >
            Clear
          </button>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-md"
        >
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Result:
          </p>
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-300">
            {result}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OhmsLawCalculator;