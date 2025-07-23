import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const BorderRadiusGenerator: React.FC = () => {
  const [topLeft, setTopLeft] = useState(10);
  const [topRight, setTopRight] = useState(10);
  const [bottomRight, setBottomRight] = useState(10);
  const [bottomLeft, setBottomLeft] = useState(10);
  const { toast } = useToast();

  const generateCss = () => {
    return `border-radius: ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px;`;
  };

  const copyCssToClipboard = () => {
    const css = generateCss();
    navigator.clipboard.writeText(css).then(() => {
      toast({
        title: 'CSS Copied',
        description: 'Border-radius CSS copied to clipboard.',
      });
    }).catch(() => {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy CSS to clipboard.',
        variant: 'destructive',
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8 bg-white dark:bg-gray-950 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Border Radius Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Adjust each corner's radius with a visual preview and get the CSS output instantly.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="top-left" className="text-gray-700 dark:text-gray-200">Top-Left: {topLeft}px</Label>
            <Slider
              id="top-left"
              min={0}
              max={100}
              step={1}
              value={[topLeft]}
              onValueChange={(val) => setTopLeft(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="top-right" className="text-gray-700 dark:text-gray-200">Top-Right: {topRight}px</Label>
            <Slider
              id="top-right"
              min={0}
              max={100}
              step={1}
              value={[topRight]}
              onValueChange={(val) => setTopRight(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="bottom-right" className="text-gray-700 dark:text-gray-200">Bottom-Right: {bottomRight}px</Label>
            <Slider
              id="bottom-right"
              min={0}
              max={100}
              step={1}
              value={[bottomRight]}
              onValueChange={(val) => setBottomRight(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="bottom-left" className="text-gray-700 dark:text-gray-200">Bottom-Left: {bottomLeft}px</Label>
            <Slider
              id="bottom-left"
              min={0}
              max={100}
              step={1}
              value={[bottomLeft]}
              onValueChange={(val) => setBottomLeft(val[0])}
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div
            className="w-48 h-48 bg-blue-500 dark:bg-blue-700 flex items-center justify-center text-white text-lg font-semibold transition-all duration-300 ease-in-out"
            style={{ borderRadius: `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px` }}
          >
            Preview Box
          </div>

          <Button
            onClick={copyCssToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200"
          >
            <Copy className="h-5 w-5" />
            <span>Copy CSS</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BorderRadiusGenerator;