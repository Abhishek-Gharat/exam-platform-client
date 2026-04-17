import React from 'react';
import{Search,X}from'lucide-react';
const SearchBar=({value,onChange,placeholder='Search...',className=''})=>(
  <div className={'relative '+className}>
    <Search size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'/>
    <input type='text' value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      className='w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors'/>
    {value&&<button onClick={()=>onChange('')} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'><X size={16}/></button>}
  </div>
);
export default SearchBar;
