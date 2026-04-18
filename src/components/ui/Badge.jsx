import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'md', dot = false, className = '' }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800',
    secondary: 'bg-gray-100 text-gray-700 dark:bg-surface-800 dark:text-gray-300 border border-gray-200 dark:border-surface-700',
    success: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300 border border-success-200 dark:border-success-800',
    danger: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300 border border-danger-200 dark:border-danger-800',
    warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300 border border-warning-200 dark:border-warning-800',
    info: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300 border border-info-200 dark:border-info-800',
    mcq: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800',
    explain: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300 border border-info-200 dark:border-info-800',
    code: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300 border border-warning-200 dark:border-warning-800',
    pass: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300 border border-success-200 dark:border-success-800',
    fail: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300 border border-danger-200 dark:border-danger-800',
    draft: 'bg-gray-100 text-gray-700 dark:bg-surface-800 dark:text-gray-300 border border-gray-200 dark:border-surface-700',
    published: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300 border border-success-200 dark:border-success-800',
    easy: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300 border border-success-200 dark:border-success-800',
    medium: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300 border border-warning-200 dark:border-warning-800',
    hard: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300 border border-danger-200 dark:border-danger-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold',
    md: 'px-3 py-1 text-xs uppercase tracking-wider font-semibold',
    lg: 'px-4 py-1.5 text-sm font-semibold',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}>
      {dot && <span className='w-2 h-2 rounded-full bg-current' />}
      {children}
    </span>
  );
};

export default Badge;
