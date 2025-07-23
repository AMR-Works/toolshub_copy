import React, { useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Download, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const QRGenerator: React.FC = () => {
  const [value, setValue] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const { toast } = useToast();

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast({
        title: 'QR Code Downloaded',
        description: 'Your QR code has been successfully downloaded.',
      });
    }
  };

  const copyQRCodeAsSVG = () => {
    const svgElement = document.getElementById('qrcode-svg');
    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      navigator.clipboard.writeText(svgString).then(() => {
        toast({
          title: 'SVG Copied',
          description: 'QR Code SVG copied to clipboard.',
        });
      }).catch(() => {
        toast({
          title: 'Copy Failed',
          description: 'Failed to copy SVG to clipboard.',
          variant: 'destructive',
        });
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8 bg-white dark:bg-gray-950 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">QR Code Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Create scannable QR codes for links, contact info, Wi-Fi, and more. Customize size and colors, then download or copy as SVG.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="qr-value" className="text-gray-700 dark:text-gray-200">QR Code Content</Label>
            <Input
              id="qr-value"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter text or URL"
              className="mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-md w-full focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label htmlFor="qr-size" className="text-gray-700 dark:text-gray-200">Size: {size}px</Label>
            <Slider
              id="qr-size"
              min={64}
              max={512}
              step={16}
              value={[size]}
              onValueChange={(val) => setSize(val[0])}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700 dark:text-gray-200 mb-2 block">Foreground Color</Label>
              <HexColorPicker color={fgColor} onChange={setFgColor} className="w-full" />
              <Input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-200 mb-2 block">Background Color</Label>
              <HexColorPicker color={bgColor} onChange={setBgColor} className="w-full" />
              <Input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-6 rounded-md shadow-inner">
          {value ? (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-md shadow-lg">
              <QRCodeCanvas
              id="qrcode-canvas"
              value={value}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              className="block"
            />
            <QRCodeSVG
              id="qrcode-svg"
              value={value}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              className="hidden"
            />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Enter content to generate QR Code</p>
          )}

          <div className="mt-6 flex space-x-4">
            <Button
              onClick={downloadQRCode}
              disabled={!value}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200"
            >
              <Download className="h-5 w-5" />
              <span>Download PNG</span>
            </Button>
            <Button
              onClick={copyQRCodeAsSVG}
              disabled={!value}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              <Copy className="h-5 w-5" />
              <span>Copy SVG</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QRGenerator;