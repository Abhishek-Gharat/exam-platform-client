import React from 'react';
import Spinner from './Spinner';
const vs={
  primary:'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary:'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
  danger:'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
  ghost:'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
  link:'bg-transparent text-primary-600 hover:underline dark:text-primary-400 p-0',
};
const ss={sm:'px-3 py-1.5 text-sm',md:'px-4 py-2 text-sm',lg:'px-6 py-3 text-base'};
const Button=({children,variant='primary',size='md',loading=false,disabled=false,onClick,leftIcon,rightIcon,fullWidth=false,type='button',className='',...props})=>{
  const off=disabled||loading;
  return(
    <button type={type} onClick={onClick} disabled={off}
      className={'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 '+(vs[variant]||vs.primary)+' '+(ss[size]||ss.md)+' '+(fullWidth?'w-full':'')+' '+(off?'opacity-50 cursor-not-allowed':'cursor-pointer')+' '+className}
      {...props}>
      {loading?<Spinner size='sm' className='text-current'/>:leftIcon?<span className='w-4 h-4 flex items-center'>{leftIcon}</span>:null}
      {children}
      {!loading&&rightIcon&&<span className='w-4 h-4 flex items-center'>{rightIcon}</span>}
    </button>
  );
};
export default Button;
