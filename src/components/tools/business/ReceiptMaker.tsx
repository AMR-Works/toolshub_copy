import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Plus, Minus, Trash2, Download, Printer } from 'lucide-react';

const ReceiptMaker: React.FC = () => {
  const [date, setDate] = useState('');
  const [payerInfo, setPayerInfo] = useState('');
  const [items, setItems] = useState([
    { description: '', amount: 0 }
  ]);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleAddItem = () => {
    setItems([...items, { description: '', amount: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleExportPdf = () => {
    // Logic to export as PDF using html2pdf.js
    alert('Export to PDF functionality coming soon!');
  };

  const handlePrint = () => {
    // Logic to print the receipt
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <Receipt className="w-6 h-6 text-green-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Receipt Maker</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="payerInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payer Info</label>
          <input type="text" id="payerInfo" placeholder="Payer Name / Company" value={payerInfo} onChange={(e) => setPayerInfo(e.target.value)} className="input-field" />
        </div>

        {/* Items */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="input-field flex-grow" />
              <input type="number" placeholder="Amount" value={item.amount} onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value))} className="input-field w-32" />
              <button onClick={() => handleRemoveItem(index)} className="btn-icon"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
          <button onClick={handleAddItem} className="btn-primary flex items-center"><Plus className="w-5 h-5 mr-2" /> Add Item</button>
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
          <input type="text" id="paymentMethod" placeholder="e.g., Cash, Card, Bank Transfer" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field" />
        </div>

        {/* Total */}
        <div className="text-right mt-4">
          <p className="text-xl font-bold text-gray-900 dark:text-white">Total: ${calculateTotal().toFixed(2)}</p>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleExportPdf} className="btn-secondary flex items-center"><Download className="w-5 h-5 mr-2" /> Export PDF</button>
          <button onClick={handlePrint} className="btn-secondary flex items-center"><Printer className="w-5 h-5 mr-2" /> Print</button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReceiptMaker;