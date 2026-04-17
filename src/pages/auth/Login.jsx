import React,{useState}from'react';
import{Link}from'react-router-dom';
import{Mail,Lock,BookOpen}from'lucide-react';
import Button from'../../components/ui/Button';
import Input from'../../components/ui/Input';
import{useAuth}from'../../hooks/useAuth';
import{validateEmail,validatePassword}from'../../utils/validators';
import{ROUTES}from'../../constants/routes';
import toast from'react-hot-toast';

const Login=()=>{
  const{login}=useAuth();
  const[form,setForm]=useState({email:'',password:''});
  const[errors,setErrors]=useState({});
  const[loading,setLoading]=useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));

  // const handleSubmit=async(e)=>{
  //   e.preventDefault();
  //   const errs={};
  //   const emailErr=validateEmail(form.email);if(emailErr)errs.email=emailErr;
  //   const pwErr=validatePassword(form.password);if(pwErr)errs.password=pwErr;
  //   setErrors(errs);
  //   if(Object.keys(errs).length>0)return;
  //   setLoading(true);
  //   try{await login(form.email,form.password);}
  //   catch(err){toast.error(err?.response?.data?.message||'Login failed');}
  //   finally{setLoading(false);}
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== STEP 1: Form submitted ===');
    console.log('Form data:', form);
    
    const errs = {};
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    const pwErr = validatePassword(form.password);
    if (pwErr) errs.password = pwErr;
    setErrors(errs);
    
    console.log('=== STEP 2: Validation errors:', errs);
    
    if (Object.keys(errs).length > 0) {
      console.log('=== BLOCKED by validation ===');
      return;
    }
    
    console.log('=== STEP 3: Calling login API ===');
    setLoading(true);
    try {
      await login(form.email, form.password);
      console.log('=== STEP 4: Login SUCCESS ===');
    } catch (err) {
      console.error('=== STEP 5: Login FAILED ===', err);
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return(
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 mb-4'><BookOpen size={32} className='text-white'/></div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Welcome Back</h1>
          <p className='text-gray-500 dark:text-gray-400 mt-1'>Sign in to your account</p>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <Input label='Email' type='email' value={form.email} onChange={e=>set('email',e.target.value)} error={errors.email} placeholder='you@example.com' leftIcon={<Mail size={18}/>} required/>
            <Input label='Password' type='password' value={form.password} onChange={e=>set('password',e.target.value)} error={errors.password} placeholder='Enter your password' leftIcon={<Lock size={18}/>} required/>
            <Button type='submit' fullWidth loading={loading} size='lg'>Sign In</Button>
          </form>
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>No account? <Link to={ROUTES.REGISTER} className='text-primary-600 dark:text-primary-400 font-medium hover:underline'>Create one</Link></p>
          </div>
          <div className='mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400'>
            <p className='font-medium mb-1'>Demo Accounts:</p>
            <p>Admin: admin@test.com / admin123</p>
            <p>Student: alice@test.com / pass123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
