import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Plus, Trash2, Download } from 'lucide-react';

interface Shift {
  day: string;
  name: string;
  time: string;
  task: string;
  color: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WorkScheduleMaker: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([
    { day: 'Monday', name: '', time: '', task: '', color: '#ADD8E6' } // Light Blue
  ]);

  const handleAddShift = () => {
    setShifts([...shifts, { day: 'Monday', name: '', time: '', task: '', color: '#ADD8E6' }]);
  };

  const handleRemoveShift = (index: number) => {
    const newShifts = shifts.filter((_, i) => i !== index);
    setShifts(newShifts);
  };

  const handleShiftChange = (index: number, field: keyof Shift, value: any) => {
    const newShifts = shifts.map((shift, i) =>
      i === index ? { ...shift, [field]: value } : shift
    );
    setShifts(newShifts);
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
        <CalendarDays className="w-6 h-6 text-orange-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Work Schedule Maker</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Schedule Entries</h3>
        {shifts.map((shift, index) => (
          <div key={index} className="flex flex-wrap items-end space-x-2 mb-2">
            <select value={shift.day} onChange={(e) => handleShiftChange(index, 'day', e.target.value)} className="input-field w-32">
              {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
            <input type="text" placeholder="Name" value={shift.name} onChange={(e) => handleShiftChange(index, 'name', e.target.value)} className="input-field w-32" />
            <input type="text" placeholder="Time (e.g., 9-5)" value={shift.time} onChange={(e) => handleShiftChange(index, 'time', e.target.value)} className="input-field w-32" />
            <input type="text" placeholder="Task/Project" value={shift.task} onChange={(e) => handleShiftChange(index, 'task', e.target.value)} className="input-field flex-grow" />
            <input type="color" value={shift.color} onChange={(e) => handleShiftChange(index, 'color', e.target.value)} className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer" title="Choose color" />
            <button onClick={() => handleRemoveShift(index)} className="btn-icon"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
        <button onClick={handleAddShift} className="btn-primary flex items-center"><Plus className="w-5 h-5 mr-2" /> Add Shift</button>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleExportPdf} className="btn-secondary flex items-center"><Download className="w-5 h-5 mr-2" /> Export PDF</button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkScheduleMaker;