import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ReplaceAll, Clipboard, Eraser } from 'lucide-react';

const FindReplaceTool: React.FC = () => {
  const [text, setText] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [resultText, setResultText] = useState('');
  const [matchCase, setMatchCase] = useState(false);

  useEffect(() => {
    // Live preview of find/replace
    let tempResult = text;
    if (findText) {
      const flags = matchCase ? 'g' : 'gi';
      tempResult = text.replace(new RegExp(findText, flags), (match) => `<mark>${match}</mark>`);
    }
    setResultText(tempResult);
  }, [text, findText, matchCase]);

  const handleReplaceAll = () => {
    if (!findText) return;
    const flags = matchCase ? 'g' : 'gi';
    const newText = text.replace(new RegExp(findText, flags), replaceText);
    setText(newText);
    setResultText(newText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert('Text copied to clipboard!');
  };

  const handleClear = () => {
    setText('');
    setFindText('');
    setReplaceText('');
    setResultText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <Search className="w-6 h-6 text-red-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Find & Replace Tool</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="find-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Find:</label>
            <input
              type="text"
              id="find-input"
              className="input-field w-full"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Word to find"
            />
          </div>
          <div>
            <label htmlFor="replace-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Replace with:</label>
            <input
              type="text"
              id="replace-input"
              className="input-field w-full"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replacement word"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="match-case"
            checked={matchCase}
            onChange={(e) => setMatchCase(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="match-case" className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Case</label>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={handleReplaceAll} className="btn-primary flex items-center" disabled={!findText}>
            <ReplaceAll className="w-5 h-5 mr-2" /> Replace All
          </button>
          <button onClick={handleClear} className="btn-secondary flex items-center">
            <Eraser className="w-5 h-5 mr-2" /> Clear All
          </button>
        </div>

        <div>
          <label htmlFor="result-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview / Result:</label>
          <div
            id="result-text"
            className="input-field w-full h-48 resize-y overflow-auto font-mono text-sm"
            dangerouslySetInnerHTML={{ __html: resultText }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default FindReplaceTool;