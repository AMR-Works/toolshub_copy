import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Square, Triangle, Circle, RectangleHorizontal, ArrowRight } from 'lucide-react';

type Shape = 'square' | 'rectangle' | 'circle' | 'triangle';

const AreaCalculator: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<Shape>('square');
  const [dimensions, setDimensions] = useState<{[key: string]: string}>({});
  const [area, setArea] = useState<string | null>(null);
  const [formula, setFormula] = useState<string | null>(null);

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDimensions({ ...dimensions, [e.target.id]: e.target.value });
  };

  const calculateArea = () => {
    let calculatedArea: number | null = null;
    let calculatedFormula: string | null = null;

    switch (selectedShape) {
      case 'square':
        const side = parseFloat(dimensions.side);
        if (!isNaN(side) && side > 0) {
          calculatedArea = side * side;
          calculatedFormula = 'Side × Side';
        }
        break;
      case 'rectangle':
        const length = parseFloat(dimensions.length);
        const width = parseFloat(dimensions.width);
        if (!isNaN(length) && !isNaN(width) && length > 0 && width > 0) {
          calculatedArea = length * width;
          calculatedFormula = 'Length × Width';
        }
        break;
      case 'circle':
        const radius = parseFloat(dimensions.radius);
        if (!isNaN(radius) && radius > 0) {
          calculatedArea = Math.PI * radius * radius;
          calculatedFormula = 'π × Radius²';
        }
        break;
      case 'triangle':
        const base = parseFloat(dimensions.base);
        const height = parseFloat(dimensions.height);
        if (!isNaN(base) && !isNaN(height) && base > 0 && height > 0) {
          calculatedArea = 0.5 * base * height;
          calculatedFormula = '0.5 × Base × Height';
        }
        break;
      default:
        break;
    }

    setArea(calculatedArea !== null ? calculatedArea.toFixed(2) : null);
    setFormula(calculatedFormula);
  };

  const renderShapeInputs = () => {
    switch (selectedShape) {
      case 'square':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="side" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Side Length
              </label>
              <input
                type="number"
                id="side"
                value={dimensions.side || ''}
                onChange={handleDimensionChange}
                placeholder="e.g., 10"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        );
      case 'rectangle':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="length" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Length
              </label>
              <input
                type="number"
                id="length"
                value={dimensions.length || ''}
                onChange={handleDimensionChange}
                placeholder="e.g., 12"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="width" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Width
              </label>
              <input
                type="number"
                id="width"
                value={dimensions.width || ''}
                onChange={handleDimensionChange}
                placeholder="e.g., 8"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        );
      case 'circle':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="radius" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Radius
              </label>
              <input
                type="number"
                id="radius"
                value={dimensions.radius || ''}
                onChange={handleDimensionChange}
                placeholder="e.g., 5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        );
      case 'triangle':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="base" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Base Length
              </label>
              <input
                type="number"
                id="base"
                value={dimensions.base || ''}
                onChange={handleDimensionChange}
                placeholder="e.g., 10"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Height
              </label>
              <input
                type="number"
                id="height"
                value={dimensions.height || ''}
                onChange={handleDimensionChange}
                placeholder="e.g., 8"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        );
      default:
        return null;
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
        <Square className="w-6 h-6 text-green-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Area Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="shape" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Select Shape
          </label>
          <select
            id="shape"
            value={selectedShape}
            onChange={(e) => {
              setSelectedShape(e.target.value as Shape);
              setDimensions({}); // Clear dimensions when shape changes
              setArea(null);
              setFormula(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="square">Square</option>
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>

        {renderShapeInputs()}

        <button
          onClick={calculateArea}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
        >
          Calculate Area
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {area && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-md"
        >
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Area: <span className="font-bold text-green-600 dark:text-green-300">{area}</span>
          </p>
          {formula && (
            <p className="text-md text-gray-700 dark:text-gray-200">
              Formula: <span className="font-semibold">{formula}</span>
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AreaCalculator;