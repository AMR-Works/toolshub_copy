import React, { useState, useRef } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Save, BarChart3, DollarSign, RefreshCw, Image, Lock } from 'lucide-react';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { toast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePremium } from '@/hooks/usePremium';

export const InvestmentReturnCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<any>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { isPremium } = usePremium();

  const calculateInvestment = () => {
    const mi = parseFloat(monthlyInvestment);
    const rate = parseFloat(interestRate);
    const yr = parseFloat(years);

    if (mi <= 0 || rate <= 0 || yr <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid positive values.',
        variant: 'destructive',
      });
      return;
    }

    const r = rate / 100 / 12;
    const n = yr * 12;
    const fv = mi * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

    const chartData = [];
    let totalInvested = 0;
    for (let i = 1; i <= n; i++) {
      totalInvested += mi;
      const monthFV = mi * (((Math.pow(1 + r, i) - 1) / r) * (1 + r));
      chartData.push({
        month: i,
        invested: totalInvested,
        value: monthFV,
        gain: monthFV - totalInvested
      });
    }

    setResult({
      futureValue: fv,
      totalInvested,
      totalGain: fv - totalInvested,
      chartData
    });
  };

  const clearInputs = () => {
    setMonthlyInvestment('');
    setInterestRate('');
    setYears('');
    setResult(null);
  };

  const exportChartAsImage = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current);
      canvas.toBlob((blob) => blob && saveAs(blob, 'investment_growth_chart.png'));
    } catch {
      toast({ title: 'Export Error', description: 'Failed to export chart.', variant: 'destructive' });
    }
  };

  const exportCSV = () => {
    if (!result) return;
    const headers = 'Month,Invested ($),Future Value ($),Gain ($)\n';
    const rows = result.chartData.map((row: any) =>
      `${row.month},${row.invested.toFixed(2)},${row.value.toFixed(2)},${row.gain.toFixed(2)}`
    ).join('\n');
    const summary = `Final Value: $${result.futureValue.toFixed(2)}\nTotal Invested: $${result.totalInvested.toFixed(2)}\nGain: $${result.totalGain.toFixed(2)}\n\n`;
    saveAs(new Blob([summary + headers + rows], { type: 'text/csv;charset=utf-8;' }), 'investment_growth.csv');
  };

  return (
    <Card className="w-full max-w-screen-lg mx-auto px-4 py-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-center text-xl sm:text-2xl">
          <BarChart3 className="w-5 h-5" /> Investment Return Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[{
            label: 'Monthly Investment ($)',
            value: monthlyInvestment,
            onChange: setMonthlyInvestment,
            placeholder: 'e.g., 1000'
          }, {
            label: 'Annual Interest Rate (%)',
            value: interestRate,
            onChange: setInterestRate,
            placeholder: 'e.g., 8'
          }, {
            label: 'Investment Duration (Years)',
            value: years,
            onChange: setYears,
            placeholder: 'e.g., 10'
          }].map((field, i) => (
            <div key={i} className="grid gap-1">
              <Label>{field.label}</Label>
              <Input
                type="number"
                min="0"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {[
            {
              text: 'Calculate',
              icon: <DollarSign className="w-4 h-4" />,
              onClick: calculateInvestment
            },
            {
              text: 'Clear',
              icon: <RefreshCw className="w-4 h-4" />,
              onClick: clearInputs
            },
            ...(result
              ? [
                  {
                    text: 'Export CSV',
                    icon: isPremium ? <Save className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
                    onClick: isPremium
                      ? exportCSV
                      : () =>
                          toast({
                            title: 'Premium Feature',
                            description: 'Upgrade to premium to unlock this feature.',
                            variant: 'default'
                          })
                  },
                  {
                    text: 'Export Chart',
                    icon: isPremium ? <Image className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
                    onClick: isPremium
                      ? exportChartAsImage
                      : () =>
                          toast({
                            title: 'Premium Feature',
                            description: 'Upgrade to premium to unlock this feature.',
                            variant: 'default'
                          })
                  }
                ]
              : [])
          ].map((btn, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <Button onClick={btn.onClick} className="flex items-center gap-2">
                {btn.icon} {btn.text}
              </Button>
            </motion.div>
          ))}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Summary */}
            <div className="text-center font-bold bg-green-200 text-green-900 border border-green-300 p-4 rounded-md">
              <p>Final Value: ${result.futureValue.toFixed(2)}</p>
              <p>Total Invested: ${result.totalInvested.toFixed(2)}</p>
              <p>Gain: ${result.totalGain.toFixed(2)}</p>
            </div>

            {/* Chart with Locked Overlay */}
            <div className="relative" style={{ height: isMobile ? 300 : 400 }}>
              <div ref={chartRef} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      tickFormatter={(v) => `$${v.toFixed(0)}`}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="invested"
                      stroke="#8884d8"
                      name="Invested"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00b300"
                      name="Value"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="gain"
                      stroke="#ff3131"
                      name="Gain"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {!isPremium && (
              <div
              onClick={() =>
                toast({
                  title: 'Premium Feature',
                  description: 'Upgrade to premium to unlock chart viewing.',
                  variant: 'default',
                })
              }
              className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer rounded-md bg-white/20 backdrop-blur-sm"
            >
              <Lock className="w-10 h-10 mb-2 text-gray-800" />
              <p className="text-sm font-semibold text-gray-800">Premium Members Only</p>
            </div>

              )}
            </div>


            {/* Table or Lock Notice */}
            {isPremium ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm text-center border border-gray-300 rounded-lg shadow-sm mt-4">
                  <thead className="bg-gray-100">
                    <tr>
                      {['Month', 'Invested ($)', 'Future Value ($)', 'Gain ($)'].map((header) => (
                        <th key={header} className="px-2 py-2">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.chartData.map((row: any, i: number) => (
                      <tr key={i} className="border-t border-gray-200">
                        <td className="px-2 py-1">{row.month}</td>
                        <td className="px-2 py-1">${row.invested.toFixed(2)}</td>
                        <td className="px-2 py-1">${row.value.toFixed(2)}</td>
                        <td className={`px-2 py-1 ${row.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${row.gain.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center font-bold p-3 sm:p-4 bg-yellow-200 border border-yellow-300 rounded-lg shadow-sm dark:bg-yellow-700 dark:text-white mt-4"
              >
                Upgrade to Premium to view detailed results!
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentReturnCalculator;
