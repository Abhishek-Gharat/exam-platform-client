import React from 'react';
const QuestionNavPanel=({questions=[],answers={},flagged=[],currentIndex,onSelect})=>{
  const getColor=(i,qid)=>{
    if(i===currentIndex)return'bg-primary-600 text-white border-primary-600';
    if(flagged.includes(qid))return'bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-900/30 dark:text-warning-400';
    if(answers[qid])return'bg-success-100 text-success-700 border-success-300 dark:bg-success-900/30 dark:text-success-400';
    return'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400';
  };
  return(
    <div className='exp-card exp-card-flat'>
      <h3 className='text-base font-bold text-gray-900 dark:text-white mb-4'>Questions ({questions.length})</h3>
      <div className='grid grid-cols-4 gap-2 max-h-96 overflow-y-auto pb-2'>
        {questions.map((q,i)=>(
          <button key={q.id||i} onClick={()=>onSelect(i)} style={{animationDelay:`${i*30}ms`}} className={'w-full aspect-square rounded-lg border-2 text-sm font-bold transition-all hover:scale-110 flex items-center justify-center animate-fade-up '+getColor(i,q.id)}>{i+1}</button>
        ))}
      </div>
      <div className='mt-6 space-y-2.5 text-xs'>
        <div className='flex items-center gap-3'><div className='w-4 h-4 rounded bg-gradient-primary shadow-md'/><span className='text-gray-700 dark:text-gray-300 font-medium'>Current</span></div>
        <div className='flex items-center gap-3'><div className='w-4 h-4 rounded bg-success-200 dark:bg-success-700'/><span className='text-gray-700 dark:text-gray-300 font-medium'>Answered</span></div>
        <div className='flex items-center gap-3'><div className='w-4 h-4 rounded bg-warning-200 dark:bg-warning-700'/><span className='text-gray-700 dark:text-gray-300 font-medium'>Flagged</span></div>
        <div className='flex items-center gap-3'><div className='w-4 h-4 rounded bg-gray-200 dark:bg-gray-600'/><span className='text-gray-700 dark:text-gray-300 font-medium'>Unanswered</span></div>
      </div>
    </div>
  );
};
export default QuestionNavPanel;
