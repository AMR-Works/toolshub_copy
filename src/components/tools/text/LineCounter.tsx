import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlignLeft, Clipboard, Eraser } from 'lucide-react';

const LineCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [lineCount, setLineCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [avgWordsPerLine, setAvgWordsPerLine] = useState(0);

  useEffect(() => {
    if (!text.trim()) {
      setLineCount(0);
      setParagraphCount(0);
      setAvgWordsPerLine(0);
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    setLineCount(lines.length);

    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim() !== '');
    setParagraphCount(paragraphs.length);

    let totalWords = 0;
    lines.forEach(line => {
      totalWords += line.trim().split(/\s+/).filter(word => word.length > 0).length;
    });

    setAvgWordsPerLine(lines.length > 0 ? (totalWords / lines.length) : 0);

  }, [text]);

  const handleClear = () => {
    setText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <AlignLeft className="w-6 h-6 text-indigo-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Line Counter</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter your text here:</label>
          <textarea
            id="text-input"
            className="input-field w-full h-48 resize-y"
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Lines</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{lineCount}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Paragraphs</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{paragraphCount}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Words per Line</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgWordsPerLine.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={handleClear} className="btn-secondary flex items-center">
            <Eraser className="w-5 h-5 mr-2" /> Clear
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LineCounter;