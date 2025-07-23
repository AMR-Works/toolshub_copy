import React from 'react';
import { motion } from 'framer-motion';
import { Type } from 'lucide-react';

export const SlugGenerator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg shadow-sm border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-teal-100 dark:bg-teal-900/50 p-2 rounded-lg">
          <Type className="h-6 w-6 text-teal-600 dark:text-teal-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">🔤 Slug Generator</h2>
          <p className="text-muted-foreground text-sm">
            Convert titles/headlines into SEO-friendly slugs with real-time preview.
          </p>
        </div>
      </div>

      {/* Tool implementation will go here */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Original Title/Headline
          </label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-md" 
            placeholder="Your Awesome Blog Post Title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Generated Slug
          </label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-800" 
            readOnly 
            placeholder="your-awesome-blog-post-title"
          />
        </div>
        <div className="mt-6">
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md">
            Generate Slug
          </button>
        </div>
      </div>
    </motion.div>
  );
};