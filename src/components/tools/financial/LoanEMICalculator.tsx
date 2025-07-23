import React, { useState, useRef } from 'react';
import {
  usePremium
} from '@/hooks/usePremium';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BarChart3, DollarSign, RefreshCw, Image, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { toast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Legend,
} from 'recharts';

export const LoanEMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [isYears, setIsYears] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    let duration = parseFloat(tenure);

    if (P <= 0 || annualRate <= 0 || duration <= 0) {
      toast({ title: 'Invalid Input', description: 'Enter valid positive values.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const N = isYears ? duration * 12 : duration;
      const R = annualRate / 12 / 100;
      const EMI = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
      const totalPayment = EMI * N;
      const totalInterest = totalPayment - P;

      const chartData = Array.from({ length: N }, (_, i) => {
        const interest = (P * R * (Math.pow(1 + R, i + 1) - 1)) / (Math.pow(1 + R, N) - 1);
        return {
          month: i + 1,
          payment: EMI,
          interest,
          principal: EMI - interest
        };
      });

      setResult({ EMI, totalPayment, totalInterest, chartData });
      setLoading(false);
      setShowAllRows(false);
    }, 1000);
  };

  const clearAll = () => {
    setLoanAmount('');
    setInterestRate('');
    setTenure('');
    setResult(null);
    setShowAllRows(false);
  };

  const exportChart = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    canvas.toBlob((blob) => blob && saveAs(blob, 'loan_emi_chart.png'));
  };

  const exportTable = () => {
    if (!result) return;
    
    const headers = 'Month,EMI ($),Principal ($),Interest ($)\n';
    const rows = result.chartData.map((row: any) => 
      `${row.month},${row.payment.toFixed(2)},${row.principal.toFixed(2)},${row.interest.toFixed(2)}`
    ).join('\n');

    const summary = `Loan Amount: $${loanAmount}\nInterest Rate: ${interestRate}%\nTenure: ${tenure} ${isYears ? 'Years' : 'Months'}\nEMI: $${result.EMI.toFixed(2)}\nTotal Payment: $${result.totalPayment.toFixed(2)}\nTotal Interest: $${result.totalInterest.toFixed(2)}\n\n`;
    
    const blob = new Blob([summary + headers + rows], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'loan_emi_schedule.csv');
  };

  const toggleShowAllRows = () => {
    setShowAllRows(!showAllRows);
  };

  const displayedData = showAllRows ? result?.chartData : result?.chartData?.slice(0, 50);
  const { isPremium } = usePremium();

  return (
    <Card className="w-full max-w-screen-lg mx-auto p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl justify-center">
          <BarChart3 className="w-5 h-5" /> Loan EMI Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <Label>Loan Amount ($)</Label>
            <Input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="e.g., 500000"
              min="0"
            />
          </div>
          <div>
            <Label>Annual Interest Rate (%)</Label>
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="e.g., 7.5"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label>{isYears ? 'Loan Tenure (Years)' : 'Loan Tenure (Months)'}</Label>
            <Input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder={isYears ? 'e.g., 20' : 'e.g., 240'}
              min="0"
            />
          </div>
          <div className="flex flex-col justify-end">
            <Label className="mb-1">Tenure in Years</Label>
            <Switch checked={isYears} onCheckedChange={setIsYears} />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={calculateEMI} disabled={loading}>
            <DollarSign className="w-4 h-4 mr-1" /> {loading ? 'Calculating...' : 'Calculate EMI'}
          </Button>
          <Button variant="outline" onClick={clearAll}>
            <RefreshCw className="w-4 h-4 mr-1" /> Clear
          </Button>
          {result && (
            <>
              <Button
                variant="secondary"
                onClick={isPremium ? exportChart : () => toast({ title: 'Premium Feature', description: 'Upgrade to premium to unlock this feature.', variant: 'default' })}
              >
                {isPremium ? <Image className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />} Export Chart
              </Button>
              <Button
                variant="secondary"
                onClick={isPremium ? exportTable : () => toast({ title: 'Premium Feature', description: 'Upgrade to premium to unlock this feature.', variant: 'default' })}
              >
                {isPremium ? <Download className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />} Export Table
              </Button>
            </>
          )}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Result Summary */}
            <div className="text-center font-bold bg-green-200 text-black border border-green-400 p-4 rounded-md shadow">
              <p>📌 EMI: ${result.EMI.toFixed(2)}</p>
              <p>💰 Total Payment: ${result.totalPayment.toFixed(2)}</p>
              <p>📉 Total Interest: ${result.totalInterest.toFixed(2)}</p>
            </div>

            {/* Chart */}
            {isPremium ? (
              <div ref={chartRef} style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(val: number) => `$${val.toFixed(2)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="payment" stroke="#8884d8" name="EMI" dot={false} />
                    <Line type="monotone" dataKey="principal" stroke="#00b300" name="Principal" dot={false} />
                    <Line type="monotone" dataKey="interest" stroke="#ff3131" name="Interest" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed border-gray-300 rounded-md">
                <p className="text-lg font-semibold">Unlock Chart and Full Amortization Schedule</p>
                <p className="text-sm text-gray-500">Upgrade to premium to view detailed charts and the complete amortization schedule.</p>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm text-center border border-green-300 rounded-lg shadow">
                <thead className="bg-green-100 font-bold text-black">
                  <tr>
                    <th className="px-2 py-1">Month</th>
                    <th className="px-2 py-1">EMI ($)</th>
                    <th className="px-2 py-1">Principal ($)</th>
                    <th className="px-2 py-1">Interest ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {isPremium ? (
                    <>
                      {displayedData.map((row: any, i: number) => (
                        <tr key={i} className="border-t border-green-200">
                          <td className="px-2 py-1">{row.month}</td>
                          <td className="px-2 py-1">${row.payment.toFixed(2)}</td>
                          <td className="px-2 py-1 text-green-600">${row.principal.toFixed(2)}</td>
                          <td className="px-2 py-1 text-red-600">${row.interest.toFixed(2)}</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        Upgrade to premium to view the full amortization schedule.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {isPremium && result.chartData.length > 50 && (
                <div className="flex justify-center mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleShowAllRows}
                    className="flex items-center gap-1"
                  >
                    {showAllRows ? (
                      <>
                        <ChevronUp className="w-4 h-4" /> Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" /> Show All {result.chartData.length} Months
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanEMICalculator;