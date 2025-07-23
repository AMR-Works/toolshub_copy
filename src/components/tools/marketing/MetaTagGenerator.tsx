import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

export const MetaTagGenerator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
          <Tag className="h-6 w-6 text-purple-600 dark:text-purple-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">🏷️ Meta Tag Generator</h2>
          <p className="text-muted-foreground text-sm">
            Create SEO/meta tags (Open Graph, Twitter Cards, etc.)
          </p>
        </div>
      </div>

      {/* Tool implementation will go here */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Page Title
          </label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="Your Awesome Page Title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Page Description
          </label>
          <textarea 
            className="w-full px-3 py-2 border rounded-md h-24" 
            placeholder="A short and concise description of your page."
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Keywords (comma-separated)
          </label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>
        <div className="mt-6">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
            Generate Meta Tags
          </button>
        </div>
      </div>
    </motion.div>
  );
};