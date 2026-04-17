import React from 'react';
import{ChevronLeft,ChevronRight}from'lucide-react';
const Pagination=({currentPage,totalPages,onPageChange})=>{
  if(totalPages<=1)return null;
  const getPages=()=>{const p=[];let s=Math.max(1,currentPage-2),e=Math.min(totalPages,s+4);if(e-s<4)s=Math.max(1,e-4);for(let i=s;i<=e;i++)p.push(i);return p;};
  const pages=getPages();
  return(
    <div className='flex items-center justify-center gap-1 mt-4'>
      <button onClick={()=>onPageChange(currentPage-1)} disabled={currentPage===1} className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'><ChevronLeft size={18}/></button>
      {pages[0]>1&&<><button onClick={()=>onPageChange(1)} className='w-9 h-9 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700'>1</button>{pages[0]>2&&<span className='px-1 text-gray-400'>...</span>}</>}
      {pages.map(p=><button key={p} onClick={()=>onPageChange(p)} className={'w-9 h-9 rounded-lg text-sm font-medium transition-colors '+(p===currentPage?'bg-primary-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300')}>{p}</button>)}
      {pages[pages.length-1]<totalPages&&<>{pages[pages.length-1]<totalPages-1&&<span className='px-1 text-gray-400'>...</span>}<button onClick={()=>onPageChange(totalPages)} className='w-9 h-9 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700'>{totalPages}</button></>}
      <button onClick={()=>onPageChange(currentPage+1)} disabled={currentPage===totalPages} className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'><ChevronRight size={18}/></button>
    </div>
  );
};
export default Pagination;
