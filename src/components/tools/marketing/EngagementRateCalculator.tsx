import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const EngagementRateCalculator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-pink-100 dark:bg-pink-900/50 p-2 rounded-lg">
          <Heart className="h-6 w-6 text-pink-600 dark:text-pink-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">📊 Engagement Rate Calculator</h2>
          <p className="text-muted-foreground text-sm">
            Social media ER calculator with auto emoji quality scale.
          </p>
        </div>
      </div>

      {/* Tool implementation will go here */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Total Engagements (Likes, Comments, Shares)
          </label>
          <input 
            type="number" 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="e.g., 500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Total Followers/Reach
          </label>
          <input 
            type="number" 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="e.g., 10000"
          />
        </div>
        <div className="mt-6">
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md">
            Calculate Engagement Rate
          </button>
        </div>
      </div>
    </motion.div>
  );
};