import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Divide, X, Minus, Plus, Equal, Percent, Delete, Pi, ChevronLeft, ChevronRight } from 'lucide-react';
import { evaluate } from 'mathjs';

const ScientificCalculator: React.FC = () => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        const evalResult = evaluate(expression);
        setResult(evalResult.toString());
        setExpression(evalResult.toString()); // Set expression to result for continuous calculation
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === 'DEL') {
      setExpression(expression.slice(0, -1));
    } else if (value === 'sqrt') {
      setExpression(prev => prev + 'sqrt(');
    } else if (value === 'log') {
      setExpression(prev => prev + 'log(');
    } else if (value === 'ln') {
      setExpression(prev => prev + 'log(e, '); // math.js natural log
    } else if (value === 'sin') {
      setExpression(prev => prev + 'sin(');
    } else if (value === 'cos') {
      setExpression(prev => prev + 'cos(');
    } else if (value === 'tan') {
      setExpression(prev => prev + 'tan(');
    } else if (value === 'pi') {
      setExpression(prev => prev + 'pi');
    } else if (value === 'e') {
      setExpression(prev => prev + 'e');
    } else if (value === '%') {
      setExpression(prev => prev + '/100');
    } else {
      setExpression(prev => prev + value);
    }
  };

  const buttons = [
    ['C', 'DEL', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=', ''], // Empty string for the last button, will be replaced by a specific icon
    ['sin', 'cos', 'tan', ''],
    ['log', 'ln', 'sqrt', 'pi'],
    ['(', ')', 'e', ''],
  ];

  const getButtonIcon = (label: string) => {
    switch (label) {
      case '/': return <Divide className="w-5 h-5" />;
      case '*': return <X className="w-5 h-5" />;
      case '-': return <Minus className="w-5 h-5" />;
      case '+': return <Plus className="w-5 h-5" />;
      case '=': return <Equal className="w-5 h-5" />;
      case '%': return <Percent className="w-5 h-5" />;
      case 'DEL': return <Delete className="w-5 h-5" />;
      case 'sqrt': return <span>sqrt</span>;      case 'pi': return <Pi className="w-5 h-5" />;
      case 'log': return <span>log</span>;
      case 'ln': return <span>ln</span>;
      case 'sin': return <span>sin</span>;
      case 'cos': return <span>cos</span>;
      case 'tan': return <span>tan</span>;
      case '(': return <ChevronLeft className="w-5 h-5" />;
      case ')': return <ChevronRight className="w-5 h-5" />;
      case 'e': return <span>e</span>;
      default: return label;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md"
    >
      <div className="flex items-center mb-4">
        <Calculator className="w-6 h-6 text-indigo-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Scientific Calculator</h2>
      </div>

      <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-right overflow-hidden">
        <div className="text-gray-600 dark:text-gray-400 text-sm break-all h-6">{expression}</div>
        <div className="text-gray-900 dark:text-white text-3xl font-bold break-all h-10">{result || '0'}</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map((button, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(button)}
            className={`
              p-4 rounded-md text-lg font-semibold
              ${button === '=' ? 'bg-indigo-500 hover:bg-indigo-600 text-white col-span-2' : ''}
              ${['C', 'DEL', '%', '/', '*', '-', '+'].includes(button) ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white' : ''}
              ${['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'pi', '(', ')', 'e'].includes(button) ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm' : ''}
              ${!['C', 'DEL', '%', '/', '*', '-', '+', '=', 'sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'pi', '(', ')', 'e'].includes(button) && button !== '' ? 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white' : ''}
              ${button === '' ? 'invisible' : ''}
            `}
            disabled={button === ''}
          >
            {getButtonIcon(button)}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ScientificCalculator;