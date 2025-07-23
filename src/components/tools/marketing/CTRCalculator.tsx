import React from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';

export const CTRCalculator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-lg">
          <MousePointerClick className="h-6 w-6 text-orange-600 dark:text-orange-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">📈 CTR Calculator</h2>
          <p className="text-muted-foreground text-sm">
            Calculate Click-Through Rate with emoji feedback and performance gauge chart.
          </p>
        </div>
      </div>

      {/* Tool implementation will go here */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Clicks
          </label>
          <input 
            type="number" 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="e.g., 100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Impressions
          </label>
          <input 
            type="number" 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="e.g., 1000"
          />
        </div>
        <div className="mt-6">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md">
            Calculate CTR
          </button>
        </div>
      </div>
    </motion.div>
  );
};