import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const GlassmorphismGenerator: React.FC = () => {
  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(20);
  const [borderRadius, setBorderRadius] = useState(10);
  const [overlayColor, setOverlayColor] = useState('#ffffff');
  const { toast } = useToast();

  const generateCss = () => {
    const rgbaColor = `rgba(${parseInt(overlayColor.slice(1, 3), 16)}, ${parseInt(overlayColor.slice(3, 5), 16)}, ${parseInt(overlayColor.slice(5, 7), 16)}, ${transparency / 100})`;
    return `
      background: ${rgbaColor};
      border-radius: ${borderRadius}px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(${blur}px);
      -webkit-backdrop-filter: blur(${blur}px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    `;
  };

  const copyCssToClipboard = () => {
    const css = generateCss();
    navigator.clipboard.writeText(css).then(() => {
      toast({
        title: 'CSS Copied',
        description: 'Glassmorphism CSS copied to clipboard.',
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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Glassmorphism Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Create frosted-glass CSS effects with adjustable blur, transparency, and border-radius. Live preview and CSS export.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="blur" className="text-gray-700 dark:text-gray-200">Blur: {blur}px</Label>
            <Slider
              id="blur"
              min={0}
              max={50}
              step={1}
              value={[blur]}
              onValueChange={(val) => setBlur(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="transparency" className="text-gray-700 dark:text-gray-200">Transparency: {transparency}%</Label>
            <Slider
              id="transparency"
              min={0}
              max={100}
              step={1}
              value={[transparency]}
              onValueChange={(val) => setTransparency(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="border-radius" className="text-gray-700 dark:text-gray-200">Border Radius: {borderRadius}px</Label>
            <Slider
              id="border-radius"
              min={0}
              max={50}
              step={1}
              value={[borderRadius]}
              onValueChange={(val) => setBorderRadius(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-200 mb-2 block">Overlay Color</Label>
            <HexColorPicker color={overlayColor} onChange={setOverlayColor} className="w-full" />
            <Input
              type="text"
              value={overlayColor}
              onChange={(e) => setOverlayColor(e.target.value)}
              className="mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div
            className="w-64 h-40 rounded-lg flex items-center justify-center text-white text-lg font-semibold shadow-xl"
            style={{
              background: 'url(https://source.unsplash.com/random/800x600?abstract) center/cover no-repeat',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              className="absolute inset-0"
              style={{ ...generateCss() as React.CSSProperties, zIndex: 1 }}
            ></div>
            <span className="relative z-10">Glassmorphism Card</span>
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

export default GlassmorphismGenerator;