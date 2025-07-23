import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Clipboard, Eraser } from 'lucide-react';

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const TextRandomizer: React.FC = () => {
  const [text, setText] = useState('');
  const [randomizedText, setRandomizedText] = useState('');
  const [randomizeType, setRandomizeType] = useState<'words' | 'letters' | 'paragraphs'>('words');

  useEffect(() => {
    handleRandomize();
  }, [text, randomizeType]);

  const handleRandomize = () => {
    if (!text.trim()) {
      setRandomizedText('');
      return;
    }

    let result = '';
    if (randomizeType === 'words') {
      const words = text.split(/(\s+)/); // Split by spaces, keeping spaces
      const shuffledWords = shuffleArray(words.filter(word => word.trim() !== ''));
      let wordIndex = 0;
      result = words.map(word => {
        if (word.trim() === '') {
          return word;
        } else {
          return shuffledWords[wordIndex++];
        }
      }).join('');
    } else if (randomizeType === 'letters') {
      result = text.split('').sort(() => Math.random() - 0.5).join('');
    } else if (randomizeType === 'paragraphs') {
      const paragraphs = text.split(/\n\s*\n/);
      result = shuffleArray(paragraphs).join('\n\n');
    }
    setRandomizedText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(randomizedText);
    alert('Randomized text copied to clipboard!');
  };

  const handleClear = () => {
    setText('');
    setRandomizedText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <Shuffle className="w-6 h-6 text-orange-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Text Randomizer</h2>
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
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Randomize by:</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="randomize-words"
              name="randomize-type"
              value="words"
              checked={randomizeType === 'words'}
              onChange={() => setRandomizeType('words')}
              className="mr-2"
            />
            <label htmlFor="randomize-words" className="text-gray-700 dark:text-gray-300">Words</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="randomize-letters"
              name="randomize-type"
              value="letters"
              checked={randomizeType === 'letters'}
              onChange={() => setRandomizeType('letters')}
              className="mr-2"
            />
            <label htmlFor="randomize-letters" className="text-gray-700 dark:text-gray-300">Letters</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="randomize-paragraphs"
              name="randomize-type"
              value="paragraphs"
              checked={randomizeType === 'paragraphs'}
              onChange={() => setRandomizeType('paragraphs')}
              className="mr-2"
            />
            <label htmlFor="randomize-paragraphs" className="text-gray-700 dark:text-gray-300">Paragraphs</label>
          </div>
        </div>

        <div>
          <label htmlFor="randomized-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Randomized Text:</label>
          <textarea
            id="randomized-text"
            className="input-field w-full h-32 resize-y font-mono text-sm"
            value={randomizedText}
            readOnly
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={handleCopy} className="btn-secondary flex items-center">
            <Clipboard className="w-5 h-5 mr-2" /> Copy Randomized Text
          </button>
          <button onClick={handleClear} className="btn-secondary flex items-center">
            <Eraser className="w-5 h-5 mr-2" /> Clear All
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TextRandomizer;