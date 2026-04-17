import React,{useState,useEffect}from'react';
import{Link,useNavigate}from'react-router-dom';
import{Sun,Moon,LogOut,User,Menu,X,BookOpen}from'lucide-react';
import{useAuthStore}from'../../store/authStore';
import{ROUTES}from'../../constants/routes';
import Button from'../ui/Button';
import toast from'react-hot-toast';

const Navbar=()=>{
  const nav=useNavigate();
  const{user,isAuthenticated,logout}=useAuthStore();
  const[dark,setDark]=useState(false);
  const[mobileOpen,setMobileOpen]=useState(false);

  useEffect(()=>{
    const s=localStorage.getItem('theme');
    if(s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');setDark(true);}
  },[]);

  const toggleDark=()=>{
    if(dark){document.documentElement.classList.remove('dark');localStorage.setItem('theme','light');setDark(false);}
    else{document.documentElement.classList.add('dark');localStorage.setItem('theme','dark');setDark(true);}
  };

  const handleLogout=()=>{logout();toast.success('Logged out');nav(ROUTES.LOGIN);};

  return(
    <nav className='sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-16'>
          <Link to={ROUTES.DASHBOARD} className='flex items-center gap-2'>
            <BookOpen className='w-7 h-7 text-primary-600 dark:text-primary-400'/>
            <span className='text-xl font-bold text-gray-900 dark:text-white'>JS Exam</span>
          </Link>
          <div className='hidden md:flex items-center gap-3'>
            <button onClick={toggleDark} className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'>{dark?<Sun size={20}/>:<Moon size={20}/>}</button>
            {isAuthenticated&&user&&<>
              <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                <div className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center'><User size={16} className='text-primary-600 dark:text-primary-400'/></div>
                <div className='text-sm'><p className='font-medium text-gray-900 dark:text-white'>{user.name}</p><p className='text-xs text-gray-500 capitalize'>{(user.role||'').toLowerCase()}</p></div>
              </div>
              <Button variant='ghost' size='sm' onClick={handleLogout} leftIcon={<LogOut size={16}/>}>Logout</Button>
            </>}
          </div>
          <div className='md:hidden flex items-center gap-2'>
            <button onClick={toggleDark} className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'>{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
            <button onClick={()=>setMobileOpen(!mobileOpen)} className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'>{mobileOpen?<X size={20}/>:<Menu size={20}/>}</button>
          </div>
        </div>
        {mobileOpen&&isAuthenticated&&user&&<div className='md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-in space-y-3'>
          <div className='flex items-center gap-2 px-2'><div className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center'><User size={16} className='text-primary-600'/></div><div><p className='font-medium text-sm'>{user.name}</p><p className='text-xs text-gray-500 capitalize'>{(user.role||'').toLowerCase()}</p></div></div>
          <button onClick={handleLogout} className='flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'><LogOut size={16}/>Logout</button>
        </div>}
      </div>
    </nav>
  );
};
export default Navbar;
