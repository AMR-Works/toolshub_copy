import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Contact, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const BusinessCardMaker: React.FC = () => {
  const [name, setName] = useState('Your Name');
  const [title, setTitle] = useState('Your Title');
  const [company, setCompany] = useState('Your Company');
  const [contact, setContact] = useState('Phone | Email | Website');
  const [style, setStyle] = useState('left-align'); // 'left-align' or 'center-align'
  const [logo, setLogo] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportPng = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, 'business-card.png');
        }
      });
    }
  };

  const handleExportPdf = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      // Basic PDF generation (requires jsPDF or similar, for simplicity using alert)
      alert('PDF export requires a library like jsPDF. PNG export is available.');
      // Example with jsPDF (if installed):
      // const pdf = new (window as any).jsPDF();
      // pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      // pdf.save('business-card.pdf');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <Contact className="w-6 h-6 text-pink-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Business Card Maker</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
            <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="input-field" />
          </div>
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Info</label>
            <input type="text" id="contact" value={contact} onChange={(e) => setContact(e.target.value)} className="input-field" />
          </div>
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Layout Style</label>
            <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="input-field">
              <option value="left-align">Left Align</option>
              <option value="center-align">Center Align</option>
            </select>
          </div>
          <div>
            <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Logo (Optional)</label>
            <input type="file" id="logoUpload" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Preview</h3>
          <div
            ref={cardRef}
            className={`w-80 h-48 bg-white dark:bg-gray-900 shadow-lg rounded-md flex flex-col justify-center p-6 border border-gray-300 dark:border-gray-600 ${style === 'center-align' ? 'text-center items-center' : 'text-left items-start'}`}
          >
            {logo && <img src={logo} alt="Logo" className="max-h-16 max-w-full mb-2" />}
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">{name}</p>
            <p className="text-md text-gray-700 dark:text-gray-300 mb-1">{title}</p>
            <p className="text-md text-gray-700 dark:text-gray-300 mb-1">{company}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{contact}</p>
          </div>
          <div className="flex space-x-4 mt-4">
            <button onClick={handleExportPng} className="btn-secondary flex items-center"><Download className="w-5 h-5 mr-2" /> Export PNG</button>
            <button onClick={handleExportPdf} className="btn-secondary flex items-center"><Download className="w-5 h-5 mr-2" /> Export PDF</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessCardMaker;