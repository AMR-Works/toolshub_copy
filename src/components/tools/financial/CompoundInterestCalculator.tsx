import React, { useState, useRef } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Save, BarChart3, DollarSign, RefreshCw, Image, Lock, FileText } from 'lucide-react';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { toast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePremium } from '../../../hooks/usePremium';
import jsPDF from 'jspdf';

interface ResultData {
  amount: number;
  totalInterest: number;
  principal: number;
  chartData: any[];
  finalYear: number;
}

const CompoundInterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [timesCompounded, setTimesCompounded] = useState('');
  const [years, setYears] = useState('');
  const [currency, setCurrency] = useState('$');
  const [chartColorValue, setChartColorValue] = useState('#00b300');
  const [chartColorGain, setChartColorGain] = useState('#ff3131');
  const [result, setResult] = useState<ResultData | null>(null);
  
  const chartRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const { isPremium } = usePremium();

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(timesCompounded);
    const t = parseFloat(years);

    if (p <= 0 || r <= 0 || n <= 0 || t <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid positive values.',
        variant: 'destructive',
      });
      return;
    }

    const amount = p * Math.pow(1 + r / n, n * t);
    const totalInterest = amount - p;

    const chartData = [];
    for (let i = 1; i <= t * n; i++) {
      const year = i / n;
      const val = p * Math.pow(1 + r / n, i);
      chartData.push({
        period: year.toFixed(2),
        value: val,
        gain: val - p
      });
    }

    setResult({ 
      amount, 
      totalInterest, 
      principal: p, 
      chartData,
      finalYear: t
    });
  };

  const clearInputs = () => {
    setPrincipal('');
    setRate('');
    setTimesCompounded('');
    setYears('');
    setResult(null);
  };

  const exportChartAsImage = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current);
      canvas.toBlob((blob) => blob && saveAs(blob, 'compound_interest_chart.png'));
    } catch {
      toast({ title: 'Export Error', description: 'Failed to export chart.', variant: 'destructive' });
    }
  };

  const exportCSV = () => {
    if (!result) return;
    const headers = 'Period,Future Value,Gain\n';
    const rows = result.chartData.map((row: any) =>
      `${row.period},${currency}${row.value.toFixed(2)},${currency}${row.gain.toFixed(2)}`
    ).join('\n');
    const summary = `Final Amount: ${currency}${result.amount.toFixed(2)}\nTotal Interest: ${currency}${result.totalInterest.toFixed(2)}\nPrincipal: ${currency}${result.principal.toFixed(2)}\n\n`;
    saveAs(new Blob([summary + headers + rows], { type: 'text/csv;charset=utf-8;' }), 'compound_interest.csv');
  };

  const exportPDF = async () => {
    if (!chartRef.current || !result) return;
    try {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.text('Compound Interest Report', 10, 10);
      pdf.text(`Final Amount: ${currency}${result.amount.toFixed(2)}`, 10, 20);
      pdf.text(`Total Interest: ${currency}${result.totalInterest.toFixed(2)}`, 10, 30);
      pdf.text(`Principal: ${currency}${result.principal.toFixed(2)}`, 10, 40);
      pdf.addImage(imgData, 'PNG', 10, 50, 180, 100);
      pdf.save('compound_interest_report.pdf');
    } catch (error) {
      toast({ title: 'PDF Export Failed', description: 'Try again later.', variant: 'destructive' });
    }
  };

  const formatYAxis = (tick: number) => {
    if (tick >= 1_000_000_000) return `${currency}${(tick / 1_000_000_000).toFixed(1)}B`;
    if (tick >= 1_000_000) return `${currency}${(tick / 1_000_000).toFixed(1)}M`;
    if (tick >= 1_000) return `${currency}${(tick / 1_000).toFixed(1)}K`;
    return `${currency}${tick}`;
  };

  const getChartHeight = () => {
    if (isMobile) return 350;
    if (isTablet) return 400;
    return 500;
  };

  const getMargins = () => ({
    top: isMobile ? 30 : 70,
    right: isMobile ? 10 : 30,
    left: isMobile ? 10 : 30,
    bottom: isMobile ? 70 : 50
  });

  const buttons = [
    {
      text: "Calculate",
      icon: <DollarSign className="w-4 h-4" />,
      onClick: calculateCompoundInterest,
      variant: "default" as const
    },
    {
      text: "Clear",
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: clearInputs,
      variant: "outline" as const
    },
    {
      text: "Export CSV",
      icon: isPremium ? <Save className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
      onClick: isPremium ? exportCSV : () => toast({
        title: 'Premium Feature',
        description: 'Upgrade to premium to unlock this feature.',
        variant: 'default'
      }),
      variant: "secondary" as const
    },
    {
      text: "Export Image",
      icon: isPremium ? <Image className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
      onClick: isPremium ? exportChartAsImage : () => toast({
        title: 'Premium Feature',
        description: 'Upgrade to premium to unlock this feature.',
        variant: 'default'
      }),
      variant: "secondary" as const
    },
    {
      text: "Export PDF",
      icon: isPremium ? <FileText className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
      onClick: isPremium ? exportPDF : () => toast({
        title: 'Premium Feature',
        description: 'Upgrade to premium to unlock this feature.',
        variant: 'default'
      }),
      variant: "secondary" as const
    }
  ];

  return (
    <Card className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 py-4">
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2 justify-center">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          Compound Interest Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {[
            { label: `Principal (${currency})`, value: principal, onChange: setPrincipal, placeholder: "e.g., 10000" },
            { label: "Annual Interest Rate (%)", value: rate, onChange: setRate, placeholder: "e.g., 7" },
            { label: "Compounded Per Year", value: timesCompounded, onChange: setTimesCompounded, placeholder: "e.g., 12" },
            { label: "Years", value: years, onChange: setYears, placeholder: "e.g., 10" }
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
          <div className="grid gap-1 sm:gap-2">
            <Label className="text-sm sm:text-base">Currency</Label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)} 
              className="w-full p-2 border rounded"
            >
              {['$', '€', '£', '¥', '₹', 'A$', 'C$', 'CHF', 'kr', 'NZ$'].map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Value Color</Label>
            <input type="color" value={chartColorValue} onChange={(e) => setChartColorValue(e.target.value)} className="w-full h-9 rounded" />
          </div>
          <div>
            <Label>Gain Color</Label>
            <input type="color" value={chartColorGain} onChange={(e) => setChartColorGain(e.target.value)} className="w-full h-9 rounded" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
          {buttons.map((button, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <Button
                onClick={button.onClick}
                variant={button.variant}
                className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isMobile ? 'px-2 py-1' : 'px-4 py-2'}`}
              >
                {button.icon}
                {button.text}
              </Button>
            </motion.div>
          ))}
        </div>

        {result && (
          <>
            {/* Basic results visible to all users */}
            <div className="text-center font-bold p-3 sm:p-4 bg-green-100 border border-green-300 rounded-lg shadow-sm">
              <div className="text-base sm:text-xl">
                Final Amount: {currency}{result.amount.toFixed(2)}
              </div>
              <div className="text-base sm:text-xl mt-1">
                Total Interest: {currency}{result.totalInterest.toFixed(2)}
              </div>
              <div className="text-sm sm:text-lg mt-2">
                Principal: {currency}{result.principal.toFixed(2)}
              </div>
            </div>

            {/* Premium content */}
            {isPremium ? (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
                  <Card className="p-4 sm:p-6 bg-green-50 border-green-200">
                    <CardTitle className="text-md sm:text-lg mb-3 text-green-700">Detailed Summary</CardTitle>
                    <CardContent className="text-sm sm:text-base p-0">
                      <p><strong>Final Amount:</strong> {currency}{result.amount.toFixed(2)}</p>
                      <p><strong>Total Interest:</strong> {currency}{result.totalInterest.toFixed(2)}</p>
                      <p><strong>Principal:</strong> {currency}{result.principal.toFixed(2)}</p>
                      <p><strong>Years:</strong> {result.finalYear}</p>
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">
                        Your investment of {currency}{result.principal.toFixed(2)} grew to {currency}{result.amount.toFixed(2)} 
                        in {result.finalYear} years, earning {currency}{result.totalInterest.toFixed(2)} in interest.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-4 sm:p-6 bg-blue-50 border-blue-200">
                    <CardTitle className="text-md sm:text-lg mb-3 text-blue-700">Input Details</CardTitle>
                    <CardContent className="text-sm sm:text-base p-0">
                      <p><strong>Annual Rate:</strong> {rate}%</p>
                      <p><strong>Compounding Frequency:</strong> {timesCompounded}/year</p>
                      <p><strong>Calculation Period:</strong> {years} years</p>
                    </CardContent>
                  </Card>
                </div>

                <div ref={chartRef} className="mt-6 p-4 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-center mb-4">Compound Growth Chart</h3>
                  <ResponsiveContainer width="100%" height={getChartHeight()}>
                    <LineChart
                      data={result.chartData}
                      margin={getMargins()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="period"
                        label={{ value: 'Years', position: 'insideBottom', offset: -50 }}
                        angle={-45}
                        textAnchor="end"
                        interval="preserveStartEnd"
                        minTickGap={5}
                      />
                      <YAxis
                        label={{ value: 'Amount', angle: -90, position: 'insideLeft', offset: -20 }}
                        tickFormatter={formatYAxis}
                        interval="preserveStartEnd"
                        minTickGap={10}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [`${currency}${value.toFixed(2)}`, name]} 
                        labelFormatter={(label) => `${label} years`}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <ReferenceLine
                        x={result.finalYear.toString()}
                        stroke="#8884d8"
                        label={{ value: `Final Year`, position: 'top', fill: '#8884d8' }}
                        strokeDasharray="3 3"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={chartColorValue} 
                        name="Future Value" 
                        dot={false} 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gain" 
                        stroke={chartColorGain} 
                        name="Interest Earned" 
                        dot={false} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Data table for premium users */}
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full table-auto text-xs sm:text-sm text-center border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        {['Year', 'Future Value', 'Interest Earned'].map((header) => (
                          <th key={header} className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.chartData.map((row: any, i: number) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="px-2 py-1">{row.period}</td>
                          <td className="px-2 py-1">{currency}{row.value.toFixed(2)}</td>
                          <td className={`px-2 py-1 ${row.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {currency}{row.gain.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-md mt-4">
                <p className="text-lg font-semibold">Premium Features</p>
                <p className="text-sm text-gray-500 mb-3">Upgrade to premium to view detailed analysis, charts, and export options.</p>
                <Link to="/pricing">
                  <Button variant="default">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CompoundInterestCalculator;