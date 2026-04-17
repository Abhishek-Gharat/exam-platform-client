import React,{useEffect,useCallback}from'react';
import{X}from'lucide-react';
const szs={sm:'max-w-md',md:'max-w-lg',lg:'max-w-2xl',xl:'max-w-4xl'};
const Modal=({isOpen,onClose,title,children,footer,size='md',closeOnOverlay=true})=>{
  const onEsc=useCallback((e)=>{if(e.key==='Escape')onClose();},[onClose]);
  useEffect(()=>{if(!isOpen)return;document.addEventListener('keydown',onEsc);document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',onEsc);document.body.style.overflow='';};},[isOpen,onEsc]);
  if(!isOpen)return null;
  return(
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='fixed inset-0 bg-black/50 animate-fade-in' onClick={closeOnOverlay?onClose:undefined}/>
      <div className={'relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-h-[90vh] flex flex-col animate-slide-in z-10 '+(szs[size]||szs.md)}>
        {title&&<div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700'><h2 className='text-lg font-semibold text-gray-900 dark:text-white'>{title}</h2><button onClick={onClose} className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'><X size={20}/></button></div>}
        <div className='flex-1 overflow-y-auto px-6 py-4'>{children}</div>
        {footer&&<div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3'>{footer}</div>}
      </div>
    </div>
  );
};
export default Modal;
