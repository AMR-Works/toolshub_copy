import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export const KeywordDensityAnalyzer = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
          <Search className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">🔎 Keyword Density Analyzer</h2>
          <p className="text-muted-foreground text-sm">
            Analyze keywords from content for SEO; visualize with bar chart.
          </p>
        </div>
      </div>

      {/* Tool implementation will go here */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Content to Analyze
          </label>
          <textarea 
            className="w-full px-3 py-2 border rounded-md h-48" 
            placeholder="Paste your article content here..."
          ></textarea>
        </div>
        <div className="mt-6">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
            Analyze Keyword Density
          </button>
        </div>
      </div>
    </motion.div>
  );
};