import React,{useEffect,useState}from'react';
import{useNavigate}from'react-router-dom';
import{attemptsAPI}from'../../api/attemptsAPI';
import{buildRoute}from'../../constants/routes';
import PageWrapper from'../../components/layout/PageWrapper';
import Badge from'../../components/ui/Badge';
import Button from'../../components/ui/Button';
import Spinner from'../../components/ui/Spinner';
import EmptyState from'../../components/ui/EmptyState';
import Pagination from'../../components/ui/Pagination';
import{formatDate,formatScore,formatDurationLong}from'../../utils/formatters';
import{History as HistIcon}from'lucide-react';
import toast from'react-hot-toast';

const History=()=>{
  const nav=useNavigate();
  const[attempts,setAttempts]=useState([]);
  const[loading,setLoading]=useState(true);
  const[page,setPage]=useState(1);
  const perPage=10;

  useEffect(()=>{
    const load=async()=>{
      try{const r=await attemptsAPI.getMyAttempts();setAttempts(r.data||[]);}
      catch{toast.error('Failed to load history');}
      finally{setLoading(false);}
    };
    load();
  },[]);

  if(loading)return<div className='flex justify-center py-20'><Spinner size='lg'/></div>;

  const total=attempts.length;
  const totalPages=Math.ceil(total/perPage);
  const paginated=attempts.slice((page-1)*perPage,page*perPage);

  return(
    <PageWrapper title='Exam History' subtitle='Review your past exam attempts'>
      {total===0?<EmptyState icon={HistIcon} title='No attempts yet' description='Take an exam to see your history here.'/>:
      <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead><tr className='border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Exam</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Date</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Score</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Result</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Time</th>
              <th className='text-left py-3 px-4 font-medium text-gray-500'>Actions</th>
            </tr></thead>
            <tbody>{paginated.map(a=><tr key={a.id} className='border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'>
              <td className='py-3 px-4 font-medium text-gray-900 dark:text-white'>{a.examTitle}</td>
              <td className='py-3 px-4 text-gray-500'>{formatDate(a.submittedAt)}</td>
              <td className='py-3 px-4'><span className={'font-bold '+(a.score>=70?'text-success-600':a.score>=50?'text-warning-600':'text-danger-600')}>{formatScore(a.score)}</span></td>
              <td className='py-3 px-4'><Badge variant={a.passed?'pass':'fail'}>{a.passed?'Pass':'Fail'}</Badge></td>
              <td className='py-3 px-4 text-gray-500'>{formatDurationLong(a.timeTaken)}</td>
              <td className='py-3 px-4'><Button variant='ghost' size='sm' onClick={()=>nav(buildRoute.results(a.id))}>View Results</Button></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className='p-4'><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/></div>
      </div>}
    </PageWrapper>
  );
};
export default History;
