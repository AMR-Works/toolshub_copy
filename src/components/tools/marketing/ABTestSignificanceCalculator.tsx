import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

export const ABTestSignificanceCalculator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
          <FlaskConical className="h-6 w-6 text-green-600 dark:text-green-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">🧪 A/B Test Significance Calculator</h2>
          <p className="text-muted-foreground text-sm">
            Calculate p-value, confidence interval, conversion rates, and test result significance with emoji feedback and graph.
          </p>
        </div>
      </div>

      {/* Tool implementation will go here */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Variant A (Control) - Conversions
            </label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="e.g., 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Variant A (Control) - Visitors
            </label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="e.g., 1000"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Variant B (Experiment) - Conversions
            </label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="e.g., 120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Variant B (Experiment) - Visitors
            </label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="e.g., 1000"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
            Calculate Significance
          </button>
        </div>
      </div>
    </motion.div>
  );
};