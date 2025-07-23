import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Type, Clipboard, Eraser, Download } from 'lucide-react';

const TextCleaner: React.FC = () => {
  const [text, setText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const [removeHtmlTags, setRemoveHtmlTags] = useState(false);
  const [removeSpecialChars, setRemoveSpecialChars] = useState(false);

  useEffect(() => {
    let result = text;

    if (removeExtraSpaces) {
      result = result.replace(/\s+/g, ' ').trim();
    }

    if (removeEmptyLines) {
      result = result.replace(/\n\s*\n/g, '\n');
    }

    if (removeHtmlTags) {
      result = result.replace(/<[^>]*>/g, '');
    }

    if (removeSpecialChars) {
      result = result.replace(/[^a-zA-Z0-9\s.,!?;:]/g, '');
    }

    setCleanedText(result);
  }, [text, removeExtraSpaces, removeEmptyLines, removeHtmlTags, removeSpecialChars]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedText);
    alert('Cleaned text copied to clipboard!');
  };

  const handleClear = () => {
    setText('');
    setCleanedText('');
  };

  const handleDownload = () => {
    const blob = new Blob([cleanedText], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'cleaned-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <Type className="w-6 h-6 text-teal-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Text Cleaner</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter your text here:</label>
          <textarea
            id="text-input"
            className="input-field w-full h-32 resize-y"
            placeholder="Type or paste your text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={removeExtraSpaces}
              onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
              className="mr-2"
            />
            Remove Extra Spaces
          </label>
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="mr-2"
            />
            Remove Empty Lines
          </label>
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={removeHtmlTags}
              onChange={(e) => setRemoveHtmlTags(e.target.checked)}
              className="mr-2"
            />
            Remove HTML Tags
          </label>
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={removeSpecialChars}
              onChange={(e) => setRemoveSpecialChars(e.target.checked)}
              className="mr-2"
            />
            Remove Special Characters
          </label>
        </div>

        <div>
          <label htmlFor="cleaned-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cleaned Text:</label>
          <textarea
            id="cleaned-text"
            className="input-field w-full h-32 resize-y font-mono text-sm"
            value={cleanedText}
            readOnly
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={handleCopy} className="btn-secondary flex items-center">
            <Clipboard className="w-5 h-5 mr-2" /> Copy Cleaned Text
          </button>
          <button onClick={handleClear} className="btn-secondary flex items-center">
            <Eraser className="w-5 h-5 mr-2" /> Clear All
          </button>
          <button onClick={handleDownload} className="btn-secondary flex items-center">
            <Download className="w-5 h-5 mr-2" /> Download .txt
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TextCleaner;