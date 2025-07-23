import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Download, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toPng, toSvg } from 'html-to-image';

const PatternGenerator: React.FC = () => {
  const [patternType, setPatternType] = useState<'dots' | 'stripes' | 'zigzag' | 'noise'>('dots');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');
  const [size, setSize] = useState(20);
  const [density, setDensity] = useState(50);
  const patternRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generatePattern = () => {
    switch (patternType) {
      case 'dots':
        return `
          background-color: ${secondaryColor};
          background-image: radial-gradient(${primaryColor} ${size / 4}px, transparent ${size / 4}px);
          background-size: ${size}px ${size}px;
          opacity: ${density / 100};
        `;
      case 'stripes':
        return `
          background-color: ${secondaryColor};
          background-image: linear-gradient(90deg, ${primaryColor} ${size}px, transparent ${size}px);
          background-size: ${size * 2}px 100%;
          opacity: ${density / 100};
        `;
      case 'zigzag':
        return `
          background-color: ${secondaryColor};
          background-image: linear-gradient(135deg, ${primaryColor} 25%, transparent 25%),
                            linear-gradient(225deg, ${primaryColor} 25%, transparent 25%),
                            linear-gradient(45deg, ${primaryColor} 25%, transparent 25%),
                            linear-gradient(315deg, ${primaryColor} 25%, ${secondaryColor} 25%);
          background-size: ${size}px ${size}px;
          background-position: ${size / 2}px 0, ${size / 2}px 0, 0 0, 0 0;
          opacity: ${density / 100};
        `;
      case 'noise':
        return `
          background-color: ${secondaryColor};
          background-image: url("data:image/svg+xml,%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${density / 100}'/%3E%3C/svg%3E");
        `;
      default:
        return '';
    }
  };

  const downloadPattern = async (format: 'png' | 'svg') => {
    if (patternRef.current) {
      try {
        let dataUrl;
        let filename;

        if (format === 'png') {
          dataUrl = await toPng(patternRef.current);
          filename = 'pattern.png';
        } else {
          dataUrl = await toSvg(patternRef.current);
          filename = 'pattern.svg';
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: 'Pattern Downloaded',
          description: `Pattern successfully downloaded as ${format.toUpperCase()}.`,
        });
      } catch (error) {
        console.error('oops, something went wrong!', error);
        toast({
          title: 'Download Failed',
          description: 'Failed to download pattern.',
          variant: 'destructive',
        });
      }
    }
  };

  const copyCssToClipboard = () => {
    const css = generatePattern();
    navigator.clipboard.writeText(css).then(() => {
      toast({
        title: 'CSS Copied',
        description: 'Pattern CSS copied to clipboard.',
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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Pattern Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Generate SVG or PNG repeating patterns like dots, stripes, and zigzags. Customize colors, size, and density.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="pattern-type" className="text-gray-700 dark:text-gray-200">Pattern Type</Label>
            <Select value={patternType} onValueChange={(value: 'dots' | 'stripes' | 'zigzag' | 'noise') => setPatternType(value)}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select pattern type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="stripes">Stripes</SelectItem>
                <SelectItem value="zigzag">Zigzag</SelectItem>
                <SelectItem value="noise">Noise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="size" className="text-gray-700 dark:text-gray-200">Size: {size}px</Label>
            <Slider
              id="size"
              min={10}
              max={100}
              step={1}
              value={[size]}
              onValueChange={(val) => setSize(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="density" className="text-gray-700 dark:text-gray-200">Density: {density}%</Label>
            <Slider
              id="density"
              min={10}
              max={100}
              step={1}
              value={[density]}
              onValueChange={(val) => setDensity(val[0])}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700 dark:text-gray-200 mb-2 block">Primary Color</Label>
              <HexColorPicker color={primaryColor} onChange={setPrimaryColor} className="w-full" />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-200 mb-2 block">Secondary Color</Label>
              <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} className="w-full" />
              <Input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div
            ref={patternRef}
            className="w-64 h-64 rounded-md shadow-inner overflow-hidden"
            style={{ ...generatePattern() as React.CSSProperties }}
          ></div>

          <div className="flex space-x-4">
            <Button
              onClick={() => downloadPattern('png')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200"
            >
              <Download className="h-5 w-5" />
              <span>Download PNG</span>
            </Button>
            <Button
              onClick={() => downloadPattern('svg')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200"
            >
              <Download className="h-5 w-5" />
              <span>Download SVG</span>
            </Button>
            <Button
              onClick={copyCssToClipboard}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              <Copy className="h-5 w-5" />
              <span>Copy CSS</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatternGenerator;