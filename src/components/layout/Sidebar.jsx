import React from 'react';
import{NavLink,useLocation}from'react-router-dom';
import{LayoutDashboard,History,FileQuestion,ClipboardList,BarChart3,Users,Sparkles}from'lucide-react';
import{ROUTES}from'../../constants/routes';

const studentLinks=[{path:ROUTES.DASHBOARD,label:'Dashboard',icon:LayoutDashboard},{path:ROUTES.HISTORY,label:'History',icon:History}];
const adminLinks=[{path:ROUTES.ADMIN_DASHBOARD,label:'Dashboard',icon:LayoutDashboard},{path:ROUTES.ADMIN_QUESTIONS,label:'Question Bank',icon:FileQuestion},{path:ROUTES.ADMIN_EXAMS,label:'Exams',icon:ClipboardList},{path:ROUTES.ADMIN_ANALYTICS,label:'Analytics',icon:BarChart3},{path:ROUTES.ADMIN_USERS,label:'Users',icon:Users},{path:'/admin/ai-generator',label:'AI Generator',icon:Sparkles}];
const Sidebar=({isAdmin=false})=>{
  const links=isAdmin?adminLinks:studentLinks;
  const loc=useLocation();
  return(
    <aside className='hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shadow-lg'>
      <nav className='flex-1 px-4 py-8 space-y-2'>
        <p className='px-4 text-xs font-poppins font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4'>Navigation</p>
        {links.map(({path,label,icon:Icon},idx)=>{
          const active=loc.pathname===path;
          return(<NavLink key={path} to={path} style={{animationDelay:`${idx*50}ms`}} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 animate-fade-up relative overflow-hidden group ${active?'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg':'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
            {active&&<div className='absolute inset-0 opacity-0 group-hover:opacity-10 bg-white dark:bg-slate-100 transition-opacity'/>}
            <Icon size={20}/>
            <span className='relative'>{label}</span>
          </NavLink>);
        })}
      </nav>
      <div className='px-4 py-4 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-gray-500'>
        <p className='font-semibold'>Exam Platform v1.0</p>
      </div>
    </aside>
  );
};
export default Sidebar;
