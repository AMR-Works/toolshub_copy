import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const BoxShadowGenerator: React.FC = () => {
  const [offsetX, setOffsetX] = useState(10);
  const [offsetY, setOffsetY] = useState(10);
  const [blurRadius, setBlurRadius] = useState(20);
  const [spreadRadius, setSpreadRadius] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);
  const { toast } = useToast();

  const generateCss = () => {
    const rgbaColor = `rgba(${parseInt(shadowColor.slice(1, 3), 16)}, ${parseInt(shadowColor.slice(3, 5), 16)}, ${parseInt(shadowColor.slice(5, 7), 16)}, ${opacity / 100})`;
    const insetString = inset ? 'inset ' : '';
    return `box-shadow: ${insetString}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${rgbaColor};`;
  };

  const copyCssToClipboard = () => {
    const css = generateCss();
    navigator.clipboard.writeText(css).then(() => {
      toast({
        title: 'CSS Copied',
        description: 'Box-shadow CSS copied to clipboard.',
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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Box Shadow Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Customize shadow distance, blur, color, and inset. Get instant CSS code for your designs.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="offset-x" className="text-gray-700 dark:text-gray-200">Offset X: {offsetX}px</Label>
            <Slider
              id="offset-x"
              min={-50}
              max={50}
              step={1}
              value={[offsetX]}
              onValueChange={(val) => setOffsetX(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="offset-y" className="text-gray-700 dark:text-gray-200">Offset Y: {offsetY}px</Label>
            <Slider
              id="offset-y"
              min={-50}
              max={50}
              step={1}
              value={[offsetY]}
              onValueChange={(val) => setOffsetY(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="blur-radius" className="text-gray-700 dark:text-gray-200">Blur Radius: {blurRadius}px</Label>
            <Slider
              id="blur-radius"
              min={0}
              max={100}
              step={1}
              value={[blurRadius]}
              onValueChange={(val) => setBlurRadius(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="spread-radius" className="text-gray-700 dark:text-gray-200">Spread Radius: {spreadRadius}px</Label>
            <Slider
              id="spread-radius"
              min={-50}
              max={50}
              step={1}
              value={[spreadRadius]}
              onValueChange={(val) => setSpreadRadius(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-200 mb-2 block">Shadow Color</Label>
            <HexColorPicker color={shadowColor} onChange={setShadowColor} className="w-full" />
            <Input
              type="text"
              value={shadowColor}
              onChange={(e) => setShadowColor(e.target.value)}
              className="mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label htmlFor="opacity" className="text-gray-700 dark:text-gray-200">Opacity: {opacity}%</Label>
            <Slider
              id="opacity"
              min={0}
              max={100}
              step={1}
              value={[opacity]}
              onValueChange={(val) => setOpacity(val[0])}
              className="mt-2"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inset-toggle"
              checked={inset}
              onCheckedChange={setInset}
            />
            <Label htmlFor="inset-toggle" className="text-gray-700 dark:text-gray-200">Inset Shadow</Label>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div
            className="w-48 h-48 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out"
            style={{ boxShadow: generateCss().replace('box-shadow: ', '') }}
          >
            <span className="text-gray-700 dark:text-gray-200">Preview Box</span>
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

export default BoxShadowGenerator;