import React,{useEffect,useState}from'react';
import{useAuthStore}from'../../store/authStore';
import PageWrapper from'../../components/layout/PageWrapper';
import SearchBar from'../../components/ui/SearchBar';
import Spinner from'../../components/ui/Spinner';
import EmptyState from'../../components/ui/EmptyState';
import Modal from'../../components/ui/Modal';
import Badge from'../../components/ui/Badge';
import UserTable from'../../components/admin/UserTable';
import{Users}from'lucide-react';
import{formatDate}from'../../utils/formatters';
import toast from'react-hot-toast';

const UserManager=()=>{
  const[users,setUsers]=useState([]);
  const[loading,setLoading]=useState(true);
  const[search,setSearch]=useState('');
  const[selectedUser,setSelectedUser]=useState(null);

  useEffect(()=>{
    const load=async()=>{
      try{
        const mod=await import('../../mockData/users');
        const allUsers=mod.allUsers||[];
        setUsers(allUsers.map(({password,...u})=>u));
      }catch{toast.error('Failed to load users');}
      finally{setLoading(false);}
    };
    load();
  },[]);

  const filtered=users.filter(u=>
    u.name.toLowerCase().includes(search.toLowerCase())||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if(loading)return<div className='flex justify-center py-20'><Spinner size='lg'/></div>;

  return(
    <PageWrapper title='User Manager' subtitle='Manage platform users'>
      <div className='mb-6'>
        <SearchBar value={search} onChange={setSearch} placeholder='Search by name or email...' className='max-w-md'/>
      </div>
      {filtered.length===0?<EmptyState icon={Users} title='No users found' description='No users match your search.'/>:
      <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <UserTable users={filtered} onViewUser={setSelectedUser}/>
      </div>}
      <Modal isOpen={!!selectedUser} onClose={()=>setSelectedUser(null)} title='User Profile' size='md'>
        {selectedUser&&<div className='space-y-4'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center'>
              <span className='text-2xl font-bold text-primary-600'>{selectedUser.name?.charAt(0)}</span>
            </div>
            <div>
              <h3 className='text-lg font-semibold'>{selectedUser.name}</h3>
              <p className='text-sm text-gray-500'>{selectedUser.email}</p>
              <div className='flex gap-2 mt-1'>
                <Badge variant={selectedUser.role==='ADMIN'?'info':'default'} size='sm'>{selectedUser.role}</Badge>
                <Badge variant={selectedUser.status==='active'?'active':'inactive'} size='sm' dot>{selectedUser.status}</Badge>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50'>
              <p className='text-sm text-gray-500'>Joined</p>
              <p className='font-medium'>{formatDate(selectedUser.joinedAt)}</p>
            </div>
            <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50'>
              <p className='text-sm text-gray-500'>Total Attempts</p>
              <p className='font-medium'>{selectedUser.totalAttempts||0}</p>
            </div>
          </div>
        </div>}
      </Modal>
    </PageWrapper>
  );
};
export default UserManager;
