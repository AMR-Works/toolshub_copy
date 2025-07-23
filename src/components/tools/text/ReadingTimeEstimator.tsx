import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clipboard, Eraser } from 'lucide-react';

const ReadingTimeEstimator: React.FC = () => {
  const [text, setText] = useState('');
  const [readingSpeed, setReadingSpeed] = useState(200); // words per minute
  const [estimatedTime, setEstimatedTime] = useState(0);

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const minutes = words.length / readingSpeed;
    setEstimatedTime(minutes);
  }, [text, readingSpeed]);

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
        <BookOpen className="w-6 h-6 text-purple-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Reading Time Estimator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter your text here:</label>
          <textarea
            id="text-input"
            className="input-field w-full h-48 resize-y"
            placeholder="Start typing or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
          <label htmlFor="reading-speed" className="text-sm font-medium text-gray-700 dark:text-gray-300">Reading Speed (WPM):</label>
          <select
            id="reading-speed"
            className="input-field w-full md:w-auto"
            value={readingSpeed}
            onChange={(e) => setReadingSpeed(parseInt(e.target.value))}
          >
            <option value={150}>Slow (150 WPM)</option>
            <option value={200}>Average (200 WPM)</option>
            <option value={250}>Fast (250 WPM)</option>
          </select>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated Reading Time</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {estimatedTime < 1 ? '< 1' : Math.ceil(estimatedTime)} minute{Math.ceil(estimatedTime) === 1 ? '' : 's'}
          </p>
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

export default ReadingTimeEstimator;