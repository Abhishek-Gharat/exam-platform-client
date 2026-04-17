import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
export const formatDate=(d)=>{if(!d)return'N/A';const dt=typeof d==='string'?parseISO(d):d;return isValid(dt)?format(dt,'MMM dd, yyyy'):'N/A';};
export const formatDateTime=(d)=>{if(!d)return'N/A';const dt=typeof d==='string'?parseISO(d):d;return isValid(dt)?format(dt,'MMM dd, yyyy HH:mm'):'N/A';};
export const formatDuration=(s)=>{if(s==null||s<0)return'00:00';return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
export const formatDurationLong=(s)=>{if(s==null||s<0)return'0m';const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);const p=[];if(h>0)p.push(h+'h');if(m>0)p.push(m+'m');return p.join(' ')||'0m';};
export const formatScore=(s)=>s==null?'0%':Math.round(s)+'%';
export const getScoreColor=(s)=>s>=70?'text-success-600 dark:text-success-400':s>=50?'text-warning-600 dark:text-warning-400':'text-danger-600 dark:text-danger-400';
export const getScoreBgColor=(s)=>s>=70?'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400':s>=50?'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400':'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400';
export const truncateText=(t,max=50)=>!t?'':t.length<=max?t:t.substring(0,max)+'...';
