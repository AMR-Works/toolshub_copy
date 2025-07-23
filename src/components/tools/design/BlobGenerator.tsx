import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Copy, Download, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Function to generate SVG blob path data
const generateBlobPath = (complexity: number, contrast: number): string => {
  const numPoints = Math.floor(complexity * 5) + 5; // 5 to 10 points
  const angleStep = (Math.PI * 2) / numPoints;
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep;
    const minRadius = 50 - contrast * 20; // Adjust min radius based on contrast
    const maxRadius = 50 + contrast * 20; // Adjust max radius based on contrast
    const radius = minRadius + Math.random() * (maxRadius - minRadius);

    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    points.push({ x, y });
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];

    const midX1 = (p0.x + p1.x) / 2;
    const midY1 = (p0.y + p1.y) / 2;
    const midX2 = (p1.x + p2.x) / 2;
    const midY2 = (p1.y + p2.y) / 2;

    path += ` Q ${p1.x} ${p1.y} ${midX2} ${midY2}`;
  }
  path += ` Q ${points[points.length - 1].x} ${points[points.length - 1].y} ${(points[points.length - 1].x + points[0].x) / 2} ${(points[points.length - 1].y + points[0].y) / 2}`;
  path += ' Z';

  return path;
};

const BlobGenerator: React.FC = () => {
  const [complexity, setComplexity] = useState(0.5);
  const [contrast, setContrast] = useState(0.5);
  const [blobPath, setBlobPath] = useState('');
  const { toast } = useToast();

  const generateNewBlob = () => {
    setBlobPath(generateBlobPath(complexity, contrast));
  };

  useEffect(() => {
    generateNewBlob();
  }, [complexity, contrast]); // Regenerate on complexity/contrast change

  const copySvgToClipboard = () => {
    const svgContent = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="${blobPath}" fill="#3b82f6"/></svg>`;
    navigator.clipboard.writeText(svgContent).then(() => {
      toast({
        title: 'SVG Copied',
        description: 'Blob SVG copied to clipboard.',
      });
    }).catch(() => {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy SVG to clipboard.',
        variant: 'destructive',
      });
    });
  };

  const downloadSvg = () => {
    const svgContent = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="${blobPath}" fill="#3b82f6"/></svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blob.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'SVG Downloaded',
      description: 'Blob SVG downloaded successfully.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8 bg-white dark:bg-gray-950 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Blob Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Generate random organic blob shapes with adjustable complexity and contrast. Export to SVG for your designs.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="complexity" className="text-gray-700 dark:text-gray-200">Complexity: {complexity.toFixed(1)}</Label>
            <Slider
              id="complexity"
              min={0.1}
              max={1}
              step={0.1}
              value={[complexity]}
              onValueChange={(val) => setComplexity(val[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="contrast" className="text-gray-700 dark:text-gray-200">Contrast: {contrast.toFixed(1)}</Label>
            <Slider
              id="contrast"
              min={0.1}
              max={1}
              step={0.1}
              value={[contrast]}
              onValueChange={(val) => setContrast(val[0])}
              className="mt-2"
            />
          </div>

          <Button
            onClick={generateNewBlob}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <Shuffle className="h-5 w-5" />
            <span>Randomize Blob</span>
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d={blobPath} fill="#3b82f6" className="transition-all duration-300 ease-in-out" />
            </svg>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={copySvgToClipboard}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200"
            >
              <Copy className="h-5 w-5" />
              <span>Copy SVG</span>
            </Button>
            <Button
              onClick={downloadSvg}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              <Download className="h-5 w-5" />
              <span>Download SVG</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlobGenerator;