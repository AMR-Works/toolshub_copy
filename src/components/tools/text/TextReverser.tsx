import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Clipboard, Eraser } from 'lucide-react';

const TextReverser: React.FC = () => {
  const [text, setText] = useState('');
  const [reversedText, setReversedText] = useState('');
  const [reverseType, setReverseType] = useState<'characters' | 'words' | 'lines'>('characters');
  const [preservePunctuation, setPreservePunctuation] = useState(false);

  const handleReverse = () => {
    let result = '';
    if (reverseType === 'characters') {
      result = text.split('').reverse().join('');
    } else if (reverseType === 'words') {
      result = text.split(/(\s+)/).reverse().join('');
      if (!preservePunctuation) {
        result = result.replace(/([.,!?;:])(?=\s|$)/g, '').replace(/\s([.,!?;:])/, '$1 ');
      }
    } else if (reverseType === 'lines') {
      result = text.split('\n').reverse().join('\n');
    }
    setReversedText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reversedText);
    alert('Reversed text copied to clipboard!');
  };

  const handleClear = () => {
    setText('');
    setReversedText('');
  };

  React.useEffect(() => {
    handleReverse();
  }, [text, reverseType, preservePunctuation]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <Type className="w-6 h-6 text-yellow-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Text Reverser</h2>
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

        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reverse by:</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="reverse-chars"
              name="reverse-type"
              value="characters"
              checked={reverseType === 'characters'}
              onChange={() => setReverseType('characters')}
              className="mr-2"
            />
            <label htmlFor="reverse-chars" className="text-gray-700 dark:text-gray-300">Characters</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="reverse-words"
              name="reverse-type"
              value="words"
              checked={reverseType === 'words'}
              onChange={() => setReverseType('words')}
              className="mr-2"
            />
            <label htmlFor="reverse-words" className="text-gray-700 dark:text-gray-300">Words</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="reverse-lines"
              name="reverse-type"
              value="lines"
              checked={reverseType === 'lines'}
              onChange={() => setReverseType('lines')}
              className="mr-2"
            />
            <label htmlFor="reverse-lines" className="text-gray-700 dark:text-gray-300">Lines</label>
          </div>

          {reverseType === 'words' && (
            <div className="flex items-center ml-4">
              <input
                type="checkbox"
                id="preserve-punctuation"
                checked={preservePunctuation}
                onChange={(e) => setPreservePunctuation(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="preserve-punctuation" className="text-gray-700 dark:text-gray-300">Preserve Punctuation</label>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="reversed-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reversed Text:</label>
          <textarea
            id="reversed-text"
            className="input-field w-full h-32 resize-y font-mono text-sm"
            value={reversedText}
            readOnly
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={handleCopy} className="btn-secondary flex items-center">
            <Clipboard className="w-5 h-5 mr-2" /> Copy Reversed Text
          </button>
          <button onClick={handleClear} className="btn-secondary flex items-center">
            <Eraser className="w-5 h-5 mr-2" /> Clear All
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TextReverser;