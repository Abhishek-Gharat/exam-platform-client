import React,{useEffect,useState}from'react';
import{Plus,Edit,Trash2,Globe,GlobeLock}from'lucide-react';
import{examsAPI}from'../../api/examsAPI';
import{questionsAPI}from'../../api/questionsAPI';
import PageWrapper from'../../components/layout/PageWrapper';
import Button from'../../components/ui/Button';
import Badge from'../../components/ui/Badge';
import Modal from'../../components/ui/Modal';
import Spinner from'../../components/ui/Spinner';
import EmptyState from'../../components/ui/EmptyState';
import ConfirmDialog from'../../components/ui/ConfirmDialog';
import ExamBuilder from'../../components/admin/ExamBuilder';
import{formatDurationLong}from'../../utils/formatters';
import toast from'react-hot-toast';

const ExamManager=()=>{
  const[exams,setExams]=useState([]);
  const[allQuestions,setAllQuestions]=useState([]);
  const[loading,setLoading]=useState(true);
  const[showBuilder,setShowBuilder]=useState(false);
  const[deleteId,setDeleteId]=useState(null);
  const[saving,setSaving]=useState(false);

  const load=async()=>{
    setLoading(true);
    try{
      const[eRes,qRes]=await Promise.all([examsAPI.getAllExams(),questionsAPI.getQuestions({page:1})]);
      setExams(eRes.data||[]);setAllQuestions(qRes.data.questions||[]);
    }catch{toast.error('Failed to load');}
    finally{setLoading(false);}
  };

  useEffect(()=>{load();},[]);

  const handleSave=async(data)=>{
    setSaving(true);
    try{await examsAPI.createExam(data);toast.success('Exam created');setShowBuilder(false);load();}
    catch{toast.error('Save failed');}
    finally{setSaving(false);}
  };

  const handlePublish=async(id)=>{
    try{await examsAPI.publishExam(id);toast.success('Exam published');load();}
    catch{toast.error('Publish failed');}
  };

  const handleDelete=async()=>{
    try{await examsAPI.deleteExam(deleteId);toast.success('Exam deleted');setDeleteId(null);load();}
    catch{toast.error('Delete failed');}
  };

  return(
    <PageWrapper title='Exam Manager' subtitle='Create and manage exams'
      actions={<Button onClick={()=>setShowBuilder(true)} leftIcon={<Plus size={16}/>}>Create Exam</Button>}>
      {loading?<div className='flex justify-center py-20'><Spinner size='lg'/></div>:exams.length===0?<EmptyState title='No exams' description='Create your first exam.' actionLabel='Create Exam' onAction={()=>setShowBuilder(true)}/>:
      <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead><tr className='border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Title</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Status</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Questions</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Time</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Pass %</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Attempts</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Actions</th>
            </tr></thead>
            <tbody>{exams.map(e=><tr key={e.id} className='border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'>
              <td className='py-3 px-4 font-medium text-gray-900 dark:text-white'>{e.title}</td>
              <td className='py-3 px-4'><Badge variant={e.status==='PUBLISHED'?'published':'draft'} size='sm'>{e.status}</Badge></td>
              <td className='py-3 px-4 text-gray-500'>{e.totalQuestions}</td>
              <td className='py-3 px-4 text-gray-500'>{formatDurationLong(e.timeLimitSecs)}</td>
              <td className='py-3 px-4 text-gray-500'>{e.passingScore}%</td>
              <td className='py-3 px-4 text-gray-500'>{e.totalAttempts||0}</td>
              <td className='py-3 px-4'><div className='flex gap-1'>
                <Button variant='ghost' size='sm' onClick={()=>handlePublish(e.id)} leftIcon={e.status==='PUBLISHED'?<GlobeLock size={14}/>:<Globe size={14}/>}>{e.status==='PUBLISHED'?'Unpublish':'Publish'}</Button>
                <Button variant='ghost' size='sm' onClick={()=>setDeleteId(e.id)} leftIcon={<Trash2 size={14}/>} className='text-danger-600'>Delete</Button>
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>}
      <Modal isOpen={showBuilder} onClose={()=>setShowBuilder(false)} title='Create Exam' size='xl'>
        <ExamBuilder questions={allQuestions} onSave={handleSave} onCancel={()=>setShowBuilder(false)} loading={saving}/>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onCancel={()=>setDeleteId(null)} onConfirm={handleDelete} title='Delete Exam?' message='This will permanently remove the exam.'/>
    </PageWrapper>
  );
};
export default ExamManager;
