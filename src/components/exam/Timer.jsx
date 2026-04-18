import React from 'react';
import{Clock}from'lucide-react';
import{formatDuration}from'../../utils/formatters';
const Timer=({seconds})=>{
  const cls=seconds<=60?'text-danger-600 dark:text-danger-400 animate-pulse font-black':seconds<=300?'text-warning-600 dark:text-warning-400 font-bold':'text-gray-900 dark:text-gray-100 font-semibold';
  const bgClass=seconds<=60?'bg-danger-100 dark:bg-danger-900/30':seconds<=300?'bg-warning-100 dark:bg-warning-900/30':'bg-primary-100 dark:bg-primary-900/30';
  return(
    <div className={`flex items-center gap-3 font-mono text-lg ${cls}`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgClass}`}>
        <Clock size={20}/>
      </div>
      <span>{formatDuration(seconds)}</span>
    </div>
  );
};
export default Timer;
