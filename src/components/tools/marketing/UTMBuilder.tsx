import React from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon } from 'lucide-react';

export const UTMBuilder = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
          <LinkIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">🔗 UTM Builder</h2>
          <p className="text-muted-foreground text-sm">
            Generate trackable URLs with customizable UTM parameters
          </p>
        </div>
      </div>

      {/* Tool implementation will go here */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Website URL
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Campaign Source
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="google, newsletter, etc"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Campaign Medium
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="cpc, banner, email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Campaign Name
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="summer_sale"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Campaign Term (optional)
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="keyword"
            />
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Generate UTM URL
          </button>
        </div>
      </div>
    </motion.div>
  );
};