import React from 'react';
import { motion } from 'framer-motion';
import { Timer as StopwatchIcon } from 'lucide-react';

export const Stopwatch = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto p-6 bg-card rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <StopwatchIcon className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold">🕰️ Stopwatch</h2>
      </div>
      
      {/* Tool implementation goes here */}
      
      <div className="mt-6 text-sm text-muted-foreground">
        Lap tracker with animated timeline and sound effects
      </div>
    </motion.div>
  );
};