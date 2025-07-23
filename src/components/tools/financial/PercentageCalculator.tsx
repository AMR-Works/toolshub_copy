import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw, Percent, Lock } from 'lucide-react';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePremium } from '@/hooks/usePremium';
import { toast } from '@/components/ui/use-toast';

interface HistoryItem {
  type: string;
  desc: string;
  result: string;
}

export const PercentageCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<{ [key: string]: number | '' }>({
    value1: '',
    value2: '',
    oldValue: '',
    newValue: '',
    base: '',
    percent: '',
  });
  const [result, setResult] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { isPremium } = usePremium();

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value),
    }));
  };

  const updateResult = (desc: string, res: number) => {
    const formatted = res.toFixed(2);
    setDescription(desc);
    setResult(formatted);
    setHistory((prev) => [
      { type: desc, desc, result: formatted },
      ...prev.slice(0, 4),
    ]);
  };

  const calculate = (type: string) => {
    const { value1, value2, oldValue, newValue, base, percent } = inputs;
    let desc = '';
    let res: number | null = null;

    switch (type) {
      case 'percentageOf':
        if (typeof value1 === 'number' && typeof value2 === 'number') {
          res = (value1 / 100) * value2;
          desc = `${value1}% of ${value2}`;
        }
        break;
      case 'whatPercent':
        if (typeof value1 === 'number' && typeof value2 === 'number' && value2 !== 0) {
          res = (value1 / value2) * 100;
          desc = `${value1} is what % of ${value2}`;
        }
        break;
      case 'valueFromPercent':
        if (typeof value1 === 'number' && typeof value2 === 'number' && value2 !== 0) {
          res = (value1 / value2) * 100;
          desc = `${value1} is ${value2}% of what?`;
        }
        break;
      case 'percentChange':
        if (typeof oldValue === 'number' && typeof newValue === 'number' && oldValue !== 0) {
          const change = newValue - oldValue;
          res = (change / oldValue) * 100;
          desc = `${newValue > oldValue ? 'Increase' : 'Decrease'} from ${oldValue} to ${newValue}`;
        }
        break;
      case 'finalValueAfterIncrease':
        if (typeof base === 'number' && typeof percent === 'number') {
          res = base * (1 + percent / 100);
          desc = `Increase ${base} by ${percent}%`;
        }
        break;
      case 'finalValueAfterDecrease':
        if (typeof base === 'number' && typeof percent === 'number') {
          res = base * (1 - percent / 100);
          desc = `Decrease ${base} by ${percent}%`;
        }
        break;
    }

    if (res !== null) updateResult(desc, res);
    else {
      setResult('');
      setDescription('');
    }
  };

  const clearAll = () => {
    setInputs({
      value1: '',
      value2: '',
      oldValue: '',
      newValue: '',
      base: '',
      percent: '',
    });
    setResult('');
    setDescription('');
  };

  const exportAsText = () => {
    if (!result || !description) return;
    const text = `${description}\nResult: ${result}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    saveAs(blob, 'percentage_result.txt');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto px-4 py-6">
      <CardHeader className="text-center">
        <CardTitle className="text-lg sm:text-xl flex items-center justify-center gap-2">
          <Percent className="w-5 h-5" /> Advanced Percentage Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 gap-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="change">Change</TabsTrigger>
            <TabsTrigger value="adjusted">Adjust</TabsTrigger>
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>Value 1</Label>
                <Input type="number" value={inputs.value1} onChange={(e) => handleInputChange('value1', e.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label>Value 2</Label>
                <Input type="number" value={inputs.value2} onChange={(e) => handleInputChange('value2', e.target.value)} />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Button onClick={() => calculate('percentageOf')}>What is Value1% of Value2?</Button>
              <Button onClick={() => calculate('whatPercent')}>Value1 is what % of Value2?</Button>
              <Button onClick={() => calculate('valueFromPercent')}>Value1 is Value2% of what?</Button>
            </div>
          </TabsContent>

          {/* Change Tab */}
          <TabsContent value="change">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>Old Value</Label>
                <Input type="number" value={inputs.oldValue} onChange={(e) => handleInputChange('oldValue', e.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label>New Value</Label>
                <Input type="number" value={inputs.newValue} onChange={(e) => handleInputChange('newValue', e.target.value)} />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={() => calculate('percentChange')}>Calculate % Change</Button>
            </div>
          </TabsContent>

          {/* Adjust Tab */}
          <TabsContent value="adjusted">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label>Base Value</Label>
              <Input type="number" value={inputs.base} onChange={(e) => handleInputChange('base', e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Percentage</Label>
              <Input type="number" value={inputs.percent} onChange={(e) => handleInputChange('percent', e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button
              onClick={isPremium ? () => calculate('finalValueAfterIncrease') : undefined}
              disabled={!isPremium}
              variant={isPremium ? 'default' : 'secondary'}
            >
              Increase Value
            </Button>
            <Button
              onClick={isPremium ? () => calculate('finalValueAfterDecrease') : undefined}
              disabled={!isPremium}
              variant={isPremium ? 'default' : 'secondary'}
            >
              Decrease Value
            </Button>
          </div>
          {!isPremium && (
            <p className="text-sm text-center text-muted-foreground mt-2">Upgrade to access adjustment calculations.</p>
          )}
        </TabsContent>
        </Tabs>

        {/* Result Block */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center p-3 bg-green-100 border border-green-300 rounded-md shadow-sm"
          >
            <p className="text-sm sm:text-base">
              <strong>{description}</strong><br />Result: {result}
            </p>
          </motion.div>
        )}


        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={clearAll} variant="outline">
            <RefreshCw className="w-4 h-4 mr-1" /> Clear
          </Button>
          <Button
            onClick={isPremium ? exportAsText : () => toast({ title: 'Premium Feature', description: 'Upgrade to premium to unlock this feature.', variant: 'default' })}
            variant="secondary"
          >
            {isPremium ? <Save className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />} Export Result
          </Button>
        </div>

        {/* History */}
        {history.length > 0 && isPremium && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">🕒 Last 5 Calculations</h3>
            <ul className="text-xs sm:text-sm list-disc list-inside space-y-1">
              {history.map((item, i) => (
                <li key={i}><strong>{item.desc}</strong>: {item.result}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PercentageCalculator;
