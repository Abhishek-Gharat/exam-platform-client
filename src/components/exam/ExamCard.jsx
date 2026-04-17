import React from 'react';
import{useNavigate}from'react-router-dom';
import{Clock,FileQuestion}from'lucide-react';
import Badge from'../ui/Badge';
import Button from'../ui/Button';
import{buildRoute}from'../../constants/routes';
import{formatDurationLong}from'../../utils/formatters';
const ExamCard=({exam})=>{
  const nav=useNavigate();
  const mix=exam.difficultyMix||{};
  return(
    <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-3'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white line-clamp-1'>{exam.title}</h3>
        <Badge variant='published' size='sm'>{exam.status||'Published'}</Badge>
      </div>
      {exam.description&&<p className='text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2'>{exam.description}</p>}
      <div className='grid grid-cols-2 gap-3 mb-4'>
        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'><FileQuestion size={16}/>{exam.totalQuestions||0} questions</div>
        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'><Clock size={16}/>{formatDurationLong(exam.timeLimitSecs)}</div>
      </div>
      {(mix.easy||mix.medium||mix.hard)&&<div className='flex gap-2 mb-4'>
        {mix.easy>0&&<Badge variant='easy' size='sm'>{mix.easy} Easy</Badge>}
        {mix.medium>0&&<Badge variant='medium' size='sm'>{mix.medium} Medium</Badge>}
        {mix.hard>0&&<Badge variant='hard' size='sm'>{mix.hard} Hard</Badge>}
      </div>}
      <Button fullWidth onClick={()=>nav(buildRoute.examLobby(exam.id))}>Start Exam</Button>
    </div>
  );
};
export default ExamCard;
