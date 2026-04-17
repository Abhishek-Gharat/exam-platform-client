import React,{useEffect,useState}from'react';
import{BookOpen,Trophy,Target}from'lucide-react';
import{useAuthStore}from'../../store/authStore';
import{examsAPI}from'../../api/examsAPI';
import{attemptsAPI}from'../../api/attemptsAPI';
import PageWrapper from'../../components/layout/PageWrapper';
import ExamCard from'../../components/exam/ExamCard';
import ResultCard from'../../components/exam/ResultCard';
import Spinner from'../../components/ui/Spinner';
import EmptyState from'../../components/ui/EmptyState';
import{formatScore,getScoreBgColor}from'../../utils/formatters';
import toast from'react-hot-toast';

const StatCard=({icon:Icon,label,value,colorClass=''})=>(
  <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
    <div className='flex items-center gap-4'>
      <div className='w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center'><Icon size={24} className='text-primary-600 dark:text-primary-400'/></div>
      <div><p className='text-sm text-gray-500 dark:text-gray-400'>{label}</p><p className={'text-2xl font-bold '+(colorClass||'text-gray-900 dark:text-white')}>{value}</p></div>
    </div>
  </div>
);

const Dashboard=()=>{
  const{user}=useAuthStore();
  const[exams,setExams]=useState([]);
  const[attempts,setAttempts]=useState([]);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    const load=async()=>{
      try{
        const[exRes,atRes]=await Promise.all([examsAPI.getPublishedExams(),attemptsAPI.getMyAttempts()]);
        setExams(exRes.data||[]);setAttempts(atRes.data||[]);
      }catch(e){toast.error('Failed to load dashboard');}
      finally{setLoading(false);}
    };
    load();
  },[]);

  if(loading)return<div className='flex justify-center py-20'><Spinner size='lg'/></div>;

  const totalExams=attempts.length;
  const avgScore=totalExams>0?Math.round(attempts.reduce((s,a)=>s+a.score,0)/totalExams):0;
  const bestScore=totalExams>0?Math.max(...attempts.map(a=>a.score)):0;
  const recent=attempts.slice(0,3);

  return(
    <PageWrapper title={'Welcome back, '+(user?.name||'Student')} subtitle='Here is your exam overview'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        <StatCard icon={BookOpen} label='Exams Taken' value={totalExams}/>
        <StatCard icon={Target} label='Average Score' value={formatScore(avgScore)} colorClass={avgScore>=70?'text-success-600':avgScore>=50?'text-warning-600':'text-danger-600'}/>
        <StatCard icon={Trophy} label='Best Score' value={formatScore(bestScore)} colorClass='text-primary-600'/>
      </div>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Available Exams</h2>
        {exams.length>0?<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>{exams.map(e=><ExamCard key={e.id} exam={e}/>)}</div>
        :<EmptyState title='No exams available' description='Check back later for new exams.'/>}
      </div>
      {recent.length>0&&<div>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Recent Results</h2>
        <div className='space-y-3'>{recent.map(a=><ResultCard key={a.id} attempt={a}/>)}</div>
      </div>}
    </PageWrapper>
  );
};
export default Dashboard;
