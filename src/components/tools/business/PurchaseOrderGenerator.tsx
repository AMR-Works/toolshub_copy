import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Download } from 'lucide-react';

const PurchaseOrderGenerator: React.FC = () => {
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [items, setItems] = useState([
    { description: '', quantity: 1, price: 0 }
  ]);
  const [poNumber, setPoNumber] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
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
        <ShoppingCart className="w-6 h-6 text-red-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Purchase Order Generator</h2>
      </div>

      <div className="space-y-6">
        {/* PO Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="poNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">PO Number</label>
            <input type="text" id="poNumber" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} className="input-field" />
          </div>
          <div>
            <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Terms</label>
            <input type="text" id="paymentTerms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="input-field" />
          </div>
        </div>

        {/* Supplier Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Supplier Info</h3>
          <input type="text" placeholder="Supplier Name" value={supplierInfo.name} onChange={(e) => setSupplierInfo({ ...supplierInfo, name: e.target.value })} className="input-field" />
          <input type="text" placeholder="Address" value={supplierInfo.address} onChange={(e) => setSupplierInfo({ ...supplierInfo, address: e.target.value })} className="input-field" />
          <input type="text" placeholder="Phone" value={supplierInfo.phone} onChange={(e) => setSupplierInfo({ ...supplierInfo, phone: e.target.value })} className="input-field" />
          <input type="email" placeholder="Email" value={supplierInfo.email} onChange={(e) => setSupplierInfo({ ...supplierInfo, email: e.target.value })} className="input-field" />
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
          <p className="text-xl font-bold text-gray-900 dark:text-white">Grand Total: ${calculateGrandTotal().toFixed(2)}</p>
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

export default PurchaseOrderGenerator;