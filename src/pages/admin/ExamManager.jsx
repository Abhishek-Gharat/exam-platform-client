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
      <>
        {/* Mobile Card View */}
        <div className='md:hidden space-y-3'>
          {exams.map((e,idx)=>(
            <div key={e.id} style={{animationDelay:`${idx*50}ms`}} className='exp-card p-4 space-y-3 animate-fade-up'>
              <div className='flex justify-between items-start gap-2'>
                <h3 className='font-semibold text-gray-900 dark:text-white flex-1'>{e.title}</h3>
                <Badge variant={e.status==='PUBLISHED'?'published':'draft'} size='sm'>{e.status}</Badge>
              </div>
              <div className='grid grid-cols-2 gap-3 text-sm'>
                <div>
                  <p className='text-gray-500 text-xs'>Questions</p>
                  <p className='text-gray-900 dark:text-white font-medium'>{e.totalQuestions}</p>
                </div>
                <div>
                  <p className='text-gray-500 text-xs'>Time</p>
                  <p className='text-gray-900 dark:text-white font-medium'>{formatDurationLong(e.timeLimitSecs)}</p>
                </div>
                <div>
                  <p className='text-gray-500 text-xs'>Pass %</p>
                  <p className='text-gray-900 dark:text-white font-medium'>{e.passingScore}%</p>
                </div>
                <div>
                  <p className='text-gray-500 text-xs'>Attempts</p>
                  <p className='text-gray-900 dark:text-white font-medium'>{e.totalAttempts||0}</p>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button variant='ghost' size='sm' onClick={()=>handlePublish(e.id)} leftIcon={e.status==='PUBLISHED'?<GlobeLock size={14}/>:<Globe size={14}/>} fullWidth>{e.status==='PUBLISHED'?'Unpublish':'Publish'}</Button>
                <Button variant='ghost' size='sm' onClick={()=>setDeleteId(e.id)} leftIcon={<Trash2 size={14}/>} className='text-danger-600'>Delete</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className='hidden md:block exp-card exp-card-flat overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead><tr className='border-b border-primary-200/30 dark:border-primary-900/30 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-950/20 dark:to-primary-900/10'>
                <th className='text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300'>Title</th>
                <th className='text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300'>Status</th>
                <th className='text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300'>Questions</th>
                <th className='text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300'>Time</th>
                <th className='text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300'>Pass %</th>
                <th className='text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300'>Attempts</th>
                <th className='text-left py-2 px-3 font-semibold text-xs text-gray-700 dark:text-gray-300'>Actions</th>
              </tr></thead>
              <tbody>{exams.map((e,idx)=>(
                <tr key={e.id} style={{animationDelay:`${idx*50}ms`}} className='border-b border-gray-200/50 dark:border-gray-700/30 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-colors animate-fade-up'>
                  <td className='py-2 px-3 font-medium text-xs text-gray-900 dark:text-white'>{e.title}</td>
                  <td className='py-2 px-3'><Badge variant={e.status==='PUBLISHED'?'published':'draft'} size='sm'>{e.status}</Badge></td>
                  <td className='py-2 px-3 text-xs text-gray-600 dark:text-gray-400'>{e.totalQuestions}</td>
                  <td className='py-2 px-3 text-xs text-gray-600 dark:text-gray-400'>{formatDurationLong(e.timeLimitSecs)}</td>
                  <td className='py-2 px-3 text-xs text-gray-600 dark:text-gray-400'>{e.passingScore}%</td>
                  <td className='py-2 px-3 text-xs text-gray-600 dark:text-gray-400'>{e.totalAttempts||0}</td>
                  <td className='py-2 px-3'><div className='flex gap-1'>
                    <Button variant='ghost' size='sm' onClick={()=>handlePublish(e.id)} leftIcon={e.status==='PUBLISHED'?<GlobeLock size={14}/>:<Globe size={14}/>}>{e.status==='PUBLISHED'?'Unpublish':'Publish'}</Button>
                    <Button variant='ghost' size='sm' onClick={()=>setDeleteId(e.id)} leftIcon={<Trash2 size={14}/>} className='text-danger-600'>Delete</Button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </>}
      <Modal isOpen={showBuilder} onClose={()=>setShowBuilder(false)} title='Create Exam' size='xl'>
        <ExamBuilder questions={allQuestions} onSave={handleSave} onCancel={()=>setShowBuilder(false)} loading={saving}/>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onCancel={()=>setDeleteId(null)} onConfirm={handleDelete} title='Delete Exam?' message='This will permanently remove the exam.'/>
    </PageWrapper>
  );
};
export default ExamManager;
