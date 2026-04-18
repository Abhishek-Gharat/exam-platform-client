import React from 'react';
const PageWrapper=({title,subtitle,actions,children,className=''})=>(
  <div className={'animate-fade-up '+className}>
    {(title||actions)&&<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10'>
      <div className='flex-1'>
        {title&&<h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>{title}</h1>}
        {subtitle&&<p className='mt-3 text-base text-gray-600 dark:text-gray-400'>{subtitle}</p>}
      </div>
      {actions&&<div className='flex items-center gap-3 flex-shrink-0'>{actions}</div>}
    </div>}
    {children}
  </div>
);
export default PageWrapper;
