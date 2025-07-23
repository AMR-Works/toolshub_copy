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
  Save,
  BarChart3,
  Percent,
  RefreshCw,
  Image,
  Info,
  Lock,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { usePremium } from '@/hooks/usePremium';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const ROI_COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

export const ROICalculator: React.FC = () => {
  const { isPremium } = usePremium();
  const [gain, setGain] = useState('');
  const [cost, setCost] = useState('');
  const [result, setResult] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Yearly'>('Yearly');
  const [currency, setCurrency] = useState('$');
  const [projectName, setProjectName] = useState('');
  const [chartColor, setChartColor] = useState('#007bff');
  const [showFormula, setShowFormula] = useState(false);
  const [viewPieChart, setViewPieChart] = useState(false);

  const chartRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  const calculateROI = () => {
    const g = parseFloat(gain) || 0;
    const c = parseFloat(cost) || 0;

    if (g <= 0 || c <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Gain and cost must be positive numbers.',
        variant: 'destructive',
      });
      return;
    }

    const roi = ((g - c) / c) * 100;
    const chartData = [
      { label: 'Investment Cost', value: c },
      { label: 'Net Gain', value: g - c },
      { label: 'Total Return', value: g },
    ];

    setResult({ roi, chartData, gain: g, cost: c });
  };

  const clearInputs = () => {
    setGain('');
    setCost('');
    setResult(null);
    setProjectName('');
  };

  const exportCSV = () => {
    if (!result) return;
    const summary = `${projectName ? 'Project: ' + projectName + '\n' : ''}ROI: ${result.roi.toFixed(2)}% (${timeframe})\n\n`;
    const headers = 'Metric,Total (' + currency + '),' + timeframe + ' (' + currency + '),Percentage\n';
    const tfDivisor = timeframe === 'Monthly' ? 12 : 1;

    const rows = [
      `Investment Cost,${result.cost.toFixed(2)},${(result.cost / tfDivisor).toFixed(2)},100%`,
      `Gain,${result.gain.toFixed(2)},${(result.gain / tfDivisor).toFixed(2)},${((result.gain / result.cost) * 100).toFixed(2)}%`,
      `Net Profit,${(result.gain - result.cost).toFixed(2)},${((result.gain - result.cost) / tfDivisor).toFixed(2)},${result.roi.toFixed(2)}%`,
    ].join('\n');

    saveAs(
      new Blob([summary + headers + rows], { type: 'text/csv;charset=utf-8;' }),
      'roi_analysis.csv'
    );
  };

  const exportChartAsImage = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current);
      canvas.toBlob((blob) => blob && saveAs(blob, 'roi_chart.png'));
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
      pdf.text(projectName || 'ROI Report', 10, 10);
      pdf.text(`ROI: ${result.roi.toFixed(2)}% (${timeframe})`, 10, 20);
      pdf.addImage(imgData, 'PNG', 10, 30, 180, 100);
      pdf.save('roi_report.pdf');
    } catch (error) {
      toast({ title: 'PDF Export Failed', description: 'Try again later.', variant: 'destructive' });
    }
  };

  return (
    <Card className="w-full max-w-screen-md mx-auto px-2 sm:px-4 py-4">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 justify-center">
          <BarChart3 className="w-5 h-5" /> ROI Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:gap-6">
        <div className="grid gap-2">
          <Label>Project Name (Optional)</Label>
          <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Ex: Marketing Campaign" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-1">
            <Label>Gain from Investment ({currency})</Label>
            <Input type="number" min="0" value={gain} onChange={(e) => setGain(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <Label>Cost of Investment ({currency})</Label>
            <Input type="number" min="0" value={cost} onChange={(e) => setCost(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <Label>Timeframe</Label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value as 'Monthly' | 'Yearly')} className="w-full p-1 border rounded">
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>

          <div>
            <Label>Currency</Label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-1 border rounded">
              {['$', '₹', '€', '£', '¥'].map((cur) => (
                <option key={cur}>{cur}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Chart Color</Label>
            <input type="color" value={chartColor} onChange={(e) => setChartColor(e.target.value)} className="w-full h-9 rounded" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <Button onClick={calculateROI} variant="default">
            <Percent className="w-4 h-4 mr-2" /> Calculate
          </Button>
          <Button onClick={clearInputs} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Clear
          </Button>
          {result && isPremium && [
            { text: 'Export CSV', icon: <Save className="w-4 h-4" />, onClick: exportCSV },
            { text: 'Export Image', icon: <Image className="w-4 h-4" />, onClick: exportChartAsImage },
            { text: 'Export PDF', icon: <Save className="w-4 h-4" />, onClick: exportPDF },
          ].map((btn, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <Button onClick={btn.onClick} variant="secondary" className="flex items-center gap-2 text-sm px-3 py-2">
                {btn.icon}{btn.text}
              </Button>
            </motion.div>
          ))}
        </div>

        {showFormula && (
          <div className="p-3 bg-blue-50 text-sm rounded-md">
            ROI = ((Gain - Cost) / Cost) × 100
          </div>
        )}

        {result && (
          <>
            <div className="text-center font-bold p-3 bg-green-500 text-black border border-green-600 rounded-lg shadow-sm">
              <div className="text-lg">ROI: {result.roi.toFixed(2)}% ({timeframe})</div>
              <div className="text-sm mt-1">
                {result.roi > 50 ? '🚀 Excellent Return!' : result.roi > 20 ? '✅ Good ROI' : '📉 Consider Optimizing'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Card className="p-4">
                <CardTitle className="text-sm font-semibold mb-2">Investment Summary</CardTitle>
                <CardContent className="p-0 text-sm">
                  <p><strong>Total Gain:</strong> {currency}{result.gain.toFixed(2)}</p>
                  <p><strong>Total Cost:</strong> {currency}{result.cost.toFixed(2)}</p>
                  <p><strong>Net Profit:</strong> {currency}{(result.gain - result.cost).toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardTitle className="text-sm font-semibold mb-2">ROI Analysis</CardTitle>
                <CardContent className="p-0 text-sm">
                  <p><strong>Return Rate:</strong> {result.roi.toFixed(2)}%</p>
                  <p><strong>Timeframe:</strong> {timeframe}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFormula(!showFormula)}
                    className="mt-2"
                  >
                    <Info className="w-4 h-4 mr-1" /> {showFormula ? 'Hide' : 'Show'} Formula
                  </Button>
                </CardContent>
              </Card>
            </div>

            {isPremium ? (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button variant="ghost" onClick={() => setViewPieChart(!viewPieChart)}>
                    Toggle {viewPieChart ? 'Line' : 'Pie'} Chart
                  </Button>
                </div>

                <div ref={chartRef} className="mt-6 p-4 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-center mb-4">ROI Breakdown</h3>
                  <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                    {viewPieChart ? (
                      <PieChart>
                        <Pie data={result.chartData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100}>
                          {result.chartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={ROI_COLORS[index % ROI_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${currency}${value.toFixed(2)}`} />
                        <Legend />
                      </PieChart>
                    ) : (
                      <LineChart data={result.chartData.map((d: any) => ({ name: d.label, value: d.value }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${currency}${value}`} />
                        <Tooltip formatter={(value: number) => `${currency}${value.toFixed(2)}`} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full table-auto text-xs sm:text-sm text-center border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1">Metric</th>
                        <th className="px-2 py-1">Total ({currency})</th>
                        <th className="px-2 py-1">{timeframe} ({currency})</th>
                        <th className="px-2 py-1">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="px-2 py-1">Investment Cost</td>
                        <td className="px-2 py-1">{result.cost.toFixed(2)}</td>
                        <td className="px-2 py-1">{(result.cost / (timeframe === 'Monthly' ? 12 : 1)).toFixed(2)}</td>
                        <td className="px-2 py-1">100%</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="px-2 py-1">Gain</td>
                        <td className="px-2 py-1">{result.gain.toFixed(2)}</td>
                        <td className="px-2 py-1">{(result.gain / (timeframe === 'Monthly' ? 12 : 1)).toFixed(2)}</td>
                        <td className="px-2 py-1">{((result.gain / result.cost) * 100).toFixed(2)}%</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="px-2 py-1">Net Profit</td>
                        <td className="px-2 py-1">{(result.gain - result.cost).toFixed(2)}</td>
                        <td className="px-2 py-1">{((result.gain - result.cost) / (timeframe === 'Monthly' ? 12 : 1)).toFixed(2)}</td>
                        <td className="px-2 py-1">{result.roi.toFixed(2)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-md mt-4">
                <p className="text-lg font-semibold">Premium Features</p>
                <p className="text-sm text-gray-500 mb-3">Upgrade to premium to view detailed charts, tables, and export options.</p>
                <Button variant="default" onClick={() => toast({ title: 'Premium Upgrade', description: 'Please upgrade to access these features.', variant: 'default' })}>
                  Upgrade Now
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ROICalculator;
