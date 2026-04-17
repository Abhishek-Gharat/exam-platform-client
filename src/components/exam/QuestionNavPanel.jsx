import React from 'react';
const QuestionNavPanel=({questions=[],answers={},flagged=[],currentIndex,onSelect})=>{
  const getColor=(i,qid)=>{
    if(i===currentIndex)return'bg-primary-600 text-white border-primary-600';
    if(flagged.includes(qid))return'bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-900/30 dark:text-warning-400';
    if(answers[qid])return'bg-success-100 text-success-700 border-success-300 dark:bg-success-900/30 dark:text-success-400';
    return'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400';
  };
  return(
    <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4'>
      <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>Questions</h3>
      <div className='grid grid-cols-4 gap-2 max-h-80 overflow-y-auto'>
        {questions.map((q,i)=><button key={q.id||i} onClick={()=>onSelect(i)} className={'w-full aspect-square rounded-lg border-2 text-sm font-bold transition-all hover:scale-105 flex items-center justify-center '+getColor(i,q.id)}>{i+1}</button>)}
      </div>
      <div className='mt-4 space-y-1.5 text-xs'>
        <div className='flex items-center gap-2'><span className='w-3 h-3 rounded bg-primary-600'/><span className='text-gray-500'>Current</span></div>
        <div className='flex items-center gap-2'><span className='w-3 h-3 rounded bg-success-200'/><span className='text-gray-500'>Answered</span></div>
        <div className='flex items-center gap-2'><span className='w-3 h-3 rounded bg-warning-200'/><span className='text-gray-500'>Flagged</span></div>
        <div className='flex items-center gap-2'><span className='w-3 h-3 rounded bg-gray-200'/><span className='text-gray-500'>Unanswered</span></div>
      </div>
    </div>
  );
};
export default QuestionNavPanel;
