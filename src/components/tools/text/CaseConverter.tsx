import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Clipboard, Eraser } from 'lucide-react';

const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [convertedText, setConvertedText] = useState('');

  const convertCase = (type: string) => {
    let result = '';
    switch (type) {
      case 'uppercase':
        result = text.toUpperCase();
        break;
      case 'lowercase':
        result = text.toLowerCase();
        break;
      case 'titlecase':
        result = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      case 'sentencecase':
        result = text.toLowerCase().replace(/(^|\.\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
        break;
      case 'capitalizeeachword':
        result = text.replace(/\b\w/g, (char) => char.toUpperCase());
        break;
      default:
        result = text;
    }
    setConvertedText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedText);
    alert('Converted text copied to clipboard!');
  };

  const handleClear = () => {
    setText('');
    setConvertedText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <Type className="w-6 h-6 text-green-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Case Converter</h2>
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button onClick={() => convertCase('uppercase')} className="btn-outline">UPPERCASE</button>
          <button onClick={() => convertCase('lowercase')} className="btn-outline">lowercase</button>
          <button onClick={() => convertCase('titlecase')} className="btn-outline">Title Case</button>
          <button onClick={() => convertCase('sentencecase')} className="btn-outline">Sentence case</button>
          <button onClick={() => convertCase('capitalizeeachword')} className="btn-outline">Capitalize Each Word</button>
        </div>

        <div>
          <label htmlFor="converted-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Converted Text:</label>
          <textarea
            id="converted-text"
            className="input-field w-full h-32 resize-y font-mono text-sm"
            value={convertedText}
            readOnly
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={handleCopy} className="btn-secondary flex items-center">
            <Clipboard className="w-5 h-5 mr-2" /> Copy Converted Text
          </button>
          <button onClick={handleClear} className="btn-secondary flex items-center">
            <Eraser className="w-5 h-5 mr-2" /> Clear All
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseConverter;