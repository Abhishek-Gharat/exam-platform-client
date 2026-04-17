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
    <aside className='hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-4rem)]'>
      <nav className='flex-1 px-4 py-6 space-y-1'>
        {links.map(({path,label,icon:Icon})=>{
          const active=loc.pathname===path;
          return(<NavLink key={path} to={path} className={'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors '+(active?'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400':'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200')}><Icon size={20}/>{label}</NavLink>);
        })}
      </nav>
    </aside>
  );
};
export default Sidebar;
