import React,{useState}from'react';
import{QUESTION_TYPE_LIST}from'../../constants/questionTypes';
import{DIFFICULTY_LIST}from'../../constants/difficulty';
import Button from'../ui/Button';
import Input from'../ui/Input';
import{CircleDot,FileText,Code}from'lucide-react';

const icons={CircleDot,FileText,Code};

const QuestionForm=({initialData,onSave,onCancel,loading=false})=>{
  const[step,setStep]=useState(initialData?2:1);
  const[form,setForm]=useState(initialData||{type:'',title:'',topic:'',difficulty:'EASY',tags:'',points:10,content:'',options:['','','',''],correctOption:0,modelAnswer:'',starterCode:'',expectedOutput:''});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const setOption=(i,v)=>{const o=[...form.options];o[i]=v;set('options',o);};

  if(step===1)return(
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Select Question Type</h3>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {QUESTION_TYPE_LIST.map(t=>{const Icon=icons[t.icon]||CircleDot;return(
          <button key={t.value} onClick={()=>{set('type',t.value);setStep(2);}} className='p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-primary-500 transition-all text-center hover:shadow-md'>
            <Icon size={32} className='mx-auto mb-3 text-primary-600'/><h4 className='font-semibold mb-1'>{t.label}</h4><p className='text-xs text-gray-500'>{t.description}</p>
          </button>
        );})}
      </div>
    </div>
  );

  return(
    <div className='space-y-4'>
      <Input label='Title' value={form.title} onChange={e=>set('title',e.target.value)} required/>
      <div className='grid grid-cols-2 gap-4'>
        <Input label='Topic' value={form.topic} onChange={e=>set('topic',e.target.value)} required/>
        <div><label className='block text-sm font-medium mb-1'>Difficulty</label><select value={form.difficulty} onChange={e=>set('difficulty',e.target.value)} className='w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm dark:bg-gray-800'>{DIFFICULTY_LIST.map(d=><option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <Input label='Tags (comma separated)' value={form.tags} onChange={e=>set('tags',e.target.value)}/>
        <Input label='Points' type='number' value={form.points} onChange={e=>set('points',Number(e.target.value))}/>
      </div>
      <div><label className='block text-sm font-medium mb-1'>Content (Markdown)</label><textarea value={form.content} onChange={e=>set('content',e.target.value)} rows={5} className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm' placeholder='Question content...'/></div>
      {form.type==='MCQ'&&<>
        <div className='space-y-2'>{form.options.map((o,i)=><div key={i} className='flex items-center gap-2'>
          <input type='radio' name='correct' checked={form.correctOption===i} onChange={()=>set('correctOption',i)} className='text-primary-600'/>
          <Input placeholder={'Option '+(i+1)} value={o} onChange={e=>setOption(i,e.target.value)} className='flex-1'/>
        </div>)}</div>
        <div><label className='block text-sm font-medium mb-1'>Explanation</label><textarea value={form.explanation||''} onChange={e=>set('explanation',e.target.value)} rows={3} className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm'/></div>
      </>}
      {form.type==='EXPLAIN_ME'&&<div><label className='block text-sm font-medium mb-1'>Model Answer</label><textarea value={form.modelAnswer} onChange={e=>set('modelAnswer',e.target.value)} rows={4} className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm'/></div>}
      {form.type==='WRITE_CODE'&&<>
        <div><label className='block text-sm font-medium mb-1'>Starter Code</label><textarea value={form.starterCode} onChange={e=>set('starterCode',e.target.value)} rows={4} className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm font-mono'/></div>
        <Input label='Expected Output' value={form.expectedOutput} onChange={e=>set('expectedOutput',e.target.value)}/>
      </>}
      <div className='flex gap-3 pt-4'>
        {!initialData&&<Button variant='secondary' onClick={()=>setStep(1)}>Back</Button>}
        <Button variant='secondary' onClick={onCancel}>Cancel</Button>
        <Button onClick={()=>onSave(form)} loading={loading}>Save Question</Button>
      </div>
    </div>
  );
};
export default QuestionForm;
