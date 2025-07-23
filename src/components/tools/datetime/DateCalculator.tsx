import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

export const DateCalculator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto p-6 bg-card rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold">🗓️ Date Calculator</h2>
      </div>
      
      {/* Tool implementation goes here */}
      
      <div className="mt-6 text-sm text-muted-foreground">
        <Clock className="inline mr-1 w-4 h-4" />
        Works 100% client-side - your dates never leave your browser
      </div>
    </motion.div>
  );
};