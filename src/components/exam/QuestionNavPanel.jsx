import React from 'react';
import { Flag, CheckCircle, Circle, ArrowRight } from 'lucide-react';

const QuestionNavPanel = ({ questions = [], answers = {}, flagged = [], currentIndex, onSelect }) => {

  const answeredCount = questions.filter(q => answers[q.id]).length;
  const flaggedCount = flagged.length;

  const getStyle = (i, qid) => {
    if (i === currentIndex)
      return 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-500/30 scale-105';
    if (flagged.includes(qid))
      return 'bg-warning-50 text-warning-700 border-warning-300 dark:bg-warning-900/20 dark:text-warning-400 dark:border-warning-700';
    if (answers[qid])
      return 'bg-success-50 text-success-700 border-success-300 dark:bg-success-900/20 dark:text-success-400 dark:border-success-700';
    return 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700';
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

      {/* Header with stats */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2">
          Questions
        </h3>
        {/* Mini stats — stacks nicely on all sizes */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20 px-1.5 py-0.5 rounded-md">
            <CheckCircle size={9} />
            {answeredCount}/{questions.length}
          </span>
          {flaggedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/20 px-1.5 py-0.5 rounded-md">
              <Flag size={9} />
              {flaggedCount}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
            <Circle size={9} />
            {questions.length - answeredCount}
          </span>
        </div>
      </div>

      {/* Question Grid */}
      <div className="p-3">
        {/* ★ Responsive grid: 5 cols mobile landscape, 6 cols on wider, 4 on sidebar */}
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-1.5 max-h-[50vh] lg:max-h-[calc(100vh-320px)] overflow-y-auto pr-1 scrollbar-thin">
          {questions.map((q, i) => (
            <button
              key={q.id || i}
              onClick={() => onSelect(i)}
              className={`
                w-full aspect-square rounded-xl border-2 
                text-xs font-bold transition-all duration-200
                hover:scale-105 active:scale-95
                flex items-center justify-center
                ${getStyle(i, q.id)}
              `}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Legend — horizontal on mobile, vertical on desktop */}
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-surface-900/30">
        <div className="flex lg:flex-col gap-3 lg:gap-1.5 flex-wrap">
          {[
            { color: 'bg-primary-500', label: 'Current' },
            { color: 'bg-success-400', label: 'Answered' },
            { color: 'bg-warning-400', label: 'Flagged' },
            { color: 'bg-gray-300 dark:bg-gray-600', label: 'Unanswered' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm ${color} flex-shrink-0`} />
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionNavPanel;