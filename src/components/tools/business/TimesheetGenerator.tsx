import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Minus, Trash2, Download } from 'lucide-react';

interface TimesheetEntry {
  date: string;
  employeeName: string;
  task: string;
  hours: number;
}

const TimesheetGenerator: React.FC = () => {
  const [entries, setEntries] = useState<TimesheetEntry[]>([
    { date: '', employeeName: '', task: '', hours: 0 }
  ]);

  const handleAddEntry = () => {
    setEntries([...entries, { date: '', employeeName: '', task: '', hours: 0 }]);
  };

  const handleRemoveEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const handleEntryChange = (index: number, field: keyof TimesheetEntry, value: any) => {
    const newEntries = entries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setEntries(newEntries);
  };

  const calculateTotalHours = () => {
    return entries.reduce((sum, entry) => sum + entry.hours, 0);
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
        <Clock className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Timesheet Generator</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Timesheet Entries</h3>
        {entries.map((entry, index) => (
          <div key={index} className="flex flex-wrap items-end space-x-2 mb-2">
            <input type="date" value={entry.date} onChange={(e) => handleEntryChange(index, 'date', e.target.value)} className="input-field w-auto" />
            <input type="text" placeholder="Employee Name" value={entry.employeeName} onChange={(e) => handleEntryChange(index, 'employeeName', e.target.value)} className="input-field w-auto" />
            <input type="text" placeholder="Task/Project" value={entry.task} onChange={(e) => handleEntryChange(index, 'task', e.target.value)} className="input-field flex-grow" />
            <input type="number" placeholder="Hours" value={entry.hours} onChange={(e) => handleEntryChange(index, 'hours', parseFloat(e.target.value))} className="input-field w-24" />
            <button onClick={() => handleRemoveEntry(index)} className="btn-icon"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
        <button onClick={handleAddEntry} className="btn-primary flex items-center"><Plus className="w-5 h-5 mr-2" /> Add Entry</button>

        <div className="text-right mt-4">
          <p className="text-xl font-bold text-gray-900 dark:text-white">Total Hours: {calculateTotalHours().toFixed(2)}</p>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleExportPdf} className="btn-secondary flex items-center"><Download className="w-5 h-5 mr-2" /> Export PDF</button>
          <button onClick={handleExportCsv} className="btn-secondary flex items-center"><Download className="w-5 h-5 mr-2" /> Export CSV</button>
        </div>
      </div>
    </motion.div>
  );
};

export default TimesheetGenerator;