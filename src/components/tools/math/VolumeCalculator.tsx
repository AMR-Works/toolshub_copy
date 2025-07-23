import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Circle, Cylinder, Cone, ArrowRight } from 'lucide-react';

type Shape = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'rectangular_prism';

const VolumeCalculator: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<Shape>('cube');
  const [dimensions, setDimensions] = useState<{[key: string]: string}>({});
  const [volume, setVolume] = useState<string | null>(null);
  const [formula, setFormula] = useState<string | null>(null);

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDimensions({ ...dimensions, [e.target.id]: e.target.value });
  };

  const calculateVolume = () => {
    let calculatedVolume: number | null = null;
    let calculatedFormula: string | null = null;

    switch (selectedShape) {
      case 'cube':
        const side = parseFloat(dimensions.side);
        if (!isNaN(side) && side > 0) {
          calculatedVolume = Math.pow(side, 3);
          calculatedFormula = 'Side³';
        }
        break;
      case 'sphere':
        const radius = parseFloat(dimensions.radius);
        if (!isNaN(radius) && radius > 0) {
          calculatedVolume = (4 / 3) * Math.PI * Math.pow(radius, 3);
          calculatedFormula = '(4/3) × π × Radius³';
        }
        break;
      case 'cylinder':
        const cylRadius = parseFloat(dimensions.cylRadius);
        const cylHeight = parseFloat(dimensions.cylHeight);
        if (!isNaN(cylRadius) && !isNaN(cylHeight) && cylRadius > 0 && cylHeight > 0) {
          calculatedVolume = Math.PI * Math.pow(cylRadius, 2) * cylHeight;
          calculatedFormula = 'π × Radius² × Height';
        }
        break;
      case 'cone':
        const coneRadius = parseFloat(dimensions.coneRadius);
        const coneHeight = parseFloat(dimensions.coneHeight);
        if (!isNaN(coneRadius) && !isNaN(coneHeight) && coneRadius > 0 && coneHeight > 0) {
          calculatedVolume = (1 / 3) * Math.PI * Math.pow(coneRadius, 2) * coneHeight;
          calculatedFormula = '(1/3) × π × Radius² × Height';
        }
        break;
      case 'rectangular_prism':
        const length = parseFloat(dimensions.length);
        const width = parseFloat(dimensions.width);
        const height = parseFloat(dimensions.height);
        if (!isNaN(length) && !isNaN(width) && !isNaN(height) && length > 0 && width > 0 && height > 0) {
          calculatedVolume = length * width * height;
          calculatedFormula = 'Length × Width × Height';
        }
        break;
      default:
        break;
    }

    setVolume(calculatedVolume !== null ? calculatedVolume.toFixed(2) : null);
    setFormula(calculatedFormula);
  };

  const renderShapeInputs = () => {
    switch (selectedShape) {
      case 'cube':
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
                placeholder="e.g., 5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        );
      case 'sphere':
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
                placeholder="e.g., 7"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        );
      case 'cylinder':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="cylRadius" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Radius
              </label>
              <input
                type="number"
                id="cylRadius"
                value={dimensions.cylRadius || ''}
                onChange={handleDimensionChange}
                placeholder="e.g., 4"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="cylHeight" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Height
              </label>
              <input
                type="number"
                id="cylHeight"
                value={dimensions.cylHeight || ''}
                onChange={handleDimensionChange}
                placeholder="e.g., 10"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        );
      case 'cone':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="coneRadius" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Radius
              </label>
              <input
                type="number"
                id="coneRadius"
                value={dimensions.coneRadius || ''}
                onChange={handleDimensionChange}
                placeholder="e.g., 3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="coneHeight" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Height
              </label>
              <input
                type="number"
                id="coneHeight"
                value={dimensions.coneHeight || ''}
                onChange={handleDimensionChange}
                placeholder="e.g., 9"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        );
      case 'rectangular_prism':
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
                placeholder="e.g., 6"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                placeholder="e.g., 4"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
        <Box className="w-6 h-6 text-orange-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Volume Calculator</h2>
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
              setVolume(null);
              setFormula(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="cube">Cube</option>
            <option value="sphere">Sphere</option>
            <option value="cylinder">Cylinder</option>
            <option value="cone">Cone</option>
            <option value="rectangular_prism">Rectangular Prism</option>
          </select>
        </div>

        {renderShapeInputs()}

        <button
          onClick={calculateVolume}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
        >
          Calculate Volume
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {volume && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 bg-orange-50 dark:bg-orange-900 rounded-md"
        >
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Volume: <span className="font-bold text-orange-600 dark:text-orange-300">{volume}</span>
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

export default VolumeCalculator;