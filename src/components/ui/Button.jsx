import React from 'react';
import { Loader2 } from 'lucide-react';
import Spinner from './Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  leftIcon,
  rightIcon,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 shadow-sm',
    danger: 'bg-gradient-to-r from-danger-600 to-danger-500 hover:from-danger-700 hover:to-danger-600 text-white shadow-md hover:shadow-lg',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg',
    link: 'bg-transparent text-primary-600 dark:text-primary-400 hover:underline',
    success: 'bg-gradient-to-r from-success-600 to-success-500 hover:from-success-700 hover:to-success-600 text-white shadow-md hover:shadow-lg',
    accent: 'bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-700 hover:to-accent-600 text-white shadow-md hover:shadow-lg',
    warning: 'bg-gradient-to-r from-warning-600 to-warning-500 hover:from-warning-700 hover:to-warning-600 text-white shadow-md hover:shadow-lg',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs rounded-md',
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-lg',
    lg: 'px-7 py-3 text-base rounded-lg',
    xl: 'px-10 py-4 text-lg rounded-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        exp-btn
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className='animate-spin' />
      ) : leftIcon ? (
        <span className='w-4 h-4 flex items-center'>{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && (
        <span className='w-4 h-4 flex items-center'>{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
