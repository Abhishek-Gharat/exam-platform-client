import React,{useState,useEffect}from'react';
import{useNavigate}from'react-router-dom';
import{ChevronLeft,ChevronRight,Flag,Send,Menu,X}from'lucide-react';
import{useExam}from'../../hooks/useExam';
import{useTimer}from'../../hooks/useTimer';
import Timer from'../../components/exam/Timer';
import QuestionNavPanel from'../../components/exam/QuestionNavPanel';
import QuestionRenderer from'../../components/exam/QuestionRenderer';
import ConfirmDialog from'../../components/ui/ConfirmDialog';
import Button from'../../components/ui/Button';
import Badge from'../../components/ui/Badge';
import Spinner from'../../components/ui/Spinner';
import{ROUTES}from'../../constants/routes';
import toast from'react-hot-toast';

const ExamRoom=()=>{
  const nav=useNavigate();
  const{attemptId,examMeta,questions,answers,flagged,currentIndex,currentQuestion,timeRemainingSeconds,isSubmitting,answeredCount,totalQuestions,progress,handleAnswerChange,handleSubmit,toggleFlag,goToQuestion,nextQuestion,prevQuestion}=useExam();
  const[showConfirm,setShowConfirm]=useState(false);
  const[showNav,setShowNav]=useState(false);

  const onExpire=()=>{toast.error('Time is up! Submitting...');handleSubmit();};
  const{timeRemaining}=useTimer(timeRemainingSeconds>0?examMeta.timeLimitSecs:0,onExpire);

  useEffect(()=>{if(!attemptId&&!isSubmitting){nav(ROUTES.DASHBOARD);}},[attemptId,nav,isSubmitting]);

  if(!attemptId)return<div className='flex justify-center items-center min-h-screen'><Spinner size='lg'/></div>;

  const isFlagged=currentQuestion&&flagged.includes(currentQuestion.id);

  return(
    <div className='min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col'>
      <div className='sticky top-0 z-30 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'>
        <div className='flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16'>
          <div className='flex items-center gap-4 min-w-0'>
            <button onClick={()=>setShowNav(!showNav)} className='lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors'>{showNav?<X size={20}/>:<Menu size={20}/>}</button>
            <h1 className='font-semibold text-gray-900 dark:text-white truncate'>{examMeta.title}</h1>
          </div>
          <div className='flex items-center gap-3 sm:gap-4'>
            <Badge variant='info' size='sm'>Q {currentIndex+1}/{totalQuestions}</Badge>
            <div className='hidden sm:flex w-32 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden'><div className='h-full bg-primary-600 transition-all duration-300' style={{width:progress+'%'}}/></div>
            <Timer seconds={timeRemainingSeconds}/>
            <Button variant='danger' size='sm' onClick={()=>setShowConfirm(true)}>Submit</Button>
          </div>
        </div>
      </div>
      <div className='flex flex-1 max-w-7xl mx-auto w-full'>
        <div className={'w-64 p-4 flex-shrink-0 '+(showNav?'fixed inset-0 z-20 bg-white dark:bg-slate-900 pt-20 px-4 lg:relative lg:inset-auto lg:z-auto lg:pt-4':'hidden lg:block')}>
          <QuestionNavPanel questions={questions} answers={answers} flagged={flagged} currentIndex={currentIndex} onSelect={(i)=>{goToQuestion(i);setShowNav(false);}}/>
        </div>
        <div className='flex-1 p-4 sm:p-6 lg:p-8'>
          <div className='exp-card-flat p-6 sm:p-8 mb-8 animate-fade-up'>
            <div className='flex items-center gap-2 mb-6 flex-wrap gap-y-3'>
              <Badge variant={currentQuestion?.type==='MCQ'?'mcq':currentQuestion?.type==='EXPLAIN_ME'?'explain':'code'} size='sm'>{currentQuestion?.type}</Badge>
              {currentQuestion?.difficulty&&<Badge variant={currentQuestion.difficulty.toLowerCase()} size='sm'>{currentQuestion.difficulty}</Badge>}
              <span className='text-sm font-semibold text-primary-600 dark:text-primary-400 ml-auto'>{currentQuestion?.points||0} pts</span>
            </div>
            <QuestionRenderer question={currentQuestion} answer={answers[currentQuestion?.id]} onAnswerChange={handleAnswerChange}/>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <Button variant='secondary' onClick={prevQuestion} disabled={currentIndex===0} leftIcon={<ChevronLeft size={16}/>}>Previous</Button>
            <Button variant={isFlagged?'warning':'ghost'} onClick={()=>currentQuestion&&toggleFlag(currentQuestion.id)} leftIcon={<Flag size={16}/>}>{isFlagged?'Flagged':'Flag'}</Button>
            <Button onClick={nextQuestion} disabled={currentIndex===totalQuestions-1} rightIcon={<ChevronRight size={16}/>}>Next</Button>
          </div>
        </div>
      </div>
      <ConfirmDialog isOpen={showConfirm} onCancel={()=>setShowConfirm(false)} onConfirm={()=>{setShowConfirm(false);handleSubmit();}} title='Submit Exam?' message={'You have answered '+answeredCount+' of '+totalQuestions+' questions. Are you sure you want to submit?'} confirmText='Submit Exam' variant='warning' loading={isSubmitting}/>
    </div>
  );
};
export default ExamRoom;
