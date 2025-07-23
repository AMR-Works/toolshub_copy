import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, ArrowRight } from 'lucide-react';

const SPEED_OF_LIGHT_VACUUM = 299792458; // meters/second
const SPEED_OF_LIGHT_AIR = 299702547; // meters/second (approx, depends on conditions)

type CalculationType = 'frequency_to_wavelength' | 'wavelength_to_frequency';

const FrequencyWavelengthConverter: React.FC = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>('frequency_to_wavelength');
  const [inputValue, setInputValue] = useState<string>('');
  const [inputUnit, setInputUnit] = useState<string>('hz');
  const [medium, setMedium] = useState<string>('vacuum');
  const [result, setResult] = useState<string | null>(null);
  const [resultUnit, setResultUnit] = useState<string | null>(null);

  const calculate = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) {
      setResult('Invalid input');
      setResultUnit(null);
      return;
    }

    let speedOfLight = medium === 'vacuum' ? SPEED_OF_LIGHT_VACUUM : SPEED_OF_LIGHT_AIR;

    let calculatedValue: number;
    let unitFactor: number;

    if (calculationType === 'frequency_to_wavelength') {
      // Convert input frequency to Hz
      if (inputUnit === 'khz') unitFactor = 1000;
      else if (inputUnit === 'mhz') unitFactor = 1000000;
      else if (inputUnit === 'ghz') unitFactor = 1000000000;
      else unitFactor = 1; // hz

      const frequencyHz = value * unitFactor;
      calculatedValue = speedOfLight / frequencyHz;
      setResultUnit('m'); // Default to meters
    } else {
      // Convert input wavelength to meters
      if (inputUnit === 'cm') unitFactor = 0.01;
      else if (inputUnit === 'mm') unitFactor = 0.001;
      else if (inputUnit === 'nm') unitFactor = 0.000000001;
      else unitFactor = 1; // m

      const wavelengthM = value * unitFactor;
      calculatedValue = speedOfLight / wavelengthM;
      setResultUnit('Hz'); // Default to Hz
    }

    setResult(calculatedValue.toPrecision(6));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as CalculationType;
    setCalculationType(newType);
    setInputValue('');
    setResult(null);
    if (newType === 'frequency_to_wavelength') {
      setInputUnit('hz');
      setResultUnit('m');
    } else {
      setInputUnit('m');
      setResultUnit('Hz');
    }
  };

  const renderInputUnitOptions = () => {
    if (calculationType === 'frequency_to_wavelength') {
      return (
        <>
          <option value="hz">Hz</option>
          <option value="khz">kHz</option>
          <option value="mhz">MHz</option>
          <option value="ghz">GHz</option>
        </>
      );
    } else {
      return (
        <>
          <option value="m">m</option>
          <option value="cm">cm</option>
          <option value="mm">mm</option>
          <option value="nm">nm</option>
        </>
      );
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
        <Waves className="w-6 h-6 text-pink-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Frequency-Wavelength Converter</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="calculationType" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Calculation Type
          </label>
          <select
            id="calculationType"
            value={calculationType}
            onChange={handleTypeChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="frequency_to_wavelength">Frequency to Wavelength</option>
            <option value="wavelength_to_frequency">Wavelength to Frequency</option>
          </select>
        </div>

        <div>
          <label htmlFor="inputValue" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Input Value
          </label>
          <div className="flex">
            <input
              type="number"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {renderInputUnitOptions()}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="medium" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Medium
          </label>
          <select
            id="medium"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="vacuum">Vacuum</option>
            <option value="air">Air (approx.)</option>
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
        >
          Calculate
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 bg-pink-50 dark:bg-pink-900 rounded-md"
        >
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Result: <span className="font-bold text-pink-600 dark:text-pink-300">{result} {resultUnit}</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FrequencyWavelengthConverter;