import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Check } from 'lucide-react';

const MCQQuestion = ({ question, selectedOption, onSelect }) => {
  const opts = question.options || [];

  // Handle both formats: ["string"] or [{label, text}]
  const getOptionText = (opt) => {
    if (typeof opt === 'string') return opt;
    if (opt && typeof opt === 'object') return opt.text || opt.label || '';
    return String(opt);
  };

  return (
    <div className='space-y-6'>
      <div className='prose dark:prose-invert max-w-none'>
        <ReactMarkdown>{question.content}</ReactMarkdown>
      </div>
      <div className='space-y-3'>
        {opts.map((opt, i) => {
          const sel = selectedOption === i;
          const text = getOptionText(opt);
          return (
            <button key={i} onClick={() => onSelect(sel ? null : i)}
              className={'w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ' +
                (sel
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 bg-white dark:bg-gray-800')}>
              <div className='flex items-center gap-3'>
                <div className={'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ' +
                  (sel
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-gray-300 dark:border-gray-500')}>
                  {sel ? <Check size={16} /> : <span className='text-sm font-medium text-gray-500'>{String.fromCharCode(65 + i)}</span>}
                </div>
                <span className={'text-sm ' +
                  (sel
                    ? 'text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300')}>{text}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MCQQuestion;