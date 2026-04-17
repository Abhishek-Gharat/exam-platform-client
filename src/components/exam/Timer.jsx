import React from 'react';
import{Clock}from'lucide-react';
import{formatDuration}from'../../utils/formatters';
const Timer=({seconds})=>{
  const cls=seconds<=60?'text-danger-600 dark:text-danger-400 animate-pulse':seconds<=300?'text-warning-600 dark:text-warning-400':'text-gray-900 dark:text-gray-100';
  return(<div className={'flex items-center gap-2 font-mono text-lg font-bold '+cls}><Clock size={20}/><span>{formatDuration(seconds)}</span></div>);
};
export default Timer;
