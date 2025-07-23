import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Plus, Minus, Trash2, Download } from 'lucide-react';

interface Expense {
  date: string;
  category: string;
  amount: number;
  description: string;
}

const ExpenseReport: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { date: '', category: '', amount: 0, description: '' }
  ]);

  const handleAddExpense = () => {
    setExpenses([...expenses, { date: '', category: '', amount: 0, description: '' }]);
  };

  const handleRemoveExpense = (index: number) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  const handleExpenseChange = (index: number, field: keyof Expense, value: any) => {
    const newExpenses = expenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense
    );
    setExpenses(newExpenses);
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const handleExportPdf = () => {
    // Logic to export as PDF using html2pdf.js
    alert('Export to PDF functionality coming soon!');
  };

  const handleExportCsv = () => {
    // Logic to export as CSV using file-saver
    alert('Export to CSV functionality coming soon!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <FileSpreadsheet className="w-6 h-6 text-purple-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Expense Report Generator</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Expenses</h3>
        {expenses.map((expense, index) => (
          <div key={index} className="flex flex-wrap items-end space-x-2 mb-2">
            <input type="date" value={expense.date} onChange={(e) => handleExpenseChange(index, 'date', e.target.value)} className="input-field w-auto" />
            <input type="text" placeholder="Category" value={expense.category} onChange={(e) => handleExpenseChange(index, 'category', e.target.value)} className="input-field w-auto" />
            <input type="number" placeholder="Amount" value={expense.amount} onChange={(e) => handleExpenseChange(index, 'amount', parseFloat(e.target.value))} className="input-field w-auto" />
            <input type="text" placeholder="Description" value={expense.description} onChange={(e) => handleExpenseChange(index, 'description', e.target.value)} className="input-field flex-grow" />
            <button onClick={() => handleRemoveExpense(index)} className="btn-icon"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
        <button onClick={handleAddExpense} className="btn-primary flex items-center"><Plus className="w-5 h-5 mr-2" /> Add Expense</button>

        <div className="text-right mt-4">
          <p className="text-xl font-bold text-gray-900 dark:text-white">Total Expenses: ${calculateTotalExpenses().toFixed(2)}</p>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleExportPdf} className="btn-secondary flex items-center"><Download className="w-5 h-5 mr-2" /> Export PDF</button>
          <button onClick={handleExportCsv} className="btn-secondary flex items-center"><Download className="w-5 h-5 mr-2" /> Export CSV</button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseReport;