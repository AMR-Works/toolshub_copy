import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Save, BarChart3, RefreshCw, Image, Lock } from 'lucide-react';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePremium } from '@/hooks/usePremium';

export const SimpleInterestCalculator: React.FC = () => {
  const { isPremium } = usePremium();
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<any>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery('(max-width: 640px)');

  const calculateInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (p <= 0 || r <= 0 || t <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid positive values.',
        variant: 'destructive',
      });
      return;
    }

    const interest = (p * r * t) / 100;
    const totalAmount = p + interest;

    const chartData = [];
    for (let i = 1; i <= t; i++) {
      const yearInterest = (p * r * i) / 100;
      chartData.push({
        year: i,
        amount: p + yearInterest,
        interest: yearInterest,
      });
    }

    setResult({ interest, totalAmount, chartData });
  };

  const clearInputs = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setResult(null);
  };

  const exportCSV = () => {
    if (!result) return;
    const headers = 'Year,Total Amount ($),Interest ($)\n';
    const rows = result.chartData
      .map((row: any) => `${row.year},${row.amount.toFixed(2)},${row.interest.toFixed(2)}`)
      .join('\n');
    const summary = `Total Interest: $${result.interest.toFixed(2)} | Total Amount: $${result.totalAmount.toFixed(2)}\n\n`;
    saveAs(new Blob([summary + headers + rows], { type: 'text/csv;charset=utf-8;' }), 'simple_interest.csv');
  };

  const exportChartAsImage = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current);
      canvas.toBlob((blob) => blob && saveAs(blob, 'simple_interest_chart.png'));
    } catch (error) {
      toast({
        title: 'Export Error',
        description: 'Failed to export chart.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-screen-md mx-auto px-2 sm:px-4 py-4">
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2 justify-center">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          Simple Interest Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[{ label: 'Principal ($)', value: principal, onChange: setPrincipal, placeholder: 'e.g., 1000' },
            { label: 'Rate (%)', value: rate, onChange: setRate, placeholder: 'e.g., 5' },
            { label: 'Time (years)', value: time, onChange: setTime, placeholder: 'e.g., 2' }
          ].map((input, i) => (
            <div key={i} className="grid gap-1 sm:gap-2">
              <Label className="text-sm sm:text-base">{input.label}</Label>
              <Input
                type="number"
                min="0"
                value={input.value}
                onChange={(e) => input.onChange(e.target.value)}
                placeholder={input.placeholder}
                className="text-sm sm:text-base"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <Button onClick={calculateInterest} variant="default" className="flex items-center gap-2 text-sm px-3 py-2">
            <BarChart3 className="w-4 h-4" /> Calculate
          </Button>
          <Button onClick={clearInputs} variant="outline" className="flex items-center gap-2 text-sm px-3 py-2">
            <RefreshCw className="w-4 h-4" /> Clear
          </Button>
          {result && (
            <>
              <Button
                onClick={isPremium ? exportCSV : () => toast({ title: 'Premium Feature', description: 'Upgrade to premium to export CSV.', variant: 'default' })}
                variant="secondary"
                className="flex items-center gap-2 text-sm px-3 py-2"
              >
                {isPremium ? <Save className="w-4 h-4" /> : <Lock className="w-4 h-4" />} Export CSV
              </Button>
              <Button
                onClick={isPremium ? exportChartAsImage : () => toast({ title: 'Premium Feature', description: 'Upgrade to premium to export chart.', variant: 'default' })}
                variant="secondary"
                className="flex items-center gap-2 text-sm px-3 py-2"
              >
                {isPremium ? <Image className="w-4 h-4" /> : <Lock className="w-4 h-4" />} Export Chart
              </Button>
            </>
          )}
        </div>

        {result && (
          <>
            {/* Always visible basic result */}
            <div className="text-center font-bold p-3 sm:p-4 bg-blue-100 border border-blue-300 rounded-lg shadow-sm dark:bg-blue-900 dark:text-white">
              <div className="text-base sm:text-xl">
                Interest: ${result.interest.toFixed(2)} | Total Amount: ${result.totalAmount.toFixed(2)}
              </div>
            </div>

            {/* Premium-only chart and table */}
            {isPremium ? (
              <>
                <div className="w-full relative" style={{ height: isMobile ? 300 : 400 }} ref={chartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.chartData} margin={{ top: 40, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Time (years)', position: 'insideBottom', offset: -10 }} />
                      <YAxis tickFormatter={(tick) => `$${tick}`} />
                      <Tooltip formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]} />
                      <Legend verticalAlign="top" height={36} />
                      <Line type="monotone" dataKey="amount" stroke="#007bff" name="Total Amount" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="interest" stroke="#00b300" name="Interest" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto text-xs sm:text-sm text-center border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 mt-4">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        {['Year', 'Interest ($)', 'Total Amount ($)'].map((header) => (
                          <th key={header} className="px-2 py-1">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.chartData.map((row: any, index: number) => (
                        <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="px-2 py-1">{row.year}</td>
                          <td className="px-2 py-1 text-green-700 dark:text-green-400">${row.interest.toFixed(2)}</td>
                          <td className="px-2 py-1 font-medium">${row.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center font-bold p-3 sm:p-4 bg-yellow-200 border border-yellow-300 rounded-lg shadow-sm dark:bg-yellow-700 dark:text-white mt-4"
              >
                Upgrade to Premium to view chart and detailed breakdown!
              </motion.div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleInterestCalculator;
