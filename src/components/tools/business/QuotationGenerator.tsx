import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Minus, Trash2, Download } from 'lucide-react';

const QuotationGenerator: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [items, setItems] = useState([
    { description: '', quantity: 1, price: 0 }
  ]);
  const [quotationNumber, setQuotationNumber] = useState('');
  const [validityDate, setValidityDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
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

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal();
  };

  const handleExportPdf = () => {
    // Logic to export as PDF using html2pdf.js
    alert('Export to PDF functionality coming soon!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <FileText className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Quotation Generator</h2>
      </div>

      <div className="space-y-6">
        {/* Quotation Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quotationNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quotation Number</label>
            <input type="text" id="quotationNumber" value={quotationNumber} onChange={(e) => setQuotationNumber(e.target.value)} className="input-field" />
          </div>
          <div>
            <label htmlFor="validityDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Validity Date</label>
            <input type="date" id="validityDate" value={validityDate} onChange={(e) => setValidityDate(e.target.value)} className="input-field" />
          </div>
        </div>

        {/* Company Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Your Company Info</h3>
          <input type="text" placeholder="Company Name" value={companyInfo.name} onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })} className="input-field" />
          <input type="text" placeholder="Address" value={companyInfo.address} onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })} className="input-field" />
          <input type="text" placeholder="Phone" value={companyInfo.phone} onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })} className="input-field" />
          <input type="email" placeholder="Email" value={companyInfo.email} onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })} className="input-field" />
        </div>

        {/* Client Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Client Info</h3>
          <input type="text" placeholder="Client Name" value={clientInfo.name} onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })} className="input-field" />
          <input type="text" placeholder="Address" value={clientInfo.address} onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })} className="input-field" />
          <input type="text" placeholder="Phone" value={clientInfo.phone} onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })} className="input-field" />
          <input type="email" placeholder="Email" value={clientInfo.email} onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })} className="input-field" />
        </div>

        {/* Items */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="input-field flex-grow" />
              <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} className="input-field w-20" />
              <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))} className="input-field w-24" />
              <button onClick={() => handleRemoveItem(index)} className="btn-icon"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
          <button onClick={handleAddItem} className="btn-primary flex items-center"><Plus className="w-5 h-5 mr-2" /> Add Item</button>
        </div>

        {/* Totals */}
        <div className="text-right space-y-2">
          <p className="text-xl font-bold text-gray-900 dark:text-white">Total Cost: ${calculateGrandTotal().toFixed(2)}</p>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Notes</h3>
          <textarea placeholder="Add any notes here..." value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field w-full h-24"></textarea>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end space-x-4">
          <button onClick={handleExportPdf} className="btn-secondary flex items-center"><Download className="w-5 h-5 mr-2" /> Export PDF</button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuotationGenerator;