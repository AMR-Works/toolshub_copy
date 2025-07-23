import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Shuffle, Lock, LockOpen, Copy, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import chroma from 'chroma-js';

interface ColorBoxProps {
  color: string;
  isLocked: boolean;
  onToggleLock: () => void;
  onColorChange: (newColor: string) => void;
  onCopy: (color: string) => void;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color, isLocked, onToggleLock, onColorChange, onCopy }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col items-center justify-center p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out"
      style={{ backgroundColor: color }}
    >
      <div className="absolute top-2 right-2 flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleLock}
          className="text-white hover:bg-white/20"
        >
          {isLocked ? <Lock size={18} /> : <LockOpen size={18} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCopy(color)}
          className="text-white hover:bg-white/20"
        >
          <Copy size={18} />
        </Button>
      </div>
      <span className="mt-12 text-white text-sm font-mono uppercase drop-shadow-lg">
        {color}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPicker(!showPicker)}
        className="mt-2 text-white hover:bg-white/20"
      >
        {showPicker ? 'Close Picker' : 'Change Color'}
      </Button>
      {showPicker && (
        <div className="absolute z-10 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <HexColorPicker color={color} onChange={onColorChange} />
        </div>
      )}
    </motion.div>
  );
};

const ColorPaletteGenerator: React.FC = () => {
  const [colors, setColors] = useState<string[]>(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF']);
  const [lockedColors, setLockedColors] = useState<boolean[]>(new Array(colors.length).fill(false));
  const [numColors, setNumColors] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    if (numColors > colors.length) {
      const newColors = [...colors];
      for (let i = colors.length; i < numColors; i++) {
        newColors.push(chroma.random().hex());
      }
      setColors(newColors);
      setLockedColors(prev => [...prev, ...new Array(numColors - prev.length).fill(false)]);
    } else if (numColors < colors.length) {
      setColors(colors.slice(0, numColors));
      setLockedColors(lockedColors.slice(0, numColors));
    }
  }, [numColors, colors, lockedColors]);

  const generateRandomPalette = () => {
    const newColors = colors.map((color, index) =>
      lockedColors[index] ? color : chroma.random().hex()
    );
    setColors(newColors);
    toast({
      title: 'Palette Generated',
      description: 'New random colors have been generated.',
    });
  };

  const toggleLock = (index: number) => {
    const newLockedColors = [...lockedColors];
    newLockedColors[index] = !newLockedColors[index];
    setLockedColors(newLockedColors);
    toast({
      title: newLockedColors[index] ? 'Color Locked' : 'Color Unlocked',
      description: `Color ${colors[index]} is now ${newLockedColors[index] ? 'locked' : 'unlocked'}.`,
    });
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor.toUpperCase();
    setColors(newColors);
  };

  const copyColorToClipboard = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      toast({
        title: 'Color Copied',
        description: `${color} copied to clipboard.`, 
      });
    }).catch(() => {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy color to clipboard.',
        variant: 'destructive',
      });
    });
  };

  const exportPaletteAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(colors, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "color_palette.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({
      title: 'Palette Exported',
      description: 'Color palette exported as JSON.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8 bg-white dark:bg-gray-950 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Color Palette Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Build, shuffle, copy, and export beautiful color schemes. Lock colors you like and generate new ones for the rest.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="num-colors" className="text-gray-700 dark:text-gray-200">Number of Colors: {numColors}</Label>
            <Slider
              id="num-colors"
              min={2}
              max={10}
              step={1}
              value={[numColors]}
              onValueChange={(val) => setNumColors(val[0])}
              className="mt-2"
            />
          </div>

          <Button
            onClick={generateRandomPalette}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <Shuffle className="h-5 w-5" />
            <span>Generate New Palette</span>
          </Button>

          <Button
            onClick={exportPaletteAsJSON}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200 dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            <Download className="h-5 w-5" />
            <span>Export as JSON</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {colors.map((color, index) => (
            <ColorBox
              key={index}
              color={color}
              isLocked={lockedColors[index]}
              onToggleLock={() => toggleLock(index)}
              onColorChange={(newColor) => handleColorChange(index, newColor)}
              onCopy={copyColorToClipboard}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ColorPaletteGenerator;