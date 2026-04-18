import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  placeholder,
  leftIcon,
  disabled = false,
  required = false,
  className = '',
  name,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
          {label}
          {required && <span className='text-accent-500 ml-1'>*</span>}
        </label>
      )}
      <div className='relative'>
        {leftIcon && (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500'>
            {leftIcon}
          </div>
        )}
        <input
          name={name}
          type={isPw ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            exp-input
            ${leftIcon ? 'pl-10' : ''}
            ${isPw ? 'pr-10' : ''}
            ${error ? 'border-danger-500 focus:ring-danger-500/10' : 'focus:ring-primary-500/10'}
            w-full
          `}
          {...props}
        />
        {isPw && (
          <button
            type='button'
            onClick={() => setShow(!show)}
            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <div className='mt-2 flex items-center gap-1 text-sm text-danger-600 dark:text-danger-400'>
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      {helperText && !error && (
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
