import React from 'react';
import Badge from'../ui/Badge';
import Button from'../ui/Button';
import{formatDate}from'../../utils/formatters';
import{Eye}from'lucide-react';

const UserTable=({users=[],onViewUser})=>(
  <div>
    {/* Mobile Card View */}
    <div className='md:hidden space-y-3'>
      {users.map(u=>(
        <div key={u.id} className='exp-card p-4 space-y-2'>
          <div className='flex justify-between items-start gap-2'>
            <div>
              <p className='font-semibold text-gray-900 dark:text-white'>{u.name}</p>
              <p className='text-sm text-gray-500'>{u.email}</p>
            </div>
            <Badge variant={u.role==='ADMIN'?'info':'default'} size='sm'>{u.role}</Badge>
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <span className='text-gray-600 dark:text-gray-400'>Status:</span>
            <Badge variant={u.status==='active'?'active':'inactive'} size='sm' dot>{u.status}</Badge>
          </div>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div>
              <span className='text-gray-500'>Joined:</span>
              <p className='text-gray-900 dark:text-white'>{formatDate(u.joinedAt)}</p>
            </div>
            <div>
              <span className='text-gray-500'>Attempts:</span>
              <p className='text-gray-900 dark:text-white'>{u.totalAttempts||0}</p>
            </div>
          </div>
          <Button variant='ghost' size='sm' onClick={()=>onViewUser&&onViewUser(u)} leftIcon={<Eye size={14}/>} fullWidth>View</Button>
        </div>
      ))}
    </div>

    {/* Desktop Table View */}
    <div className='hidden md:block overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead><tr className='border-b border-gray-200 dark:border-gray-700'>
          <th className='text-left py-2 px-3 font-medium text-xs text-gray-500'>Name</th>
          <th className='text-left py-2 px-3 font-medium text-xs text-gray-500'>Email</th>
          <th className='text-left py-2 px-3 font-medium text-xs text-gray-500'>Role</th>
          <th className='text-left py-2 px-3 font-medium text-xs text-gray-500'>Status</th>
          <th className='text-left py-2 px-3 font-medium text-xs text-gray-500'>Joined</th>
          <th className='text-left py-2 px-3 font-medium text-xs text-gray-500'>Attempts</th>
          <th className='text-left py-2 px-3 font-medium text-xs text-gray-500'>Actions</th>
        </tr></thead>
        <tbody>
          {users.map(u=><tr key={u.id} className='border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'>
            <td className='py-2 px-3 font-medium text-xs text-gray-900 dark:text-white'>{u.name}</td>
            <td className='py-2 px-3 text-xs text-gray-500'>{u.email}</td>
            <td className='py-2 px-3'><Badge variant={u.role==='ADMIN'?'info':'default'} size='sm'>{u.role}</Badge></td>
            <td className='py-2 px-3'><Badge variant={u.status==='active'?'active':'inactive'} size='sm' dot>{u.status}</Badge></td>
            <td className='py-2 px-3 text-xs text-gray-500'>{formatDate(u.joinedAt)}</td>
            <td className='py-2 px-3 text-xs text-gray-500'>{u.totalAttempts||0}</td>
            <td className='py-2 px-3'><Button variant='ghost' size='sm' onClick={()=>onViewUser&&onViewUser(u)} leftIcon={<Eye size={14}/>}>View</Button></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>
);
export default UserTable;
