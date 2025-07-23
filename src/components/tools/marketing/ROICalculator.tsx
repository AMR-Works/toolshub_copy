import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

export const ROICalculator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg">
          <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">💰 ROI Calculator</h2>
          <p className="text-muted-foreground text-sm">
            Calculate ROI from revenue and cost. Includes chart view of profit/loss.
          </p>
        </div>
      </div>

      {/* Tool implementation will go here */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Revenue
          </label>
          <input 
            type="number" 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="e.g., 10000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Cost
          </label>
          <input 
            type="number" 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="e.g., 5000"
          />
        </div>
        <div className="mt-6">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">
            Calculate ROI
          </button>
        </div>
      </div>
    </motion.div>
  );
};