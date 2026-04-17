import React from 'react';
import{Outlet}from'react-router-dom';
import Navbar from'./Navbar';
import Sidebar from'./Sidebar';
const AdminLayout=()=>(
  <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
    <Navbar/>
    <div className='flex'>
      <Sidebar isAdmin={true}/>
      <main className='flex-1 p-4 sm:p-6 lg:p-8'><Outlet/></main>
    </div>
  </div>
);
export default AdminLayout;
