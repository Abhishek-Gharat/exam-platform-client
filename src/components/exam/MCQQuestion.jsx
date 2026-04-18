import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Check } from 'lucide-react';

const MCQQuestion = ({ question, selectedOption, onSelect }) => {
  const opts = question.options || [];

  const getOptionText = (opt) => {
    if (typeof opt === 'string') return opt;
    if (opt && typeof opt === 'object') return opt.text || opt.label || '';
    return String(opt);
  };

  return (
    <div className='space-y-6 animate-fade-up'>
      <div className='prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300'>
        <ReactMarkdown>{question.content}</ReactMarkdown>
      </div>
      <div className='space-y-3'>
        {opts.map((opt, i) => {
          const sel = selectedOption === i;
          const text = getOptionText(opt);
          return (
            <button
              key={i}
              onClick={() => onSelect(sel ? null : i)}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all duration-300
                ${sel
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-glow-sm'
                  : 'border-gray-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-card'
                }
              `}
            >
              <div className='flex items-center gap-3'>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border-2 font-bold text-sm transition-all duration-300 ${
                  sel
                    ? 'border-primary-500 bg-gradient-primary text-white shadow-glow-sm'
                    : 'border-gray-300 dark:border-surface-600 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-surface-700'
                }`}>
                  {sel ? <Check size={18} /> : String.fromCharCode(65 + i)}
                </div>
                <span className={`text-sm font-medium ${sel ? 'text-primary-700 dark:text-primary-300 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                  {text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MCQQuestion;