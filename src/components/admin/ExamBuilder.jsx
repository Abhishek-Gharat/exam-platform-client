import React,{useState}from'react';
import Input from'../ui/Input';
import Button from'../ui/Button';
import Badge from'../ui/Badge';
import{Plus,X,GripVertical}from'lucide-react';

const ExamBuilder=({questions=[],onSave,onCancel,initialData,loading=false})=>{
  const[step,setStep]=useState(1);
  const[form,setForm]=useState(initialData||{title:'',description:'',timeLimitMins:60,passingScore:60,randomize:false});
  const[selected,setSelected]=useState(initialData?.questionIds||[]);
  const[search,setSearch]=useState('');
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));

  const filtered=questions.filter(q=>q.title.toLowerCase().includes(search.toLowerCase()));
  const selQuestions=questions.filter(q=>selected.includes(q.id));
  const totalPoints=selQuestions.reduce((s,q)=>s+(q.points||10),0);

  const toggleQ=(id)=>{setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);};

  if(step===1)return(
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Step 1: Basic Info</h3>
      <Input label='Title' value={form.title} onChange={e=>set('title',e.target.value)} required/>
      <div><label className='block text-sm font-medium mb-1'>Description</label><textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={3} className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm'/></div>
      <div className='grid grid-cols-2 gap-4'>
        <Input label='Time Limit (minutes)' type='number' value={form.timeLimitMins} onChange={e=>set('timeLimitMins',Number(e.target.value))}/>
        <Input label='Passing Score (%)' type='number' value={form.passingScore} onChange={e=>set('passingScore',Number(e.target.value))}/>
      </div>
      <label className='flex items-center gap-2 text-sm'><input type='checkbox' checked={form.randomize} onChange={e=>set('randomize',e.target.checked)} className='rounded'/> Randomize question order</label>
      <div className='flex gap-3 pt-4'><Button variant='secondary' onClick={onCancel}>Cancel</Button><Button onClick={()=>setStep(2)}>Next: Add Questions</Button></div>
    </div>
  );

  if(step===2)return(
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Step 2: Select Questions</h3>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div className='border border-gray-200 dark:border-gray-700 rounded-xl p-4'>
          <h4 className='text-sm font-medium mb-2'>Available Questions</h4>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search...' className='w-full mb-3 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800'/>
          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {filtered.map(q=><div key={q.id} className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50'>
              <div className='flex-1 min-w-0'><p className='text-sm font-medium truncate'>{q.title}</p><div className='flex gap-1 mt-1'><Badge variant={q.type==='MCQ'?'mcq':q.type==='EXPLAIN_ME'?'explain':'code'} size='sm'>{q.type}</Badge><Badge variant={q.difficulty.toLowerCase()} size='sm'>{q.difficulty}</Badge></div></div>
              <button onClick={()=>toggleQ(q.id)} className={'p-1 rounded '+(selected.includes(q.id)?'text-danger-500':'text-primary-500')}>{selected.includes(q.id)?<X size={16}/>:<Plus size={16}/>}</button>
            </div>)}
          </div>
        </div>
        <div className='border border-gray-200 dark:border-gray-700 rounded-xl p-4'>
          <h4 className='text-sm font-medium mb-2'>Selected ({selected.length} questions, {totalPoints} points)</h4>
          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {selQuestions.map((q,i)=><div key={q.id} className='flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
              <GripVertical size={14} className='text-gray-400'/><span className='text-sm font-medium flex-1'>{i+1}. {q.title}</span><span className='text-xs text-gray-500'>{q.points}pts</span>
              <button onClick={()=>toggleQ(q.id)} className='text-danger-500'><X size={14}/></button>
            </div>)}
            {selected.length===0&&<p className='text-sm text-gray-400 text-center py-4'>No questions selected</p>}
          </div>
        </div>
      </div>
      <div className='flex gap-3 pt-4'><Button variant='secondary' onClick={()=>setStep(1)}>Back</Button><Button onClick={()=>setStep(3)} disabled={selected.length===0}>Next: Review</Button></div>
    </div>
  );

  return(
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Step 3: Review</h3>
      <div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2 text-sm'>
        <p><strong>Title:</strong> {form.title}</p>
        <p><strong>Time:</strong> {form.timeLimitMins} minutes</p>
        <p><strong>Passing:</strong> {form.passingScore}%</p>
        <p><strong>Questions:</strong> {selected.length}</p>
        <p><strong>Total Points:</strong> {totalPoints}</p>
        <p><strong>Randomize:</strong> {form.randomize?'Yes':'No'}</p>
      </div>
      <div className='flex gap-3 pt-4'>
        <Button variant='secondary' onClick={()=>setStep(2)}>Back</Button>
        <Button variant='secondary' onClick={()=>onSave({...form,timeLimitSecs:form.timeLimitMins*60,questionIds:selected,status:'DRAFT'})} loading={loading}>Save as Draft</Button>
        <Button onClick={()=>onSave({...form,timeLimitSecs:form.timeLimitMins*60,questionIds:selected,status:'PUBLISHED'})} loading={loading}>Publish</Button>
      </div>
    </div>
  );
};
export default ExamBuilder;
