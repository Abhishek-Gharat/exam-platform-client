import React from 'react';
import{Outlet}from'react-router-dom';
import Navbar from'./Navbar';
import Sidebar from'./Sidebar';
const AdminLayout=()=>(
  <div className='min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-primary-50 dark:from-surface-900 dark:via-surface-950 dark:to-primary-950/30'>
    <Navbar/>
    <div className='flex'>
      <Sidebar isAdmin={true}/>
      <main className='flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full'><Outlet/></main>
    </div>
  </div>
);
export default AdminLayout;
