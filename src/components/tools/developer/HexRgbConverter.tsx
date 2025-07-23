import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const HexRgbConverter: React.FC = () => {
  const [hexInput, setHexInput] = useState<string>('');
  const [rgbInput, setRgbInput] = useState<string>('');
  const [hexOutput, setHexOutput] = useState<string>('');
  const [rgbOutput, setRgbOutput] = useState<string>('');

  const hexToRgb = useCallback((hex: string): string => {
    const hexValue = hex.startsWith('#') ? hex.slice(1) : hex;
    if (!/^[0-9A-Fa-f]{6}$/.test(hexValue)) {
      throw new Error('Invalid HEX color format. Use 6 hexadecimal characters.');
    }
    const r = parseInt(hexValue.substring(0, 2), 16);
    const g = parseInt(hexValue.substring(2, 4), 16);
    const b = parseInt(hexValue.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  const rgbToHex = useCallback((rgb: string): string => {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
      throw new Error('Invalid RGB color format. Use rgb(R, G, B).');
    }
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error('RGB values must be between 0 and 255.');
    }

    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);

  const handleHexConvert = useCallback(() => {
    try {
      setRgbOutput(hexToRgb(hexInput));
      toast.success('HEX converted to RGB!');
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
      setRgbOutput('');
    }
  }, [hexInput, hexToRgb]);

  const handleRgbConvert = useCallback(() => {
    try {
      setHexOutput(rgbToHex(rgbInput));
      toast.success('RGB converted to HEX!');
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
      setHexOutput('');
    }
  }, [rgbInput, rgbToHex]);

  const clearFields = useCallback(() => {
    setHexInput('');
    setRgbInput('');
    setHexOutput('');
    setRgbOutput('');
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>HEX ↔ RGB Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div>
            <Label htmlFor="hexInput" className="mb-2 block">HEX to RGB</Label>
            <div className="flex space-x-2">
              <Input
                id="hexInput"
                placeholder="e.g., #FF0000 or FF0000"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                className="font-mono"
              />
              <Button onClick={handleHexConvert}>Convert</Button>
            </div>
            <Input value={rgbOutput} readOnly className="font-mono bg-muted mt-2" placeholder="RGB Output" />
          </div>

          <div>
            <Label htmlFor="rgbInput" className="mb-2 block">RGB to HEX</Label>
            <div className="flex space-x-2">
              <Input
                id="rgbInput"
                placeholder="e.g., rgb(255, 0, 0)"
                value={rgbInput}
                onChange={(e) => setRgbInput(e.target.value)}
                className="font-mono"
              />
              <Button onClick={handleRgbConvert}>Convert</Button>
            </div>
            <Input value={hexOutput} readOnly className="font-mono bg-muted mt-2" placeholder="HEX Output" />
          </div>

          <Button variant="outline" onClick={clearFields} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" /> Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HexRgbConverter;