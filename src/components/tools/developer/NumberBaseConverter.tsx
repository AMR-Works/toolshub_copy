import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type Base = '2' | '8' | '10' | '16';

const NumberBaseConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [inputBase, setInputBase] = useState<Base>('10');

  const convertNumber = useCallback((value: string, fromBase: Base, toBase: Base): string => {
    if (!value) return '';

    try {
      let decimalValue: number;
      if (fromBase === '10') {
        decimalValue = parseFloat(value);
        if (isNaN(decimalValue)) throw new Error('Invalid decimal number');
      } else {
        decimalValue = parseInt(value, parseInt(fromBase));
        if (isNaN(decimalValue)) throw new Error(`Invalid number for base ${fromBase}`);
      }

      if (toBase === '10') {
        return decimalValue.toString();
      } else {
        return decimalValue.toString(parseInt(toBase));
      }
    } catch (e: any) {
      toast.error(`Conversion Error: ${e.message}`);
      return 'Error';
    }
  }, []);

  const binaryOutput = useMemo(() => convertNumber(inputValue, inputBase, '2'), [inputValue, inputBase, convertNumber]);
  const octalOutput = useMemo(() => convertNumber(inputValue, inputBase, '8'), [inputValue, inputBase, convertNumber]);
  const decimalOutput = useMemo(() => convertNumber(inputValue, inputBase, '10'), [inputValue, inputBase, convertNumber]);
  const hexadecimalOutput = useMemo(() => convertNumber(inputValue, inputBase, '16'), [inputValue, inputBase, convertNumber]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Number Base Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="inputValue">Input Value</Label>
            <Input
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter number to convert"
              className="font-mono"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inputBase">Input Base</Label>
            <Select value={inputBase} onValueChange={(value: Base) => setInputBase(value)}>
              <SelectTrigger id="inputBase">
                <SelectValue placeholder="Select input base" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Binary (Base 2)</SelectItem>
                <SelectItem value="8">Octal (Base 8)</SelectItem>
                <SelectItem value="10">Decimal (Base 10)</SelectItem>
                <SelectItem value="16">Hexadecimal (Base 16)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Binary (Base 2)</Label>
            <Input value={binaryOutput} readOnly className="font-mono bg-muted" />
          </div>
          <div className="grid gap-2">
            <Label>Octal (Base 8)</Label>
            <Input value={octalOutput} readOnly className="font-mono bg-muted" />
          </div>
          <div className="grid gap-2">
            <Label>Decimal (Base 10)</Label>
            <Input value={decimalOutput} readOnly className="font-mono bg-muted" />
          </div>
          <div className="grid gap-2">
            <Label>Hexadecimal (Base 16)</Label>
            <Input value={hexadecimalOutput} readOnly className="font-mono bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NumberBaseConverter;