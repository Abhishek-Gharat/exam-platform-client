import React,{useEffect,useState}from'react';
const ScoreCircle=({score=0,size=120,showLabel=true})=>{
  const[anim,setAnim]=useState(0);
  const sw=8,r=(size-sw)/2,circ=2*Math.PI*r;
  const offset=circ-(anim/100)*circ;
  useEffect(()=>{const t=setTimeout(()=>setAnim(score),100);return()=>clearTimeout(t);},[score]);
  const color=score>=70?{s:'#10b981',t:'text-success-600 dark:text-success-400'}:score>=50?{s:'#f59e0b',t:'text-warning-600 dark:text-warning-400'}:{s:'#ef4444',t:'text-danger-600 dark:text-danger-400'};
  return(
    <div className='relative inline-flex items-center justify-center' style={{width:size,height:size}}>
      <svg width={size} height={size} className='-rotate-90'>
        <circle cx={size/2} cy={size/2} r={r} fill='none' stroke='currentColor' strokeWidth={sw} className='text-gray-200 dark:text-gray-700'/>
        <circle cx={size/2} cy={size/2} r={r} fill='none' stroke={color.s} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap='round' className='transition-all duration-1000 ease-out'/>
      </svg>
      {showLabel&&<div className='absolute inset-0 flex flex-col items-center justify-center'><span className={'text-2xl font-bold '+color.t}>{Math.round(score)}</span><span className='text-xs text-gray-500 dark:text-gray-400'>%</span></div>}
    </div>
  );
};
export default ScoreCircle;
