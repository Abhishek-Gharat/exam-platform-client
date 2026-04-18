import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = getPages();

  return (
    <div className='flex items-center justify-center gap-2 mt-6'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        <ChevronLeft size={18} />
      </button>

      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className='w-10 h-10 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors'
          >
            1
          </button>
          {pages[0] > 2 && <span className='px-2 text-gray-400'>...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`
            w-10 h-10 rounded-xl text-sm font-semibold transition-all
            ${p === currentPage
              ? 'bg-gradient-primary text-white shadow-glow-sm'
              : 'hover:bg-gray-100 dark:hover:bg-surface-700 text-gray-700 dark:text-gray-300'
            }
          `}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className='px-2 text-gray-400'>...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className='w-10 h-10 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors'
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
