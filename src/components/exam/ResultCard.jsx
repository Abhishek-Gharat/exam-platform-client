import React from 'react';
import{useNavigate}from'react-router-dom';
import Badge from'../ui/Badge';
import{buildRoute}from'../../constants/routes';
import{formatScore,formatDate}from'../../utils/formatters';
const ResultCard=({attempt})=>{
  const nav=useNavigate();
  return(
    <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer' onClick={()=>nav(buildRoute.results(attempt.id))}>
      <div>
        <h4 className='font-medium text-gray-900 dark:text-white'>{attempt.examTitle}</h4>
        <p className='text-sm text-gray-500 dark:text-gray-400'>{formatDate(attempt.submittedAt)}</p>
      </div>
      <div className='flex items-center gap-3'>
        <span className={'text-lg font-bold '+(attempt.score>=70?'text-success-600':attempt.score>=50?'text-warning-600':'text-danger-600')}>{formatScore(attempt.score)}</span>
        <Badge variant={attempt.passed?'pass':'fail'}>{attempt.passed?'Pass':'Fail'}</Badge>
      </div>
    </div>
  );
};
export default ResultCard;
