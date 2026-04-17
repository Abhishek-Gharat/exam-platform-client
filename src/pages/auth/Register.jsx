import React,{useState}from'react';
import{Link}from'react-router-dom';
import{Mail,Lock,User,BookOpen}from'lucide-react';
import Button from'../../components/ui/Button';
import Input from'../../components/ui/Input';
import{useAuth}from'../../hooks/useAuth';
import{validateEmail,validatePassword,validateConfirmPassword,validateName}from'../../utils/validators';
import{ROUTES}from'../../constants/routes';
import toast from'react-hot-toast';

const Register=()=>{
  const{register}=useAuth();
  const[form,setForm]=useState({name:'',email:'',password:'',confirmPassword:''});
  const[errors,setErrors]=useState({});
  const[loading,setLoading]=useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const errs={};
    const nameErr=validateName(form.name);if(nameErr)errs.name=nameErr;
    const emailErr=validateEmail(form.email);if(emailErr)errs.email=emailErr;
    const pwErr=validatePassword(form.password);if(pwErr)errs.password=pwErr;
    const cpErr=validateConfirmPassword(form.password,form.confirmPassword);if(cpErr)errs.confirmPassword=cpErr;
    setErrors(errs);
    if(Object.keys(errs).length>0)return;
    setLoading(true);
    try{await register(form.name,form.email,form.password);}
    catch(err){toast.error(err?.response?.data?.message||'Registration failed');}
    finally{setLoading(false);}
  };

  return(
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 mb-4'><BookOpen size={32} className='text-white'/></div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Create Account</h1>
          <p className='text-gray-500 dark:text-gray-400 mt-1'>Join the JS Exam Platform</p>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <Input label='Name' value={form.name} onChange={e=>set('name',e.target.value)} error={errors.name} placeholder='Your full name' leftIcon={<User size={18}/>} required/>
            <Input label='Email' type='email' value={form.email} onChange={e=>set('email',e.target.value)} error={errors.email} placeholder='you@example.com' leftIcon={<Mail size={18}/>} required/>
            <Input label='Password' type='password' value={form.password} onChange={e=>set('password',e.target.value)} error={errors.password} placeholder='Min 6 characters' leftIcon={<Lock size={18}/>} required/>
            <Input label='Confirm Password' type='password' value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)} error={errors.confirmPassword} placeholder='Repeat password' leftIcon={<Lock size={18}/>} required/>
            <Button type='submit' fullWidth loading={loading} size='lg'>Create Account</Button>
          </form>
          <div className='mt-6 text-center'><p className='text-sm text-gray-500'>Already have an account? <Link to={ROUTES.LOGIN} className='text-primary-600 font-medium hover:underline'>Sign in</Link></p></div>
        </div>
      </div>
    </div>
  );
};
export default Register;
