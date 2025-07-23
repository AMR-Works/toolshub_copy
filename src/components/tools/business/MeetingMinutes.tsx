import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clipboard, Download, Printer } from 'lucide-react';

const MeetingMinutes: React.FC = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [attendees, setAttendees] = useState('');
  const [agenda, setAgenda] = useState('');
  const [notes, setNotes] = useState('');
  const [decisions, setDecisions] = useState('');

  const handleExportPdf = () => {
    // Logic to export as PDF using html2pdf.js
    alert('Export to PDF functionality coming soon!');
  };

  const handlePrint = () => {
    // Logic to print the meeting minutes
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <Clipboard className="w-6 h-6 text-teal-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Meeting Minutes Generator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meeting Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
            <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field" />
          </div>
        </div>
        <div>
          <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attendees (comma-separated)</label>
          <input type="text" id="attendees" value={attendees} onChange={(e) => setAttendees(e.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Agenda</label>
          <textarea id="agenda" value={agenda} onChange={(e) => setAgenda(e.target.value)} className="input-field w-full h-24"></textarea>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field w-full h-32"></textarea>
        </div>
        <div>
          <label htmlFor="decisions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Decisions/Action Items</label>
          <textarea id="decisions" value={decisions} onChange={(e) => setDecisions(e.target.value)} className="input-field w-full h-24"></textarea>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleExportPdf} className="btn-secondary flex items-center"><Download className="w-5 h-5 mr-2" /> Export PDF</button>
          <button onClick={handlePrint} className="btn-secondary flex items-center"><Printer className="w-5 h-5 mr-2" /> Print</button>
        </div>
      </div>
    </motion.div>
  );
};

export default MeetingMinutes;