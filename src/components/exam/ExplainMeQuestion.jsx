import React,{useState}from'react';
import ReactMarkdown from'react-markdown';
import{Eye,Edit3}from'lucide-react';
const ExplainMeQuestion=({question,answer,onChange})=>{
  const[preview,setPreview]=useState(false);
  const count=(answer||'').length;
  return(
    <div className='space-y-6'>
      <div className='prose dark:prose-invert max-w-none'><ReactMarkdown>{question.content}</ReactMarkdown></div>
      <div>
        <div className='flex items-center justify-between mb-2'>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Your Answer</label>
          <button onClick={()=>setPreview(!preview)} className='flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700'>
            {preview?<Edit3 size={14}/>:<Eye size={14}/>}{preview?'Edit':'Preview'}
          </button>
        </div>
        {preview?<div className='min-h-[180px] p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 prose dark:prose-invert max-w-none'>{answer?<ReactMarkdown>{answer}</ReactMarkdown>:<p className='text-gray-400 italic'>Nothing to preview</p>}</div>
        :<textarea value={answer||''} onChange={e=>onChange(e.target.value)} rows={8} maxLength={5000} placeholder='Type your answer here... (Markdown supported)'
          className='w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y min-h-[180px] text-sm'/>}
        <div className='flex justify-end mt-1'><span className={'text-xs '+(count>4500?'text-danger-500':'text-gray-400')}>{count}/5000</span></div>
      </div>
    </div>
  );
};
export default ExplainMeQuestion;
