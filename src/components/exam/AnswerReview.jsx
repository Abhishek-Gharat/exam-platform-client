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
    if (pct >= 40) return 'bg-yellow-500';
    return 'bg-danger-500';
  };

  const getScoreTextColor = (pct) => {
    if (pct >= 70) return 'text-success-600 dark:text-success-400';
    if (pct >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-danger-600 dark:text-danger-400';
  };

  const codeSnippet = q.starterCode || q.starter_code || '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ' +
              (result.isCorrect ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600')
            }
          >
            {result.isCorrect ? <Check size={16} /> : <X size={16} />}
          </div>
          <span className="font-medium text-gray-900 dark:text-white">Q{index + 1}</span>
          <Badge variant={typeBadge} size="sm">{q.type}</Badge>
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">{q.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={'text-sm font-medium ' + (q.type === 'EXPLAIN_ME' ? getScoreTextColor(scorePercent) : '')}>
            {result.pointsEarned}/{result.pointsMax}
          </span>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded Content */}
      {open && (
        <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Question Content */}
          <div className="prose dark:prose-invert max-w-none mb-4 text-sm">
            <ReactMarkdown>{q.content}</ReactMarkdown>
          </div>

          {/* ============ MCQ ============ */}
          {q.type === 'MCQ' && q.options && (
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctOption;
                const isSelected = result.answer?.selectedOption === i;
                return (
                  <div
                    key={i}
                    className={
                      'p-3 rounded-lg border ' +
                      (isCorrect
                        ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
                        : isSelected
                        ? 'border-danger-500 bg-danger-50 dark:bg-danger-900/20'
                        : 'border-gray-200 dark:border-gray-600')
                    }
                  >
                    <span className="text-sm">
                      {String.fromCharCode(65 + i)}. {getOptionText(opt)}
                    </span>
                    {isCorrect && <span className="ml-2 text-xs text-success-600 font-medium">✓ Correct</span>}
                    {isSelected && !isCorrect && (
                      <span className="ml-2 text-xs text-danger-600 font-medium">✗ Your answer</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ============ WRITE_CODE (Output Prediction) ============ */}
          {q.type === 'WRITE_CODE' && (
            <div className="space-y-4">
              {/* Code Snippet Display */}
              {codeSnippet && (
                <div className="rounded-xl border border-gray-700 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <Code2 size={14} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-400">JavaScript</span>
                  </div>
                  <Editor
                    height={Math.min(Math.max(codeSnippet.split('\n').length * 22, 80), 250) + 'px'}
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
                      renderLineHighlight: 'none',
                      wordWrap: 'on',
                    }}
                  />
                </div>
              )}

              {/* Output Options with correct/incorrect highlighting */}
              {q.options && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Output Options:</h5>
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correctOption;
                    const isSelected = result.answer?.selectedOption === i;
                    return (
                      <div
                        key={i}
                        className={
                          'p-3 rounded-lg border ' +
                          (isCorrect
                            ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
                            : isSelected
                            ? 'border-danger-500 bg-danger-50 dark:bg-danger-900/20'
                            : 'border-gray-200 dark:border-gray-600')
                        }
                      >
                        <span className="text-sm font-mono">
                          {String.fromCharCode(65 + i)}. {getOptionText(opt)}
                        </span>
                        {isCorrect && (
                          <span className="ml-2 text-xs text-success-600 font-medium">✓ Correct Output</span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className="ml-2 text-xs text-danger-600 font-medium">✗ Your answer</span>
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
            <div className="space-y-4">
              {/* AI Grading Result Box */}
              <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    AI Grading Result
                  </span>
                </div>
                {/* Score Progress Bar */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={'h-full rounded-full transition-all duration-500 ' + getScoreColor(scorePercent)}
                      style={{ width: scorePercent + '%' }}
                    ></div>
                  </div>
                  <span className={'text-sm font-bold ' + getScoreTextColor(scorePercent)}>
                    {result.pointsEarned}/{result.pointsMax} ({scorePercent}%)
                  </span>
                </div>
                {/* AI Feedback */}
                {result.aiFeedback && (
                  <div className="text-sm text-indigo-700 dark:text-indigo-300 mt-2">
                    <strong>Feedback:</strong> {result.aiFeedback}
                  </div>
                )}
                {!result.aiFeedback && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                    No AI feedback available for this answer.
                  </div>
                )}
              </div>

              {/* Your Answer vs Model Answer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Your Answer</h5>
                  <div
                    className={
                      'p-3 rounded-lg text-sm ' +
                      (scorePercent >= 70
                        ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-700'
                        : scorePercent >= 40
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700'
                        : 'bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-700')
                    }
                  >
                    {result.answer?.writtenAnswer || 'No answer provided'}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Model Answer</h5>
                  <div className="p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-700 text-sm">
                    {q.modelAnswer || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ Explanation (all types) ============ */}
          {q.explanation && (
            <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
              <strong>Explanation:</strong> {q.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerReview;