import React from 'react';
import Badge from'../ui/Badge';
import Button from'../ui/Button';
import{formatDate}from'../../utils/formatters';
import{Eye}from'lucide-react';

const UserTable=({users=[],onViewUser})=>(
  <div className='overflow-x-auto'>
    <table className='w-full text-sm'>
      <thead><tr className='border-b border-gray-200 dark:border-gray-700'>
        <th className='text-left py-3 px-4 font-medium text-gray-500'>Name</th>
        <th className='text-left py-3 px-4 font-medium text-gray-500'>Email</th>
        <th className='text-left py-3 px-4 font-medium text-gray-500'>Role</th>
        <th className='text-left py-3 px-4 font-medium text-gray-500'>Status</th>
        <th className='text-left py-3 px-4 font-medium text-gray-500'>Joined</th>
        <th className='text-left py-3 px-4 font-medium text-gray-500'>Attempts</th>
        <th className='text-left py-3 px-4 font-medium text-gray-500'>Actions</th>
      </tr></thead>
      <tbody>
        {users.map(u=><tr key={u.id} className='border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'>
          <td className='py-3 px-4 font-medium text-gray-900 dark:text-white'>{u.name}</td>
          <td className='py-3 px-4 text-gray-500'>{u.email}</td>
          <td className='py-3 px-4'><Badge variant={u.role==='ADMIN'?'info':'default'} size='sm'>{u.role}</Badge></td>
          <td className='py-3 px-4'><Badge variant={u.status==='active'?'active':'inactive'} size='sm' dot>{u.status}</Badge></td>
          <td className='py-3 px-4 text-gray-500'>{formatDate(u.joinedAt)}</td>
          <td className='py-3 px-4 text-gray-500'>{u.totalAttempts||0}</td>
          <td className='py-3 px-4'><Button variant='ghost' size='sm' onClick={()=>onViewUser&&onViewUser(u)} leftIcon={<Eye size={14}/>}>View</Button></td>
        </tr>)}
      </tbody>
    </table>
  </div>
);
export default UserTable;
