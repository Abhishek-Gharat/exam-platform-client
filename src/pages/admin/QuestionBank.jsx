import React,{useEffect,useState}from'react';
import{Plus,Upload,Edit,Trash2}from'lucide-react';
import{questionsAPI}from'../../api/questionsAPI';
import{QUESTION_TYPES}from'../../constants/questionTypes';
import{DIFFICULTY_LIST}from'../../constants/difficulty';
import PageWrapper from'../../components/layout/PageWrapper';
import Button from'../../components/ui/Button';
import Badge from'../../components/ui/Badge';
import Modal from'../../components/ui/Modal';
import SearchBar from'../../components/ui/SearchBar';
import Spinner from'../../components/ui/Spinner';
import Pagination from'../../components/ui/Pagination';
import ConfirmDialog from'../../components/ui/ConfirmDialog';
import EmptyState from'../../components/ui/EmptyState';
import QuestionForm from'../../components/admin/QuestionForm';
import BulkImport from'../../components/admin/BulkImport';
import toast from'react-hot-toast';

const QuestionBank=()=>{
  const[questions,setQuestions]=useState([]);
  const[loading,setLoading]=useState(true);
  const[search,setSearch]=useState('');
  const[typeFilter,setTypeFilter]=useState('');
  const[diffFilter,setDiffFilter]=useState('');
  const[page,setPage]=useState(1);
  const[totalPages,setTotalPages]=useState(1);
  const[showForm,setShowForm]=useState(false);
  const[showBulk,setShowBulk]=useState(false);
  const[editData,setEditData]=useState(null);
  const[deleteId,setDeleteId]=useState(null);
  const[saving,setSaving]=useState(false);

  const load=async()=>{
    setLoading(true);
    try{const r=await questionsAPI.getQuestions({search,type:typeFilter,difficulty:diffFilter,page});setQuestions(r.data.questions||[]);setTotalPages(r.data.totalPages||1);}
    catch{toast.error('Failed to load questions');}
    finally{setLoading(false);}
  };

  useEffect(()=>{load();},[search,typeFilter,diffFilter,page]);

  const handleSave=async(data)=>{
    setSaving(true);
    try{
      if(editData){await questionsAPI.updateQuestion(editData.id,data);toast.success('Question updated');}
      else{await questionsAPI.createQuestion(data);toast.success('Question created');}
      setShowForm(false);setEditData(null);load();
    }catch{toast.error('Save failed');}
    finally{setSaving(false);}
  };

  const handleDelete=async()=>{
    try{await questionsAPI.deleteQuestion(deleteId);toast.success('Question deleted');setDeleteId(null);load();}
    catch{toast.error('Delete failed');}
  };

  return(
    <PageWrapper title='Question Bank' subtitle='Manage exam questions'
      actions={<><Button variant='secondary' onClick={()=>setShowBulk(true)} leftIcon={<Upload size={16}/>}>Bulk Import</Button><Button onClick={()=>{setEditData(null);setShowForm(true);}} leftIcon={<Plus size={16}/>}>Add Question</Button></>}>
      <div className='flex flex-wrap gap-3 mb-6'>
        <SearchBar value={search} onChange={setSearch} placeholder='Search questions...' className='flex-1 min-w-[200px]'/>
        <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className='rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm dark:bg-gray-800'>
          <option value=''>All Types</option>{Object.entries(QUESTION_TYPES).map(([k,v])=><option key={k} value={v}>{v}</option>)}
        </select>
        <select value={diffFilter} onChange={e=>setDiffFilter(e.target.value)} className='rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm dark:bg-gray-800'>
          <option value=''>All Difficulties</option>{DIFFICULTY_LIST.map(d=><option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>
      {loading?<div className='flex justify-center py-20'><Spinner size='lg'/></div>:questions.length===0?<EmptyState title='No questions found' description='Create your first question.' actionLabel='Add Question' onAction={()=>setShowForm(true)}/>:
      <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead><tr className='border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Title</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Type</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Topic</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Difficulty</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Points</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Actions</th>
            </tr></thead>
            <tbody>{questions.map(q=><tr key={q.id} className='border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'>
              <td className='py-3 px-4 font-medium text-gray-900 dark:text-white'>{q.title}</td>
              <td className='py-3 px-4'><Badge variant={q.type==='MCQ'?'mcq':q.type==='EXPLAIN_ME'?'explain':'code'} size='sm'>{q.type}</Badge></td>
              <td className='py-3 px-4 text-gray-500'>{q.topic}</td>
              <td className='py-3 px-4'><Badge variant={q.difficulty.toLowerCase()} size='sm'>{q.difficulty}</Badge></td>
              <td className='py-3 px-4 text-gray-500'>{q.points}</td>
              <td className='py-3 px-4'><div className='flex gap-1'>
                <Button variant='ghost' size='sm' onClick={()=>{setEditData(q);setShowForm(true);}} leftIcon={<Edit size={14}/>}>Edit</Button>
                <Button variant='ghost' size='sm' onClick={()=>setDeleteId(q.id)} leftIcon={<Trash2 size={14}/>} className='text-danger-600'>Delete</Button>
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className='p-4'><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/></div>
      </div>}
      <Modal isOpen={showForm} onClose={()=>{setShowForm(false);setEditData(null);}} title={editData?'Edit Question':'Add Question'} size='lg'>
        <QuestionForm initialData={editData} onSave={handleSave} onCancel={()=>{setShowForm(false);setEditData(null);}} loading={saving}/>
      </Modal>
      <Modal isOpen={showBulk} onClose={()=>setShowBulk(false)} title='Bulk Import Questions' size='md'>
        <BulkImport onClose={()=>setShowBulk(false)} onSuccess={load}/>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onCancel={()=>setDeleteId(null)} onConfirm={handleDelete} title='Delete Question?' message='This will permanently remove the question.'/>
    </PageWrapper>
  );
};
export default QuestionBank;
