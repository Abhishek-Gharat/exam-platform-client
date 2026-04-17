import React from 'react';
const PageWrapper=({title,subtitle,actions,children,className=''})=>(
  <div className={'animate-fade-in '+className}>
    {(title||actions)&&<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
      <div>{title&&<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{title}</h1>}{subtitle&&<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{subtitle}</p>}</div>
      {actions&&<div className='flex items-center gap-3'>{actions}</div>}
    </div>}
    {children}
  </div>
);
export default PageWrapper;
