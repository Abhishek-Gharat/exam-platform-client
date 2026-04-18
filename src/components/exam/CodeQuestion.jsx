import React from 'react';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import { Check, Code2 } from 'lucide-react';

const getOptionText = (opt) => {
  if (typeof opt === 'string') return opt;
  if (opt && typeof opt === 'object') return opt.text || opt.label || '';
  return String(opt);
};

const CodeQuestion = ({ question, selectedOption, onSelect }) => {
  const options = question.options || [];
  const codeSnippet = question.starterCode || question.starter_code || '';

  return (
    <div className='space-y-6 animate-fade-up'>
      {/* Question Text */}
      <div className='prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300'>
        <ReactMarkdown>{question.content}</ReactMarkdown>
      </div>

      {/* Read-only Code Display */}
      {codeSnippet && (
        <div className='exp-card-flat overflow-hidden'>
          <div className='flex items-center justify-between px-4 py-3 bg-gradient-to-r from-surface-800 to-surface-900 dark:from-surface-800 dark:to-surface-900 border-b border-surface-700'>
            <div className='flex items-center gap-2'>
              <Code2 size={14} className='text-primary-400' />
              <span className='text-xs font-semibold text-primary-300 uppercase tracking-wider'>JavaScript</span>
            </div>
            <span className='text-xs text-gray-500 dark:text-gray-400 font-medium'>Read Only</span>
          </div>
          <Editor
            height={Math.min(Math.max(codeSnippet.split('\n').length * 22, 100), 320) + 'px'}
            language='javascript'
            theme='vs-dark'
            value={codeSnippet}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              lineNumbers: 'on',
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              domReadOnly: true,
              cursorStyle: 'line-thin',
              renderLineHighlight: 'none',
              wordWrap: 'on',
            }}
          />
        </div>
      )}

      {/* Output Options */}
      <div className='space-y-3'>
        <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
          <span className='w-5 h-5 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-xs font-bold'>?</span>
          Select the correct output:
        </h4>
        {options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const letter = String.fromCharCode(65 + i);

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3
                ${isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-glow-sm'
                  : 'border-gray-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-card'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm border-2 transition-all
                ${isSelected
                  ? 'border-primary-500 bg-gradient-primary text-white shadow-glow-sm'
                  : 'border-gray-300 dark:border-surface-600 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-surface-700'
                }
              `}>
                {isSelected ? <Check size={18} /> : letter}
              </div>

              <span className={`text-sm font-mono ${
                isSelected
                  ? 'text-primary-700 dark:text-primary-300 font-semibold'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {getOptionText(opt)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CodeQuestion;