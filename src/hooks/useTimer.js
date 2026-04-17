import{useEffect,useRef,useCallback}from'react';
import{useExamStore}from'../store/examStore';
export const useTimer=(initialSeconds,onExpire)=>{
  const ref=useRef(null);const expired=useRef(false);
  const tick=useExamStore(s=>s.tickTimer);
  const remaining=useExamStore(s=>s.timeRemainingSeconds);
  const start=useCallback(()=>{if(ref.current)clearInterval(ref.current);expired.current=false;ref.current=setInterval(tick,1000);},[tick]);
  const stop=useCallback(()=>{if(ref.current){clearInterval(ref.current);ref.current=null;}},[]);
  useEffect(()=>{if(initialSeconds>0)start();return stop;},[initialSeconds,start,stop]);
  useEffect(()=>{if(remaining<=0&&!expired.current&&initialSeconds>0){expired.current=true;stop();if(onExpire)onExpire();}},[remaining,onExpire,stop,initialSeconds]);
  return{timeRemaining:remaining,isExpired:remaining<=0&&initialSeconds>0,stop,start};
};
