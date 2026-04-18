import React,{useState}from'react';
import{Link}from'react-router-dom';
import{Mail,Lock,BookOpen,ArrowRight}from'lucide-react';
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

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const errs={};
    const emailErr=validateEmail(form.email);if(emailErr)errs.email=emailErr;
    const pwErr=validatePassword(form.password);if(pwErr)errs.password=pwErr;
    setErrors(errs);
    if(Object.keys(errs).length>0)return;
    setLoading(true);
    try{await login(form.email,form.password);}
    catch(err){toast.error(err?.response?.data?.message||'Login failed');}
    finally{setLoading(false);}
  };
  return(
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 dark:from-surface-900 dark:via-surface-950 dark:to-primary-950 p-4 relative overflow-hidden'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float'/>
        <div className='absolute bottom-20 right-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float' style={{animationDelay:'2s'}}/>
      </div>
      <div className='relative z-10 w-full max-w-md'>
        <div className='text-center mb-8 animate-fade-up'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-2xl shadow-primary-500/50 mb-4'><BookOpen size={32} className='text-white'/></div>
          <h1 className='text-3xl font-bold text-white mb-2'>Welcome Back</h1>
          <p className='text-primary-100'>Sign in to your account</p>
        </div>
        <div className='exp-card exp-card-flat bg-surface-50/95 dark:bg-surface-900/95 backdrop-blur-xl border border-primary-200/30 dark:border-primary-900/30 p-8 animate-fade-up' style={{animationDelay:'100ms'}}>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <Input label='Email' type='email' value={form.email} onChange={e=>set('email',e.target.value)} error={errors.email} placeholder='you@example.com' leftIcon={<Mail size={18}/>} required/>
            <Input label='Password' type='password' value={form.password} onChange={e=>set('password',e.target.value)} error={errors.password} placeholder='Enter your password' leftIcon={<Lock size={18}/>} required/>
            <Button type='submit' fullWidth loading={loading} size='lg' className='group'>
              Sign In <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform'/>
            </Button>
          </form>
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>No account? <Link to={ROUTES.REGISTER} className='text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 transition-colors'>Create one</Link></p>
          </div>
          <div className='mt-6 p-4 rounded-xl bg-accent-50 dark:bg-accent-950/30 border border-accent-200/50 dark:border-accent-900/50 text-xs text-accent-900 dark:text-accent-200'>
            <p className='font-semibold mb-2'>Demo Accounts:</p>
            <p className='text-accent-800 dark:text-accent-300'>Admin: admin@test.com / admin123</p>
            <p className='text-accent-800 dark:text-accent-300'>Student: alice@test.com / pass123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
