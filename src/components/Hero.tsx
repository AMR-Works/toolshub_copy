import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Globe, Rocket, Brain, Users, ShieldCheck, BarChart3 } from 'lucide-react';

interface HeroProps {
  className?: string;
}

export const Hero = ({ className }: HeroProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"
        >
          {/* Stats */}
          <motion.div
            variants={container}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            <motion.div variants={item} className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="text-muted-foreground">50,000+ Happy Users</span>
            </motion.div>
            <motion.div variants={item} className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              <span className="text-muted-foreground">99.9% Uptime</span>
            </motion.div>
            <motion.div variants={item} className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-muted-foreground">Trusted in 100+ Countries</span>
            </motion.div>
          </motion.div>

          {/* Floating icons */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className="absolute -left-20 -top-20 text-primary"
            >
              <Globe className="w-12 h-12" />
            </motion.div>
            <motion.div
              animate={{
                x: [0, 20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className="absolute -right-20 -top-20 text-secondary"
            >
              <Rocket className="w-12 h-12" />
            </motion.div>
            <motion.div
              animate={{
                y: [0, 20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className="absolute -left-20 -bottom-20 text-primary"
            >
              <Brain className="w-12 h-12" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            variants={item}
            className="text-5xl md:text-7xl font-bold text-foreground mb-6"
          >
            <span className="text-primary">THE FUTURE</span> OF PRODUCTIVITY
          </motion.h1>
          <motion.p
            variants={item}
            className="text-xl md:text-2xl text-muted-foreground mb-8"
          >
            One hub. Infinite possibilities. 50+ intelligent tools for creators, developers, and innovators.
          </motion.p>

          <motion.div
            variants={container}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="w-full md:w-auto bg-primary text-background hover:bg-primary/90"
            >
              Start Building
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full md:w-auto border-primary hover:bg-primary/10"
            >
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
