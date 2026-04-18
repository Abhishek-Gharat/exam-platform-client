import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import Badge from '../ui/Badge';
import { ChevronDown, ChevronUp, Check, X, Bot, Code2 } from 'lucide-react';

const getOptionText = (opt) => {
  if (typeof opt === 'string') return opt;
  if (opt && typeof opt === 'object') return opt.text || opt.label || '';
  return String(opt);
};

const AnswerReview = ({ result, index }) => {
  const [open, setOpen] = useState(false);
  const q = result.question || {};
  const typeBadge = q.type === 'MCQ' ? 'mcq' : q.type === 'EXPLAIN_ME' ? 'explain' : 'code';

  const scorePercent = result.pointsMax > 0 ? Math.round((result.pointsEarned / result.pointsMax) * 100) : 0;

  const getScoreColor = (pct) => {
    if (pct >= 70) return 'bg-success-500';
    if (pct >= 40) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  const getScoreTextColor = (pct) => {
    if (pct >= 70) return 'text-success-600 dark:text-success-400';
    if (pct >= 40) return 'text-warning-600 dark:text-warning-400';
    return 'text-danger-600 dark:text-danger-400';
  };

  const codeSnippet = q.starterCode || q.starter_code || '';

  return (
    <div className={`exp-card-flat border-l-4 transition-all duration-300 ${result.isCorrect ? 'border-l-success-500' : 'border-l-danger-500'} animate-fade-up`}>
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className='w-full px-6 py-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-200'
      >
        <div className='flex items-center gap-3'>
          <div
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm border-2
              ${result.isCorrect 
                ? 'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400' 
                : 'border-danger-500 bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400'}
            `}
          >
            {result.isCorrect ? <Check size={18} /> : <X size={18} />}
          </div>
          <span className='font-bold text-gray-900 dark:text-white'>Q{index + 1}</span>
          <Badge variant={typeBadge} size='sm'>{q.type}</Badge>
          <span className='text-sm text-gray-500 dark:text-gray-400 hidden sm:inline font-medium'>{q.title}</span>
        </div>
        <div className='flex items-center gap-3'>
          <span className={`text-sm font-bold ${q.type === 'EXPLAIN_ME' ? getScoreTextColor(scorePercent) : 'text-gray-700 dark:text-gray-300'}`}>
            {result.pointsEarned}/{result.pointsMax}
          </span>
          {open ? <ChevronUp size={18} className='text-primary-500' /> : <ChevronDown size={18} className='text-gray-400' />}
        </div>
      </button>

      {/* Expanded Content */}
      {open && (
        <div className='px-6 pb-4 border-t border-gray-200 dark:border-surface-700 pt-4 space-y-4'>
          {/* Question Content */}
          <div className='prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300'>
            <ReactMarkdown>{q.content}</ReactMarkdown>
          </div>

          {/* ============ MCQ ============ */}
          {q.type === 'MCQ' && q.options && (
            <div className='space-y-2'>
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctOption;
                const isSelected = result.answer?.selectedOption === i;
                return (
                  <div
                    key={i}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${isCorrect
                        ? 'border-success-500 bg-success-50 dark:bg-success-900/15 shadow-glow-success'
                        : isSelected
                        ? 'border-danger-500 bg-danger-50 dark:bg-danger-900/15 shadow-glow'
                        : 'border-gray-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800'}
                    `}
                  >
                    <div className='flex items-start gap-3'>
                      <span className='font-bold text-gray-700 dark:text-gray-300 text-sm'>{String.fromCharCode(65 + i)}.</span>
                      <span className='text-sm text-gray-700 dark:text-gray-300'>{getOptionText(opt)}</span>
                    </div>
                    {isCorrect && (
                      <span className='ml-7 text-xs text-success-600 dark:text-success-400 font-bold mt-1 inline-block'>✓ Correct Answer</span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className='ml-7 text-xs text-danger-600 dark:text-danger-400 font-bold mt-1 inline-block'>✗ Your Answer</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ============ WRITE_CODE (Output Prediction) ============ */}
          {q.type === 'WRITE_CODE' && (
            <div className='space-y-4'>
              {/* Code Snippet Display */}
              {codeSnippet && (
                <div className='exp-card-flat overflow-hidden'>
                  <div className='flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-surface-800 to-surface-900 dark:from-surface-800 dark:to-surface-900 border-b border-surface-700'>
                    <Code2 size={14} className='text-primary-400' />
                    <span className='text-xs font-semibold text-primary-300 uppercase tracking-wider'>JavaScript</span>
                  </div>
                  <Editor
                    height={Math.min(Math.max(codeSnippet.split('\n').length * 22, 100), 250) + 'px'}
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
                      renderLineHighlight: 'none',
                      wordWrap: 'on',
                    }}
                  />
                </div>
              )}

              {/* Output Options with correct/incorrect highlighting */}
              {q.options && (
                <div className='space-y-2'>
                  <h5 className='text-sm font-bold text-gray-900 dark:text-white'>Output Options:</h5>
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correctOption;
                    const isSelected = result.answer?.selectedOption === i;
                    return (
                      <div
                        key={i}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${isCorrect
                            ? 'border-success-500 bg-success-50 dark:bg-success-900/15 shadow-glow-success'
                            : isSelected
                            ? 'border-danger-500 bg-danger-50 dark:bg-danger-900/15 shadow-glow'
                            : 'border-gray-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800'}
                        `}
                      >
                        <div className='flex items-start gap-3'>
                          <span className='font-bold text-gray-700 dark:text-gray-300 text-sm'>{String.fromCharCode(65 + i)}.</span>
                          <span className='text-sm font-mono text-gray-700 dark:text-gray-300'>{getOptionText(opt)}</span>
                        </div>
                        {isCorrect && (
                          <span className='ml-7 text-xs text-success-600 dark:text-success-400 font-bold mt-1 inline-block'>✓ Correct Output</span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className='ml-7 text-xs text-danger-600 dark:text-danger-400 font-bold mt-1 inline-block'>✗ Your Answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============ EXPLAIN_ME ============ */}
          {q.type === 'EXPLAIN_ME' && (
            <div className='space-y-4'>
              {/* AI Grading Result Box */}
              <div className='p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/10 border-2 border-primary-300 dark:border-primary-700'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center'>
                    <Bot size={16} className='text-white' />
                  </div>
                  <span className='text-sm font-bold text-primary-700 dark:text-primary-300'>
                    AI Grading Result
                  </span>
                </div>
                {/* Score Progress Bar */}
                <div className='flex items-center gap-3 mb-3'>
                  <div className='flex-1 h-3 bg-primary-200 dark:bg-primary-900/40 rounded-full overflow-hidden'>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getScoreColor(scorePercent)}`}
                      style={{ width: scorePercent + '%' }}
                    />
                  </div>
                  <span className={`text-sm font-bold whitespace-nowrap ${getScoreTextColor(scorePercent)}`}>
                    {result.pointsEarned}/{result.pointsMax} ({scorePercent}%)
                  </span>
                </div>
                {/* AI Feedback */}
                {result.aiFeedback && (
                  <div className='text-sm text-primary-700 dark:text-primary-300 font-medium'>
                    <strong>Feedback:</strong> {result.aiFeedback}
                  </div>
                )}
                {!result.aiFeedback && (
                  <div className='text-sm text-gray-500 dark:text-gray-400 italic'>
                    No AI feedback available for this answer.
                  </div>
                )}
              </div>

              {/* Your Answer vs Model Answer */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <h5 className='text-sm font-bold mb-2 text-gray-900 dark:text-white'>Your Answer</h5>
                  <div
                    className={`
                      p-4 rounded-lg text-sm border-l-4
                      ${scorePercent >= 70
                        ? 'bg-success-50 dark:bg-success-900/15 border-l-success-500 text-gray-700 dark:text-gray-300'
                        : scorePercent >= 40
                        ? 'bg-warning-50 dark:bg-warning-900/15 border-l-warning-500 text-gray-700 dark:text-gray-300'
                        : 'bg-danger-50 dark:bg-danger-900/15 border-l-danger-500 text-gray-700 dark:text-gray-300'}
                    `}
                  >
                    {result.answer?.writtenAnswer || 'No answer provided'}
                  </div>
                </div>
                <div>
                  <h5 className='text-sm font-bold mb-2 text-gray-900 dark:text-white'>Model Answer</h5>
                  <div className='p-4 rounded-lg bg-success-50 dark:bg-success-900/15 border-l-4 border-l-success-500 text-sm text-gray-700 dark:text-gray-300'>
                    {q.modelAnswer || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ Explanation (all types) ============ */}
          {q.explanation && (
            <div className='p-4 rounded-xl bg-gradient-to-r from-info-50 to-info-100 dark:from-info-900/20 dark:to-info-800/10 border-l-4 border-l-info-500 text-sm text-info-700 dark:text-info-300'>
              <strong className='block mb-1'>Explanation:</strong> 
              <p>{q.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerReview;