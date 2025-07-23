import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, ArrowRight } from 'lucide-react';

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBmi] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setBmi('Invalid input');
      setClassification(null);
      setEmoji(null);
      return;
    }

    // Assuming height in cm and weight in kg for calculation
    // BMI = weight (kg) / (height (m))^2
    const bmiValue = w / ((h / 100) * (h / 100));
    setBmi(bmiValue.toFixed(2));

    if (bmiValue < 18.5) {
      setClassification('Underweight');
      setEmoji('⚠️');
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      setClassification('Normal weight');
      setEmoji('💪');
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      setClassification('Overweight');
      setEmoji('❗');
    } else {
      setClassification('Obese');
      setEmoji('🚨');
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
        <Scale className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">BMI Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="height" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g., 175"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="weight" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 70"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={calculateBMI}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
        >
          Calculate BMI
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {bmi && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-md"
        >
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Your BMI: <span className="font-bold text-blue-600 dark:text-blue-300">{bmi}</span>
          </p>
          {classification && (
            <p className="text-md text-gray-700 dark:text-gray-200">
              Classification: <span className="font-semibold">{classification} {emoji}</span>
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default BMICalculator;