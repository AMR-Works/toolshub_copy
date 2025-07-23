import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListOrdered, Clipboard, Eraser } from 'lucide-react';

const ListSorter: React.FC = () => {
  const [text, setText] = useState('');
  const [sortedText, setSortedText] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);

  useEffect(() => {
    handleSort();
  }, [text, sortOrder, removeDuplicates, trimWhitespace]);

  const handleSort = () => {
    if (!text.trim()) {
      setSortedText('');
      return;
    }

    let lines = text.split('\n');

    if (trimWhitespace) {
      lines = lines.map(line => line.trim());
    }

    if (removeDuplicates) {
      lines = Array.from(new Set(lines));
    }

    lines.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.localeCompare(b);
      } else {
        return b.localeCompare(a);
      }
    });

    setSortedText(lines.join('\n'));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sortedText);
    alert('Sorted list copied to clipboard!');
  };

  const handleClear = () => {
    setText('');
    setSortedText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <ListOrdered className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">List Sorter</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter your list here (one item per line):</label>
          <textarea
            id="text-input"
            className="input-field w-full h-32 resize-y"
            placeholder="Apple\nBanana\nOrange"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              name="sort-order"
              value="asc"
              checked={sortOrder === 'asc'}
              onChange={() => setSortOrder('asc')}
              className="mr-2"
            />
            Alphabetical (A-Z)
          </label>
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              name="sort-order"
              value="desc"
              checked={sortOrder === 'desc'}
              onChange={() => setSortOrder('desc')}
              className="mr-2"
            />
            Reverse Alphabetical (Z-A)
          </label>
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              className="mr-2"
            />
            Remove Duplicates
          </label>
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="mr-2"
            />
            Trim Whitespace
          </label>
        </div>

        <div>
          <label htmlFor="sorted-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sorted List:</label>
          <textarea
            id="sorted-text"
            className="input-field w-full h-32 resize-y font-mono text-sm"
            value={sortedText}
            readOnly
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={handleCopy} className="btn-secondary flex items-center">
            <Clipboard className="w-5 h-5 mr-2" /> Copy Sorted List
          </button>
          <button onClick={handleClear} className="btn-secondary flex items-center">
            <Eraser className="w-5 h-5 mr-2" /> Clear All
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ListSorter;