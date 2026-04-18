import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`relative ${className}`}>
    <Search size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500' />
    <input
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className='exp-input pl-10 pr-10 w-full'
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
      >
        <X size={16} />
      </button>
    )}
  </div>
);

export default SearchBar;
