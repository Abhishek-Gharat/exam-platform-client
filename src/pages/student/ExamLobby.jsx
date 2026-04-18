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

const colorCardMap={
  primary:'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/30 dark:to-primary-900/20 border border-primary-200/50 dark:border-primary-800/50',
  success:'bg-gradient-to-br from-success-50 to-success-100 dark:from-success-950/30 dark:to-success-900/20 border border-success-200/50 dark:border-success-800/50',
  warning:'bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-950/30 dark:to-warning-900/20 border border-warning-200/50 dark:border-warning-800/50'
};
const colorIconMap={
  primary:'text-primary-600 dark:text-primary-400',
  success:'text-success-600 dark:text-success-400',
  warning:'text-warning-600 dark:text-warning-400'
};

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
    <div className='max-w-3xl mx-auto animate-fade-up'>
      <div className='exp-card exp-card-flat overflow-hidden'>
        <div className='bg-gradient-primary px-8 py-12 text-white'>
          <h1 className='text-4xl font-bold mb-3'>{exam.title}</h1>
          {exam.description&&<p className='text-primary-100 text-lg'>{exam.description}</p>}
        </div>
        <div className='p-8'>
          <div className='grid grid-cols-3 gap-4 mb-8'>
            {[{Icon:Clock,label:'Time Limit',value:formatDurationLong(exam.timeLimitSecs),color:'primary'},{Icon:FileQuestion,label:'Questions',value:exam.totalQuestions,color:'success'},{Icon:Target,label:'Passing',value:exam.passingScore+'%',color:'warning'}].map((item,idx)=>(
              <div key={idx} style={{animationDelay:`${idx*100}ms`}} className={`animate-fade-up text-center p-4 rounded-xl ${colorCardMap[item.color]||colorCardMap.primary}`}>
                <item.Icon size={24} className={`mx-auto mb-2 ${colorIconMap[item.color]||colorIconMap.primary}`}/>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>{item.label}</p>
                <p className='text-lg font-bold text-gray-900 dark:text-white mt-1'>{item.value}</p>
              </div>
            ))}
          </div>
          {(mix.easy||mix.medium||mix.hard)&&<div className='flex gap-2 mb-8 justify-center flex-wrap'>
            {mix.easy>0&&<Badge variant='easy' size='lg'>{mix.easy} Easy</Badge>}
            {mix.medium>0&&<Badge variant='medium' size='lg'>{mix.medium} Medium</Badge>}
            {mix.hard>0&&<Badge variant='hard' size='lg'>{mix.hard} Hard</Badge>}
          </div>}
          <div className='bg-gradient-to-br from-danger-50 to-danger-100/50 dark:from-danger-950/20 dark:to-danger-900/10 rounded-xl p-6 mb-8 border border-danger-200/50 dark:border-danger-800/50'>
            <h3 className='flex items-center gap-2 font-bold text-danger-700 dark:text-danger-300 mb-4 text-lg'><AlertTriangle size={20}/>Important Rules</h3>
            <ul className='space-y-3 text-sm text-danger-700 dark:text-danger-200'>
              <li className='flex items-start gap-3'><Monitor size={16} className='mt-0.5 flex-shrink-0 text-danger-600 dark:text-danger-400'/>Do not refresh or close the browser during the exam</li>
              <li className='flex items-start gap-3'><Clock size={16} className='mt-0.5 flex-shrink-0 text-danger-600 dark:text-danger-400'/>Timer starts immediately when you click Begin</li>
              <li className='flex items-start gap-3'><Code size={16} className='mt-0.5 flex-shrink-0 text-danger-600 dark:text-danger-400'/>Code questions support JavaScript only</li>
              <li className='flex items-start gap-3'><BookOpen size={16} className='mt-0.5 flex-shrink-0 text-danger-600 dark:text-danger-400'/>Tab switching is monitored and recorded</li>
            </ul>
          </div>
          <Button size='lg' fullWidth onClick={handleBegin} loading={starting}>Begin Exam</Button>
        </div>
      </div>
    </div>
  );
};
export default ExamLobby;
