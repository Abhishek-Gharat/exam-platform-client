import React,{useEffect,useState}from'react';
import{useParams,useLocation,useNavigate}from'react-router-dom';
import{attemptsAPI}from'../../api/attemptsAPI';
import{ROUTES}from'../../constants/routes';
import PageWrapper from'../../components/layout/PageWrapper';
import ScoreCircle from'../../components/ui/ScoreCircle';
import Badge from'../../components/ui/Badge';
import Button from'../../components/ui/Button';
import Spinner from'../../components/ui/Spinner';
import AnswerReview from'../../components/exam/AnswerReview';
import{formatDurationLong,formatDateTime}from'../../utils/formatters';
import toast from'react-hot-toast';

const Results=()=>{
  const{id}=useParams();
  const loc=useLocation();
  const nav=useNavigate();
  const[result,setResult]=useState(loc.state?.result||null);
  const[loading,setLoading]=useState(!result);

  useEffect(()=>{
    if(!result){
      const load=async()=>{
        try{const r=await attemptsAPI.getAttemptResult(id);setResult(r.data);}
        catch{toast.error('Failed to load results');}
        finally{setLoading(false);}
      };
      load();
    }
  },[id,result]);

  if(loading)return<div className='flex justify-center py-20'><Spinner size='lg'/></div>;
  if(!result)return<div className='text-center py-20 text-gray-500'>Results not found</div>;

  const passed=result.passed;
  const gradientBg=passed?'from-success-50 to-success-100/50 dark:from-success-950/20 dark:to-success-900/10':'from-danger-50 to-danger-100/50 dark:from-danger-950/20 dark:to-danger-900/10';
  const borderColor=passed?'border-success-200/50 dark:border-success-800/50':'border-danger-200/50 dark:border-danger-800/50';

  return(
    <PageWrapper>
      <div className='max-w-4xl mx-auto'>
        <div className={'exp-card exp-card-flat bg-gradient-to-br '+gradientBg+' '+borderColor+' p-8 mb-8 text-center animate-fade-up'}>
          <ScoreCircle score={result.score} size={150}/>
          <div className='mt-6'>
            <Badge variant={result.passed?'pass':'fail'} size='lg'>{result.passed?'PASSED':'FAILED'}</Badge>
          </div>
          <h2 className='text-2xl font-bold mt-6 text-gray-900 dark:text-white'>{result.examTitle||'Exam Results'}</h2>
          <div className='flex justify-center gap-8 mt-6 text-sm text-gray-600 dark:text-gray-400 flex-wrap'>
            <span className='flex items-center gap-2'>Time: {formatDurationLong(result.timeTaken)}</span>
            <span className='flex items-center gap-2'>Submitted: {formatDateTime(result.submittedAt)}</span>
          </div>
          <div className='flex justify-center gap-4 mt-6 flex-wrap'>
            <div className='px-6 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-700'><p className='text-xs text-gray-600 dark:text-gray-400 font-medium'>Score</p><p className='font-bold text-lg text-primary-600 dark:text-primary-400'>{result.totalScore||0}/{result.maxScore||0}</p></div>
            <div className='px-6 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-700'><p className='text-xs text-gray-600 dark:text-gray-400 font-medium'>Questions</p><p className='font-bold text-lg text-success-600 dark:text-success-400'>{(result.questionResults||[]).filter(q=>q.isCorrect).length}/{(result.questionResults||[]).length}</p></div>
          </div>
        </div>
        {result.questionResults&&result.questionResults.length>0&&<div className='mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Question Review</h3>
          <div className='space-y-4'>{result.questionResults.map((qr,i)=>(
            <div key={qr.questionId||i} style={{animationDelay:`${i*100}ms`}} className='animate-fade-up'>
              <AnswerReview result={qr} index={i}/>
            </div>
          ))}</div>
        </div>}
        <div className='flex gap-4 justify-center flex-wrap'>
          <Button variant='secondary' onClick={()=>nav(ROUTES.DASHBOARD)}>Back to Dashboard</Button>
          <Button onClick={()=>nav(ROUTES.HISTORY)}>View All History</Button>
        </div>
      </div>
    </PageWrapper>
  );
};
export default Results;
