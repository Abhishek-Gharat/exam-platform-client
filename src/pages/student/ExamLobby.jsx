import React,{useEffect,useState}from'react';
import{useParams,useNavigate}from'react-router-dom';
import{Clock,FileQuestion,Target,AlertTriangle,Monitor,Code,BookOpen}from'lucide-react';
import{examsAPI}from'../../api/examsAPI';
import{attemptsAPI}from'../../api/attemptsAPI';
import{useExamStore}from'../../store/examStore';
import{buildRoute}from'../../constants/routes';
import Button from'../../components/ui/Button';
import Badge from'../../components/ui/Badge';
import Spinner from'../../components/ui/Spinner';
import{formatDurationLong}from'../../utils/formatters';
import toast from'react-hot-toast';

const ExamLobby=()=>{
  const{id}=useParams();
  const nav=useNavigate();
  const{initExam}=useExamStore();
  const[exam,setExam]=useState(null);
  const[loading,setLoading]=useState(true);
  const[starting,setStarting]=useState(false);

  useEffect(()=>{
    const load=async()=>{
      try{const r=await examsAPI.getExamById(id);setExam(r.data);}
      catch{toast.error('Failed to load exam');}
      finally{setLoading(false);}
    };
    load();
  },[id]);

  const handleBegin=async()=>{
    setStarting(true);
    try{
      const r=await attemptsAPI.startAttempt(id);
      const d=r.data;
      initExam(d.attemptId,d.questions,d.timeLimitSecs,d.examMeta);
      nav(buildRoute.examRoom(id));
    }catch(e){toast.error(e?.response?.data?.message||'Failed to start exam');}
    finally{setStarting(false);}
  };

  if(loading)return<div className='flex justify-center py-20'><Spinner size='lg'/></div>;
  if(!exam)return<div className='text-center py-20 text-gray-500'>Exam not found</div>;

  const mix=exam.difficultyMix||{};

  return(
    <div className='max-w-3xl mx-auto animate-fade-in'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <div className='bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-10 text-white'>
          <h1 className='text-3xl font-bold mb-2'>{exam.title}</h1>
          {exam.description&&<p className='text-primary-100 text-lg'>{exam.description}</p>}
        </div>
        <div className='p-8'>
          <div className='grid grid-cols-3 gap-4 mb-8'>
            <div className='text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50'>
              <Clock size={24} className='mx-auto mb-2 text-primary-500'/><p className='text-sm text-gray-500'>Time Limit</p><p className='text-lg font-bold'>{formatDurationLong(exam.timeLimitSecs)}</p>
            </div>
            <div className='text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50'>
              <FileQuestion size={24} className='mx-auto mb-2 text-primary-500'/><p className='text-sm text-gray-500'>Questions</p><p className='text-lg font-bold'>{exam.totalQuestions}</p>
            </div>
            <div className='text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50'>
              <Target size={24} className='mx-auto mb-2 text-primary-500'/><p className='text-sm text-gray-500'>Passing</p><p className='text-lg font-bold'>{exam.passingScore}%</p>
            </div>
          </div>
          {(mix.easy||mix.medium||mix.hard)&&<div className='flex gap-2 mb-8 justify-center'>
            {mix.easy>0&&<Badge variant='easy' size='lg'>{mix.easy} Easy</Badge>}
            {mix.medium>0&&<Badge variant='medium' size='lg'>{mix.medium} Medium</Badge>}
            {mix.hard>0&&<Badge variant='hard' size='lg'>{mix.hard} Hard</Badge>}
          </div>}
          <div className='bg-warning-50 dark:bg-warning-900/20 rounded-xl p-6 mb-8'>
            <h3 className='flex items-center gap-2 font-semibold text-warning-700 dark:text-warning-400 mb-3'><AlertTriangle size={20}/>Important Rules</h3>
            <ul className='space-y-2 text-sm text-warning-700 dark:text-warning-300'>
              <li className='flex items-start gap-2'><Monitor size={16} className='mt-0.5 flex-shrink-0'/>Do not refresh or close the browser during the exam</li>
              <li className='flex items-start gap-2'><Clock size={16} className='mt-0.5 flex-shrink-0'/>Timer starts immediately when you click Begin</li>
              <li className='flex items-start gap-2'><Code size={16} className='mt-0.5 flex-shrink-0'/>Code questions support JavaScript only</li>
              <li className='flex items-start gap-2'><BookOpen size={16} className='mt-0.5 flex-shrink-0'/>Tab switching is monitored and recorded</li>
            </ul>
          </div>
          <Button size='lg' fullWidth onClick={handleBegin} loading={starting}>Begin Exam</Button>
        </div>
      </div>
    </div>
  );
};
export default ExamLobby;
