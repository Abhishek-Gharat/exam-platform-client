import React,{useState}from'react';
const Tooltip=({children,content,position='top'})=>{
  const[show,setShow]=useState(false);
  const pos={top:'bottom-full left-1/2 -translate-x-1/2 mb-2',bottom:'top-full left-1/2 -translate-x-1/2 mt-2',left:'right-full top-1/2 -translate-y-1/2 mr-2',right:'left-full top-1/2 -translate-y-1/2 ml-2'};
  return(
    <div className='relative inline-flex' onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show&&content&&<div className={'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-md shadow-lg whitespace-nowrap animate-fade-in pointer-events-none '+(pos[position]||pos.top)}>{content}</div>}
    </div>
  );
};
export default Tooltip;
