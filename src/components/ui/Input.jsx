import React,{useState} from 'react';
import{Eye,EyeOff}from'lucide-react';
const Input=({label,type='text',value,onChange,error,helperText,placeholder,leftIcon,disabled=false,required=false,className='',name,...props})=>{
  const[show,setShow]=useState(false);
  const isPw=type==='password';
  return(
    <div className={'w-full '+className}>
      {label&&<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{label}{required&&<span className='text-danger-500 ml-1'>*</span>}</label>}
      <div className='relative'>
        {leftIcon&&<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>{leftIcon}</div>}
        <input name={name} type={isPw?(show?'text':'password'):type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          className={'w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 '+(leftIcon?'pl-10 ':' ')+(isPw?'pr-10 ':' ')+(error?'border-danger-500 focus:ring-danger-500':'border-gray-300 dark:border-gray-600')}
          {...props}/>
        {isPw&&<button type='button' onClick={()=>setShow(!show)} className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button>}
      </div>
      {error&&<p className='mt-1 text-sm text-danger-500'>{error}</p>}
      {helperText&&!error&&<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{helperText}</p>}
    </div>
  );
};
export default Input;
