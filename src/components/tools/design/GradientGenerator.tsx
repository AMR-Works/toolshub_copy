import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Download, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GradientGenerator: React.FC = () => {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [colors, setColors] = useState<Array<{ color: string; position: number }>>([
    { color: '#FF0000', position: 0 },
    { color: '#0000FF', position: 100 },
  ]);
  const { toast } = useToast();

  const generateCss = () => {
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors.map(c => `${c.color} ${c.position}%`).join(', ');

    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${colorStops})`;
    } else {
      return `radial-gradient(circle, ${colorStops})`;
    }
  };

  const gradientStyle = {
    backgroundImage: generateCss(),
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index].color = newColor;
    setColors(newColors);
  };

  const handlePositionChange = (index: number, newPosition: number) => {
    const newColors = [...colors];
    newColors[index].position = newPosition;
    setColors(newColors);
  };

  const addColorStop = () => {
    if (colors.length < 5) {
      setColors([...colors, { color: '#CCCCCC', position: 50 }]);
    } else {
      toast({
        title: 'Limit Reached',
        description: 'Maximum 5 color stops allowed.',
        variant: 'destructive',
      });
    }
  };

  const removeColorStop = (index: number) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
    } else {
      toast({
        title: 'Limit Reached',
        description: 'Minimum 2 color stops required.',
        variant: 'destructive',
      });
    }
  };

  const copyCssToClipboard = () => {
    const css = `background-image: ${generateCss()};`;
    navigator.clipboard.writeText(css).then(() => {
      toast({
        title: 'CSS Copied',
        description: 'Gradient CSS copied to clipboard.',
      });
    }).catch(() => {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy CSS to clipboard.',
        variant: 'destructive',
      });
    });
  };

  const downloadGradient = () => {
    // This would typically require a canvas library like html2canvas or dom-to-image
    // For simplicity, we'll just toast a message for now.
    toast({
      title: 'Download Not Implemented',
      description: 'Image download functionality is not yet implemented for gradients.',
      variant: 'default',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8 bg-white dark:bg-gray-950 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">CSS Gradient Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Design linear or radial gradients with live preview and CSS export. Adjust colors, positions, and angles.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="gradient-type" className="text-gray-700 dark:text-gray-200">Gradient Type</Label>
            <Select value={gradientType} onValueChange={(value: 'linear' | 'radial') => setGradientType(value)}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select gradient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {gradientType === 'linear' && (
            <div>
              <Label htmlFor="angle" className="text-gray-700 dark:text-gray-200">Angle: {angle}°</Label>
              <Slider
                id="angle"
                min={0}
                max={360}
                step={1}
                value={[angle]}
                onValueChange={(val) => setAngle(val[0])}
                className="mt-2"
              />
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-gray-700 dark:text-gray-200">Color Stops</Label>
            {colors.map((colorStop, index) => (
              <div key={index} className="flex items-center space-x-2">
                <HexColorPicker
                  color={colorStop.color}
                  onChange={(newColor) => handleColorChange(index, newColor)}
                />
                <Input
                  type="text"
                  value={colorStop.color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-24 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                />
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[colorStop.position]}
                  onValueChange={(val) => handlePositionChange(index, val[0])}
                  className="flex-grow"
                />
                <span className="w-10 text-right dark:text-gray-200">{colorStop.position}%</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeColorStop(index)}
                  disabled={colors.length <= 2}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addColorStop} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Add Color Stop
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div
            className="w-full h-64 rounded-md shadow-inner transition-all duration-300 ease-in-out"
            style={gradientStyle}
          ></div>
          <div className="flex space-x-4">
            <Button
              onClick={copyCssToClipboard}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200"
            >
              <Copy className="h-5 w-5" />
              <span>Copy CSS</span>
            </Button>
            <Button
              onClick={downloadGradient}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              <Download className="h-5 w-5" />
              <span>Download PNG</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GradientGenerator;