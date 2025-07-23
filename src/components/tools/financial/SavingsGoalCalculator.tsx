import React, { useState, useRef } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { BarChart3, Clock, DollarSign } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export const SavingsGoalCalculator: React.FC = () => {
  const [goalAmount, setGoalAmount] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [resultMonths, setResultMonths] = useState<number | null>(null);
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [data, setData] = useState<any[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  const calculateTimeNeeded = () => {
    const goal = parseFloat(goalAmount);
    const monthly = parseFloat(monthlySavings);
    const annualRate = parseFloat(interestRate);
    const r = annualRate / 100 / 12; // monthly rate

    if (!goal || !monthly || goal <= 0 || monthly <= 0) {
      toast({ title: 'Invalid Input', description: 'Please enter valid positive values.', variant: 'destructive' });
      return;
    }

    let months = 0;
    let total = 0;
    const tableData = [];

    while (total < goal) {
      total = total * (1 + r) + monthly;
      months++;
      tableData.push({
        month: months,
        year: (months / 12).toFixed(1),
        value: total
      });
    }

    setResultMonths(months);
    setFutureValue(total);
    setData(tableData);
  };

  const clearInputs = () => {
    setGoalAmount('');
    setMonthlySavings('');
    setInterestRate('');
    setResultMonths(null);
    setFutureValue(null);
    setData([]);
  };

  return (
    <Card className="w-full max-w-screen-md mx-auto px-2 sm:px-4 py-4">
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2 justify-center">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          Savings Goal Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="grid gap-1 sm:gap-2">
            <Label>Savings Goal Amount ($)</Label>
            <Input
              type="number"
              min="0"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              placeholder="Enter your savings goal amount"
            />
          </div>
          <div className="grid gap-1 sm:gap-2">
            <Label>Monthly Savings ($)</Label>
            <Input
              type="number"
              min="0"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(e.target.value)}
              placeholder="Enter your monthly savings"
            />
          </div>
          <div className="grid gap-1 sm:gap-2">
            <Label>Expected Interest Rate (% per annum)</Label>
            <Input
              type="number"
              min="0"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Enter expected annual rate of return"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <Button onClick={calculateTimeNeeded} variant="default" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Calculate Time Needed
          </Button>
          <Button onClick={clearInputs} variant="outline" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Clear
          </Button>
        </div>

        {resultMonths !== null && (
          <>
            <div className="text-center font-bold p-4 bg-green-100 border border-green-300 rounded-lg shadow-sm">
              <div className="text-base sm:text-xl">
                Time to reach goal: {resultMonths} months ({(resultMonths / 12).toFixed(1)} years)
              </div>
              <div className="text-sm sm:text-lg mt-1">
                Future Value: ${futureValue?.toFixed(2)}
              </div>
            </div>

            <div ref={chartRef} className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-center mb-4">Savings Growth Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis dataKey="value" label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Future Value" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto text-xs sm:text-sm text-center border border-gray-300 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1">Month</th>
                    <th className="px-2 py-1">Year</th>
                    <th className="px-2 py-1">Value ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="px-2 py-1">{row.month}</td>
                      <td className="px-2 py-1">{row.year}</td>
                      <td className="px-2 py-1">${row.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsGoalCalculator;
