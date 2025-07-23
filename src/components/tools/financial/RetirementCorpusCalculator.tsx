'use client';

import React, { useState, useRef } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import { toast } from '@/components/ui/use-toast';
import { Save, RefreshCw, DollarSign, Image, Table } from 'lucide-react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePremium } from '@/hooks/usePremium';

export const RetirementCorpusCalculator: React.FC = () => {
  const { isPremium } = usePremium();
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [expectedRateOfReturn, setExpectedRateOfReturn] = useState('');
  const [result, setResult] = useState<any>(null);

  const chartRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

  const calculateCorpus = () => {
    const ca = parseFloat(currentAge);
    const ra = parseFloat(retirementAge);
    const ms = parseFloat(monthlySavings);
    const ror = parseFloat(expectedRateOfReturn);

    if (ca <= 0 || ra <= ca || ms <= 0 || ror <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please provide valid, positive values.',
        variant: 'destructive',
      });
      return;
    }

    const years = ra - ca;
    const months = years * 12;
    const monthlyRate = ror / 12 / 100;

    const chartData: any[] = [];
    let corpus = 0;

    for (let y = 1; y <= years; y++) {
      const yearMonths = y * 12;
      corpus = ms * ((Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      chartData.push({
        year: ca + y,
        corpus,
        monthlyContribution: ms * 12,
      });
    }

    setResult({
      chartData,
      finalCorpus: corpus,
    });
  };

  const clearForm = () => {
    setCurrentAge('');
    setRetirementAge('');
    setMonthlySavings('');
    setExpectedRateOfReturn('');
    setResult(null);
  };

  const exportCSV = () => {
    if (!result) return;
    const rows = result.chartData.map((row: any) =>
      `${row.year},${row.monthlyContribution},${row.corpus.toFixed(2)}`
    ).join('\n');
    const header = 'Your Age,Yearly Contribution ($),Total Corpus ($)\n';
    const summary = `Final Corpus: $${result.finalCorpus.toFixed(2)}\n\n`;
    saveAs(new Blob([summary + header + rows], { type: 'text/csv;charset=utf-8;' }), 'retirement_corpus.csv');
  };

  const exportChart = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current);
      canvas.toBlob((blob) => blob && saveAs(blob, 'retirement_corpus_chart.png'));
    } catch {
      toast({ title: 'Export Error', description: 'Could not save chart.', variant: 'destructive' });
    }
  };

  const getChartHeight = () => (isMobile ? 300 : isTablet ? 400 : 500);

  return (
    <Card className="w-full max-w-screen-xl mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2 justify-center">
          <DollarSign className="w-5 h-5" /> Retirement Corpus Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Current Age', value: currentAge, set: setCurrentAge, placeholder: 'e.g., 30' },
            { label: 'Retirement Age', value: retirementAge, set: setRetirementAge, placeholder: 'e.g., 60' },
            { label: 'Monthly Savings ($)', value: monthlySavings, set: setMonthlySavings, placeholder: 'e.g., 1000' },
            { label: 'Expected Return (%)', value: expectedRateOfReturn, set: setExpectedRateOfReturn, placeholder: 'e.g., 10' },
          ].map((field, i) => (
            <div key={i} className="grid gap-1">
              <Label>{field.label}</Label>
              <Input
                type="number"
                min="0"
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            { text: 'Calculate', icon: <DollarSign className="w-4 h-4" />, onClick: calculateCorpus, variant: 'default' },
            { text: 'Clear', icon: <RefreshCw className="w-4 h-4" />, onClick: clearForm, variant: 'outline' },
            ...(result && isPremium ? [
              { text: 'Export CSV', icon: <Save className="w-4 h-4" />, onClick: exportCSV, variant: 'secondary' },
              { text: 'Export Chart', icon: <Image className="w-4 h-4" />, onClick: exportChart, variant: 'secondary' },
            ] : []),
          ].map((btn, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <Button onClick={btn.onClick} variant={btn.variant as any} className="flex items-center gap-2">
                {btn.icon}
                {btn.text}
              </Button>
            </motion.div>
          ))}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center text-green-600 font-semibold text-lg sm:text-xl">
              Final Retirement Corpus: ${result.finalCorpus.toFixed(2)}
            </div>

            {isPremium ? (
              <>
                {/* Chart */}
                <div className="w-full" style={{ height: getChartHeight() }} ref={chartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.chartData} margin={{ top: 30, right: 30, left: 10, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                      <YAxis
                        tickFormatter={(v) =>
                          v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `$${(v / 1e3).toFixed(1)}K` : `$${v}`
                        }
                      />
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                      <Legend />
                      <Line type="monotone" dataKey="corpus" stroke="#00b300" strokeWidth={2} name="Corpus" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto text-xs sm:text-sm text-center border border-gray-300 rounded-lg shadow-sm dark:border-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-2 py-1">Year</th>
                        <th className="px-2 py-1">Yearly Contribution</th>
                        <th className="px-2 py-1">Corpus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.chartData.map((row: any, i: number) => (
                        <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="px-2 py-1">{row.year}</td>
                          <td className="px-2 py-1">${row.monthlyContribution.toFixed(2)}</td>
                          <td className="px-2 py-1">${row.corpus.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-md text-center">
                <p className="font-semibold">Unlock Charts and Detailed Table!</p>
                <p className="text-sm">Become a premium user to view detailed charts and the full breakdown table.</p>
              </div>
            )}

          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default RetirementCorpusCalculator;
