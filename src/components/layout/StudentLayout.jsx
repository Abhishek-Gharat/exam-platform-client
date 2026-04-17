import React from 'react';
import{Outlet}from'react-router-dom';
import Navbar from'./Navbar';
import Sidebar from'./Sidebar';
const StudentLayout=()=>(
  <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
    <Navbar/>
    <div className='flex'>
      <Sidebar isAdmin={false}/>
      <main className='flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl'><Outlet/></main>
    </div>
  </div>
);
export default StudentLayout;
