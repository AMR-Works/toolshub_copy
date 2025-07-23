import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const NeumorphismGenerator: React.FC = () => {
  const [depth, setDepth] = useState(10);
  const [intensity, setIntensity] = useState(0.1);
  const [color, setColor] = useState('#e0e0e0');
  const [distance, setDistance] = useState(10);
  const [blur, setBlur] = useState(20);
  const { toast } = useToast();

  const generateCss = () => {
    const lightShadow = `-${distance}px -${distance}px ${blur}px rgba(255, 255, 255, ${intensity})`;
    const darkShadow = `${distance}px ${distance}px ${blur}px rgba(0, 0, 0, ${intensity})`;

    return `
      background: ${color};
      border-radius: ${depth}px;
      box-shadow: ${lightShadow}, ${darkShadow};
    `;
  };

  const copyCssToClipboard = () => {
    const css = generateCss();
    navigator.clipboard.writeText(css).then(() => {
      toast({
        title: 'CSS Copied',
        description: 'Neumorphism CSS copied to clipboard.',
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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Neumorphism Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Generate soft UI shadows for neumorphic buttons or cards. Adjust depth, intensity, color, and direction.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="depth" className="text-gray-700 dark:text-gray-200">Border Radius (Depth): {depth}px</Label>
            <Slider
              id="depth"
              min={0}
              max={50}
              step={1}
              value={[depth]}
              onValueChange={(val) => setDepth(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="intensity" className="text-gray-700 dark:text-gray-200">Shadow Intensity: {intensity.toFixed(2)}</Label>
            <Slider
              id="intensity"
              min={0.01}
              max={0.5}
              step={0.01}
              value={[intensity]}
              onValueChange={(val) => setIntensity(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="distance" className="text-gray-700 dark:text-gray-200">Shadow Distance: {distance}px</Label>
            <Slider
              id="distance"
              min={1}
              max={50}
              step={1}
              value={[distance]}
              onValueChange={(val) => setDistance(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="blur" className="text-gray-700 dark:text-gray-200">Shadow Blur: {blur}px</Label>
            <Slider
              id="blur"
              min={0}
              max={100}
              step={1}
              value={[blur]}
              onValueChange={(val) => setBlur(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-200 mb-2 block">Base Color</Label>
            <HexColorPicker color={color} onChange={setColor} className="w-full" />
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div
            className="w-64 h-40 flex items-center justify-center text-gray-700 dark:text-gray-200 font-semibold text-lg transition-all duration-300 ease-in-out"
            style={generateCss() as React.CSSProperties}
          >
            Neumorphic Element
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

export default NeumorphismGenerator;