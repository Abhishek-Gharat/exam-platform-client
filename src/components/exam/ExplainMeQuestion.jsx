import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Edit3 } from 'lucide-react';

const ExplainMeQuestion = ({ question, answer, onChange }) => {
  const [preview, setPreview] = useState(false);
  const count = (answer || '').length;
  const isNearLimit = count > 4500;

  return (
    <div className='space-y-6 animate-fade-up'>
      <div className='prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300'>
        <ReactMarkdown>{question.content}</ReactMarkdown>
      </div>

      <div>
        <div className='flex items-center justify-between mb-3'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Your Answer</label>
          <button
            onClick={() => setPreview(!preview)}
            className='flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors'
          >
            {preview ? <Edit3 size={14} /> : <Eye size={14} />}
            <span className='font-medium'>{preview ? 'Edit' : 'Preview'}</span>
          </button>
        </div>

        {preview ? (
          <div className='exp-card-flat min-h-[200px] p-5 prose dark:prose-invert max-w-none'>
            {answer ? (
              <ReactMarkdown>{answer}</ReactMarkdown>
            ) : (
              <p className='text-gray-400 italic'>Nothing to preview</p>
            )}
          </div>
        ) : (
          <textarea
            value={answer || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={8}
            maxLength={5000}
            placeholder='Type your answer here... (Markdown supported)'
            className='exp-input w-full p-4 resize-y min-h-[200px] font-mono text-sm'
          />
        )}

        <div className='flex justify-end mt-2'>
          <span className={`text-xs font-semibold ${isNearLimit ? 'text-danger-600 dark:text-danger-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {count}/5000
          </span>
        </div>

        {isNearLimit && (
          <div className='progress-bar mt-2'>
            <div
              className='progress-bar-fill'
              style={{ width: `${Math.min(count / 50, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplainMeQuestion;
