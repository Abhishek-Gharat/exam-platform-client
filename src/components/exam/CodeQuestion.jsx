import React from 'react';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import { Check } from 'lucide-react';

const getOptionText = (opt) => {
  if (typeof opt === 'string') return opt;
  if (opt && typeof opt === 'object') return opt.text || opt.label || '';
  return String(opt);
};

const CodeQuestion = ({ question, selectedOption, onSelect }) => {
  const options = question.options || [];
  const codeSnippet = question.starterCode || question.starter_code || '';

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{question.content}</ReactMarkdown>
      </div>

      {/* Read-only Code Display */}
      {codeSnippet && (
        <div className="rounded-xl border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-xs font-medium text-gray-400">JavaScript</span>
            <span className="text-xs text-gray-500">Read Only</span>
          </div>
          <Editor
            height={Math.min(Math.max(codeSnippet.split('\n').length * 22, 80), 300) + 'px'}
            language="javascript"
            theme="vs-dark"
            value={codeSnippet}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              automaticLayout: true,
              padding: { top: 12 },
              domReadOnly: true,
              cursorStyle: 'line-thin',
              renderLineHighlight: 'none',
              wordWrap: 'on',
            }}
          />
        </div>
      )}

      {/* Output Options (MCQ Style) */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Select the correct output:
        </h4>
        {options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const letter = String.fromCharCode(65 + i);

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={
                'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ' +
                (isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50')
              }
            >
              {/* Letter Circle */}
              <div
                className={
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm border-2 ' +
                  (isSelected
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400')
                }
              >
                {isSelected ? <Check size={18} /> : letter}
              </div>

              {/* Option Text */}
              <span
                className={
                  'text-sm font-mono ' +
                  (isSelected
                    ? 'text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300')
                }
              >
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