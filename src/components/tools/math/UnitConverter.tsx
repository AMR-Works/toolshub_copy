import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ruler, ArrowRight } from 'lucide-react';

interface UnitCategory {
  name: string;
  units: { [key: string]: number }; // unit name to its base conversion factor
}

const categories: UnitCategory[] = [
  {
    name: 'Length',
    units: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      micrometer: 0.000001,
      nanometer: 0.000000001,
      mile: 1609.34,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
      'nautical mile': 1852,
    },
  },
  {
    name: 'Weight',
    units: {
      kilogram: 1,
      gram: 0.001,
      milligram: 0.000001,
      tonne: 1000,
      pound: 0.453592,
      ounce: 0.0283495,
      carat: 0.0002,
    },
  },
  {
    name: 'Temperature',
    units: {
      celsius: 1, // Special handling needed for temperature
      fahrenheit: 1,
      kelvin: 1,
    },
  },
  {
    name: 'Time',
    units: {
      second: 1,
      millisecond: 0.001,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2629800, // Approximate
      year: 31557600, // Approximate
    },
  },
  {
    name: 'Speed',
    units: {
      'meter/second': 1,
      'kilometer/hour': 0.277778,
      'mile/hour': 0.44704,
      knot: 0.514444,
    },
  },
  {
    name: 'Energy',
    units: {
      joule: 1,
      kilojoule: 1000,
      calorie: 4.184,
      kilocalorie: 4184,
      'electronvolt': 1.60218e-19,
      'foot-pound': 1.35582,
    },
  },
  {
    name: 'Volume',
    units: {
      'cubic meter': 1,
      'cubic centimeter': 0.000001,
      liter: 0.001,
      milliliter: 0.000001,
      gallon: 0.00378541,
      quart: 0.000946353,
      pint: 0.000473176,
    },
  },
  {
    name: 'Area',
    units: {
      'square meter': 1,
      'square kilometer': 1000000,
      'square centimeter': 0.0001,
      'square millimeter': 0.000001,
      acre: 4046.86,
      hectare: 10000,
      'square mile': 2589990,
      'square yard': 0.836127,
      'square foot': 0.092903,
      'square inch': 0.00064516,
    },
  },
];

const UnitConverter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(categories[0]);
  const [inputValue, setInputValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>(Object.keys(categories[0].units)[0]);
  const [toUnit, setToUnit] = useState<string>(Object.keys(categories[0].units)[1]);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    // Reset units when category changes
    setFromUnit(Object.keys(selectedCategory.units)[0]);
    setToUnit(Object.keys(selectedCategory.units)[1]);
    setResult(null);
    setInputValue('');
  }, [selectedCategory]);

  useEffect(() => {
    convertUnits();
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  const convertUnits = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    if (selectedCategory.name === 'Temperature') {
      let baseValue: number;
      if (fromUnit === 'celsius') {
        baseValue = value;
      } else if (fromUnit === 'fahrenheit') {
        baseValue = (value - 32) * 5 / 9;
      } else if (fromUnit === 'kelvin') {
        baseValue = value - 273.15;
      } else {
        setResult('Invalid temperature unit');
        return;
      }

      let convertedValue: number;
      if (toUnit === 'celsius') {
        convertedValue = baseValue;
      } else if (toUnit === 'fahrenheit') {
        convertedValue = (baseValue * 9 / 5) + 32;
      } else if (toUnit === 'kelvin') {
        convertedValue = baseValue + 273.15;
      } else {
        setResult('Invalid temperature unit');
        return;
      }
      setResult(convertedValue.toFixed(4));
      return;
    }

    const fromFactor = selectedCategory.units[fromUnit];
    const toFactor = selectedCategory.units[toUnit];

    if (fromFactor === undefined || toFactor === undefined) {
      setResult('Invalid unit selection');
      return;
    }

    const baseValue = value * fromFactor;
    const convertedValue = baseValue / toFactor;
    setResult(convertedValue.toFixed(6));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md"
    >
      <div className="flex items-center mb-4">
        <Ruler className="w-6 h-6 text-purple-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Unit Converter</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory.name}
            onChange={(e) => setSelectedCategory(categories.find(cat => cat.name === e.target.value) || categories[0])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="inputValue" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Value
          </label>
          <input
            type="number"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value to convert"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromUnit" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
              From Unit
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Object.keys(selectedCategory.units).map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="toUnit" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
              To Unit
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Object.keys(selectedCategory.units).map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* <button
          onClick={convertUnits}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
        >
          Convert
          <ArrowRight className="w-4 h-4 ml-2" />
        </button> */}
      </div>

      {result !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 bg-purple-50 dark:bg-purple-900 rounded-md"
        >
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Result: <span className="font-bold text-purple-600 dark:text-purple-300">{result} {toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UnitConverter;