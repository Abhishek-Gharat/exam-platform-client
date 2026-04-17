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

  return(
    <PageWrapper>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-8 text-center'>
          <ScoreCircle score={result.score} size={150}/>
          <div className='mt-4'>
            <Badge variant={result.passed?'pass':'fail'} size='lg'>{result.passed?'PASSED':'FAILED'}</Badge>
          </div>
          <h2 className='text-xl font-bold mt-4 text-gray-900 dark:text-white'>{result.examTitle||'Exam Results'}</h2>
          <div className='flex justify-center gap-8 mt-4 text-sm text-gray-500'>
            <span>Time: {formatDurationLong(result.timeTaken)}</span>
            <span>Submitted: {formatDateTime(result.submittedAt)}</span>
          </div>
          <div className='flex justify-center gap-4 mt-4'>
            <div className='px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50'><p className='text-xs text-gray-500'>Score</p><p className='font-bold'>{result.totalScore||0}/{result.maxScore||0}</p></div>
            <div className='px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50'><p className='text-xs text-gray-500'>Questions</p><p className='font-bold'>{(result.questionResults||[]).filter(q=>q.isCorrect).length}/{(result.questionResults||[]).length}</p></div>
          </div>
        </div>
        {result.questionResults&&result.questionResults.length>0&&<div className='space-y-4 mb-8'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Question Review</h3>
          {result.questionResults.map((qr,i)=><AnswerReview key={qr.questionId||i} result={qr} index={i}/>)}
        </div>}
        <div className='flex gap-4 justify-center'>
          <Button variant='secondary' onClick={()=>nav(ROUTES.DASHBOARD)}>Back to Dashboard</Button>
          <Button onClick={()=>nav(ROUTES.HISTORY)}>View All History</Button>
        </div>
      </div>
    </PageWrapper>
  );
};
export default Results;
