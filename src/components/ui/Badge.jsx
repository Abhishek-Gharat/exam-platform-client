import React from 'react';
const colors={
  pass:'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  fail:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  easy:'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  medium:'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  draft:'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  published:'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  mcq:'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  explain:'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  code:'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  default:'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  success:'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  danger:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info:'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  active:'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};
const Badge=({children,variant='default',size='md',dot=false,className=''})=>(
  <span className={'inline-flex items-center gap-1 font-medium rounded-full '+(size==='sm'?'px-2 py-0.5 text-xs':'px-2.5 py-1 text-xs')+' '+(colors[variant]||colors.default)+' '+className}>
    {dot&&<span className='w-1.5 h-1.5 rounded-full bg-current'/>}{children}
  </span>
);
export default Badge;
