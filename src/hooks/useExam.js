import{useCallback,useEffect,useRef,useState}from'react';
import{useNavigate}from'react-router-dom';
import{useExamStore}from'../store/examStore';
import{attemptsAPI}from'../api/attemptsAPI';
import{buildRoute}from'../constants/routes';
import toast from'react-hot-toast';

export const useExam=()=>{
  const nav=useNavigate();
  const[tabSwitchCount,setTabSwitchCount]=useState(0);
  const saveRef=useRef(null);const lastSaved=useRef({});
  const{attemptId,examMeta,questions,answers,flagged,currentIndex,timeRemainingSeconds,isSubmitting,codeOutputs,setAnswer,toggleFlag,goToQuestion,nextQuestion,prevQuestion,setSubmitting,resetExam}=useExamStore();
  const currentQuestion=questions[currentIndex]||null;

  const handleAnswerChange=useCallback((qid,val)=>setAnswer(qid,val),[setAnswer]);

  const handleSubmit=useCallback(async()=>{
    if(isSubmitting)return;setSubmitting(true);
    try{const r=await attemptsAPI.submitAttempt(attemptId,answers,tabSwitchCount);resetExam();toast.success('Exam submitted!');nav(buildRoute.results(r.data.attemptId||attemptId),{state:{result:r.data}});}
    catch(e){toast.error(e?.response?.data?.message||'Submit failed');setSubmitting(false);}
  },[attemptId,answers,tabSwitchCount,isSubmitting]);

  const autoSave=useCallback(async()=>{
    if(!attemptId)return;const cur=useExamStore.getState().answers;
    for(const[qid,ans]of Object.entries(cur)){if(JSON.stringify(lastSaved.current[qid])!==JSON.stringify(ans)){try{await attemptsAPI.autoSaveAnswer(attemptId,qid,ans);lastSaved.current[qid]=ans;}catch{}}}
  },[attemptId]);

  useEffect(()=>{
    const onVis=()=>{if(document.hidden){setTabSwitchCount(p=>{const n=p+1;if(n===1)toast('Tab switch detected',{icon:'eye'});else if(n>=3)toast.error('Exam flagged suspicious');return n;});autoSave();}};
    const onUnload=(e)=>{if(attemptId){e.preventDefault();e.returnValue='';autoSave();}};
    document.addEventListener('visibilitychange',onVis);window.addEventListener('beforeunload',onUnload);
    return()=>{document.removeEventListener('visibilitychange',onVis);window.removeEventListener('beforeunload',onUnload);};
  },[attemptId,autoSave]);

  useEffect(()=>{if(attemptId)saveRef.current=setInterval(autoSave,30000);return()=>{if(saveRef.current)clearInterval(saveRef.current);};},[attemptId,autoSave]);

  return{attemptId,examMeta,questions,answers,flagged,currentIndex,currentQuestion,timeRemainingSeconds,isSubmitting,codeOutputs,tabSwitchCount,answeredCount:Object.keys(answers).length,totalQuestions:questions.length,progress:questions.length?Math.round(Object.keys(answers).length/questions.length*100):0,handleAnswerChange,handleSubmit,toggleFlag,goToQuestion,nextQuestion,prevQuestion};
};
