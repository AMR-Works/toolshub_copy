import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SpacingGridGenerator: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState(1200);
  const [columnCount, setColumnCount] = useState(12);
  const [gutterWidth, setGutterWidth] = useState(20);
  const [padding, setPadding] = useState(20);
  const [unit, setUnit] = useState<'px' | 'rem'>('px');
  const { toast } = useToast();

  const columnWidth = (containerWidth - (columnCount - 1) * gutterWidth - 2 * padding) / columnCount;

  const generateCss = () => {
    const cssUnit = unit === 'px' ? 'px' : 'rem';
    return `
      .container {
        width: ${containerWidth}${cssUnit};
        padding: 0 ${padding}${cssUnit};
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(${columnCount}, 1fr);
        gap: ${gutterWidth}${cssUnit};
      }
      .column {
        /* Column width calculation: (containerWidth - (columnCount - 1) * gutterWidth - 2 * padding) / columnCount */
        /* This is handled by 'grid-template-columns: repeat(..., 1fr)' */
      }
    `;
  };

  const copyCssToClipboard = () => {
    const css = generateCss();
    navigator.clipboard.writeText(css).then(() => {
      toast({
        title: 'CSS Copied',
        description: 'Grid CSS copied to clipboard.',
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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Spacing & Grid Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Create responsive layout spacing, columns, and gutters. Visualize your grid and get instant CSS output.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="container-width" className="text-gray-700 dark:text-gray-200">Container Width: {containerWidth}{unit}</Label>
            <Slider
              id="container-width"
              min={320}
              max={1920}
              step={10}
              value={[containerWidth]}
              onValueChange={(val) => setContainerWidth(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="column-count" className="text-gray-700 dark:text-gray-200">Column Count: {columnCount}</Label>
            <Slider
              id="column-count"
              min={1}
              max={24}
              step={1}
              value={[columnCount]}
              onValueChange={(val) => setColumnCount(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="gutter-width" className="text-gray-700 dark:text-gray-200">Gutter Width: {gutterWidth}{unit}</Label>
            <Slider
              id="gutter-width"
              min={0}
              max={50}
              step={1}
              value={[gutterWidth]}
              onValueChange={(val) => setGutterWidth(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="padding" className="text-gray-700 dark:text-gray-200">Padding: {padding}{unit}</Label>
            <Slider
              id="padding"
              min={0}
              max={50}
              step={1}
              value={[padding]}
              onValueChange={(val) => setPadding(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="unit" className="text-gray-700 dark:text-gray-200">Unit</Label>
            <Select value={unit} onValueChange={(value: 'px' | 'rem') => setUnit(value)}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">px</SelectItem>
                <SelectItem value="rem">rem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner"
            style={{
              width: `${containerWidth}${unit}`,
              padding: `0 ${padding}${unit}`,
            }}
          >
            <div
              className="grid border border-dashed border-gray-400 dark:border-gray-600"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                gap: `${gutterWidth}${unit}`,
              }}
            >
              {Array.from({ length: columnCount }).map((_, i) => (
                <div key={i} className="bg-blue-300 dark:bg-blue-600 h-16 flex items-center justify-center text-sm text-white">
                  Col {i + 1}
                </div>
              ))}
            </div>
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

export default SpacingGridGenerator;