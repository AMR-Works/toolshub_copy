import React, { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

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
  ReferenceLine,
} from 'recharts';
import { Save, BarChart3, DollarSign, RefreshCw, Image, Lock, FileText } from 'lucide-react';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePremium } from '@/hooks/usePremium';
import jsPDF from 'jspdf';

interface ResultData {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  marginOfSafety: number;
  chartData: any[];
  fixedCost: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  unitsSold: number;
  maxUnits: number;
}

export const BreakEvenPointCalculator: React.FC = () => {
  const [fixedCost, setFixedCost] = useState('');
  const [variableCostPerUnit, setVariableCostPerUnit] = useState('');
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState('');
  const [unitsSold, setUnitsSold] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [currency, setCurrency] = useState('$');
  const [chartColorRevenue, setChartColorRevenue] = useState('#00b300');
  const [chartColorCost, setChartColorCost] = useState('#ff3131');

  const chartRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const { isPremium } = usePremium();

  const calculateBreakEven = () => {
    const fc = parseFloat(fixedCost) || 0;
    const vc = parseFloat(variableCostPerUnit) || 0;
    const sp = parseFloat(sellingPricePerUnit) || 0;
    const us = parseFloat(unitsSold) || 0;

    if (fc <= 0 || vc < 0 || sp <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid positive values.',
        variant: 'destructive',
      });
      return;
    }

    if (sp <= vc) {
      toast({
        title: 'Invalid Pricing',
        description: 'Selling price must be greater than variable cost.',
        variant: 'destructive',
      });
      return;
    }

    const breakEvenUnits = fc / (sp - vc);
    const breakEvenRevenue = breakEvenUnits * sp;
    const marginOfSafety = us > 0 ? ((us - breakEvenUnits) / us) * 100 : 0;

    const maxUnits = Math.max(us || breakEvenUnits * 2, breakEvenUnits * 1.5);
    const step = isMobile ? Math.ceil(maxUnits / 10) :
                isTablet ? Math.ceil(maxUnits / 15) :
                Math.ceil(maxUnits / 20);

    const chartData = [];
    for (let units = 0; units <= maxUnits; units += step) {
      const totalRevenue = units * sp;
      const totalCost = fc + (units * vc);
      chartData.push({
        units,
        totalRevenue,
        totalCost,
        profit: totalRevenue - totalCost,
        fixedCost: fc,
        breakEven: units === Math.round(breakEvenUnits) ? breakEvenRevenue : null
      });
    }

    setResult({
      breakEvenUnits,
      breakEvenRevenue,
      marginOfSafety,
      chartData,
      fixedCost: fc,
      variableCostPerUnit: vc,
      sellingPricePerUnit: sp,
      unitsSold: us,
      maxUnits
    });
  };

  const clearInputs = () => {
    setFixedCost('');
    setVariableCostPerUnit('');
    setSellingPricePerUnit('');
    setUnitsSold('');
    setResult(null);
  };

  const exportCSV = () => {
    if (!result) return;
    const headers = 'Units,Total Revenue,Total Cost,Profit,Fixed Cost\n';
    const rows = result.chartData.map((row: any) =>
      `${row.units},${currency}${row.totalRevenue.toFixed(2)},${currency}${row.totalCost.toFixed(2)},${currency}${row.profit.toFixed(2)},${currency}${row.fixedCost.toFixed(2)}`
    ).join('\n');
    const summary = `Break-Even: ${result.breakEvenUnits.toFixed(0)} units | ${currency}${result.breakEvenRevenue.toFixed(2)}\nMargin of Safety: ${result.marginOfSafety.toFixed(1)}%\n\n`;
    saveAs(new Blob([summary + headers + rows], { type: 'text/csv;charset=utf-8;' }), 'break_even_analysis.csv');
  };

  const exportChartAsImage = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current);
      canvas.toBlob((blob) => blob && saveAs(blob, 'break_even_chart.png'));
    } catch (error) {
      toast({ title: 'Export Error', description: 'Failed to export chart.', variant: 'destructive' });
    }
  };

  const exportPDF = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.text('Break-Even Analysis Report', 10, 10);
      pdf.text(`Break-Even Units: ${result?.breakEvenUnits.toFixed(0)}`, 10, 20);
      pdf.text(`Break-Even Revenue: ${currency}${result?.breakEvenRevenue.toFixed(2)}`, 10, 30);
      pdf.addImage(imgData, 'PNG', 10, 40, 180, 100);
      pdf.save('break_even_report.pdf');
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
      onClick: calculateBreakEven,
      variant: "default"
    },
    {
      text: "Clear",
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: clearInputs,
      variant: "outline"
    },
    {
      text: "Export CSV",
      icon: isPremium ? <Save className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
      onClick: isPremium ? exportCSV : () => toast({ title: 'Premium Feature', description: 'Upgrade to premium to unlock this feature.', variant: 'default' }),
      variant: "secondary"
    },
    {
      text: "Export Image",
      icon: isPremium ? <Image className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
      onClick: isPremium ? exportChartAsImage : () => toast({ title: 'Premium Feature', description: 'Upgrade to premium to unlock this feature.', variant: 'default' }),
      variant: "secondary"
    },
    {
      text: "Export PDF",
      icon: isPremium ? <FileText className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
      onClick: isPremium ? exportPDF : () => toast({ title: 'Premium Feature', description: 'Upgrade to premium to unlock this feature.', variant: 'default' }),
      variant: "secondary"
    }
  ];

  return (
    <Card className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 py-4">
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2 justify-center">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          Break-Even Point Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {[
            { label: `Fixed Costs (${currency})`, value: fixedCost, onChange: setFixedCost, placeholder: "e.g., 5000" },
            { label: `Variable Cost/Unit (${currency})`, value: variableCostPerUnit, onChange: setVariableCostPerUnit, placeholder: "e.g., 20" },
            { label: `Selling Price/Unit (${currency})`, value: sellingPricePerUnit, onChange: setSellingPricePerUnit, placeholder: "e.g., 50" },
            { label: "Units Sold (Optional)", value: unitsSold, onChange: setUnitsSold, placeholder: "e.g., 1000" }
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
            <Label>Revenue Color</Label>
            <input type="color" value={chartColorRevenue} onChange={(e) => setChartColorRevenue(e.target.value)} className="w-full h-9 rounded" />
          </div>
          <div>
            <Label>Cost Color</Label>
            <input type="color" value={chartColorCost} onChange={(e) => setChartColorCost(e.target.value)} className="w-full h-9 rounded" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
          {buttons.map((button, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <Button
                onClick={button.onClick}
                variant={button.variant as any}
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
            <div className="text-center font-bold p-3 sm:p-4 bg-blue-100 border border-blue-300 rounded-lg shadow-sm">
              <div className="text-base sm:text-xl">
                Break-Even Point: {Math.ceil(result.breakEvenUnits)} units
              </div>
              <div className="text-base sm:text-xl mt-1">
                Break-Even Revenue: {currency}{result.breakEvenRevenue.toFixed(2)}
              </div>
              {result.unitsSold > 0 && (
                <div className="text-sm sm:text-lg mt-2">
                  Margin of Safety: {result.marginOfSafety.toFixed(1)}%
                </div>
              )}
            </div>

            {/* Premium content */}
            {isPremium ? (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
                  <Card className="p-4 sm:p-6 bg-blue-50 border-blue-200">
                    <CardTitle className="text-md sm:text-lg mb-3 text-blue-700">Detailed Summary</CardTitle>
                    <CardContent className="text-sm sm:text-base p-0">
                      <p><strong>Break-Even Units:</strong> {result.breakEvenUnits.toFixed(0)} units</p>
                      <p><strong>Break-Even Revenue:</strong> {currency}{result.breakEvenRevenue.toFixed(2)}</p>
                      <p><strong>Margin of Safety:</strong> {result.marginOfSafety.toFixed(1)}%</p>
                      {result.unitsSold > 0 && (
                        <p className="mt-2 text-xs sm:text-sm text-gray-600">
                          You need to sell {result.breakEvenUnits.toFixed(0)} units to cover all costs.
                          Your current sales of {result.unitsSold} units provide a {result.marginOfSafety.toFixed(1)}% safety margin.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="p-4 sm:p-6 bg-purple-50 border-purple-200">
                    <CardTitle className="text-md sm:text-lg mb-3 text-purple-700">Input Details</CardTitle>
                    <CardContent className="text-sm sm:text-base p-0">
                      <p><strong>Fixed Costs:</strong> {currency}{result.fixedCost.toFixed(2)}</p>
                      <p><strong>Variable Cost/Unit:</strong> {currency}{result.variableCostPerUnit.toFixed(2)}</p>
                      <p><strong>Selling Price/Unit:</strong> {currency}{result.sellingPricePerUnit.toFixed(2)}</p>
                      {result.unitsSold > 0 && <p><strong>Units Sold:</strong> {result.unitsSold}</p>}
                    </CardContent>
                  </Card>
                </div>

                <div ref={chartRef} className="mt-6 p-4 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-center mb-4">Break-Even Analysis Chart</h3>
                  <ResponsiveContainer width="100%" height={getChartHeight()}>
                    <LineChart
                      data={result.chartData}
                      margin={getMargins()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="units"
                        label={{ value: 'Units', position: 'insideBottom', offset: -50 }}
                        tickFormatter={(value) => value.toLocaleString()}
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
                      <Tooltip formatter={(value: number, name: string) => [`${currency}${value.toFixed(2)}`, name]} />
                      <Legend verticalAlign="top" height={36} />
                      <ReferenceLine
                        x={result.breakEvenUnits}
                        stroke="#8884d8"
                        label={{ value: `BEP: ${result.breakEvenUnits.toFixed(0)} units`, position: 'top', fill: '#8884d8' }}
                        strokeDasharray="3 3"
                      />
                      <ReferenceLine
                        y={result.breakEvenRevenue}
                        stroke="#8884d8"
                        label={{ value: `${currency}${result.breakEvenRevenue.toFixed(2)}`, position: 'insideTopLeft', fill: '#8884d8' }}
                        strokeDasharray="3 3"
                      />
                      <Line type="monotone" dataKey="totalRevenue" stroke={chartColorRevenue} name="Total Revenue" dot={false} />
                      <Line type="monotone" dataKey="totalCost" stroke={chartColorCost} name="Total Cost" dot={false} />
                      <Line type="monotone" dataKey="fixedCost" stroke="#82ca9d" name="Fixed Cost" dot={false} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Data table for premium users */}
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full table-auto text-xs sm:text-sm text-center border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        {['Units', 'Revenue', 'Total Cost', 'Profit', 'Fixed Cost'].map((header) => (
                          <th key={header} className="px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.chartData.map((row: any, i: number) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="px-2 py-1">{row.units}</td>
                          <td className="px-2 py-1">{currency}{row.totalRevenue.toFixed(2)}</td>
                          <td className="px-2 py-1">{currency}{row.totalCost.toFixed(2)}</td>
                          <td className={`px-2 py-1 ${row.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {currency}{row.profit.toFixed(2)}
                          </td>
                          <td className="px-2 py-1">{currency}{row.fixedCost.toFixed(2)}</td>
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

export default BreakEvenPointCalculator;