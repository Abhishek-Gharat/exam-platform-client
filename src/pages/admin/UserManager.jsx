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
      <div className='exp-card exp-card-flat overflow-hidden'>
        <UserTable users={filtered} onViewUser={setSelectedUser}/>
      </div>}
      <Modal isOpen={!!selectedUser} onClose={()=>setSelectedUser(null)} title='User Profile' size='md'>
        {selectedUser&&<div className='space-y-6'>
          <div className='flex items-center gap-4'>
            <div className='w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0'>
              <span className='text-3xl font-bold text-white'>{selectedUser.name?.charAt(0)}</span>
            </div>
            <div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>{selectedUser.name}</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{selectedUser.email}</p>
              <div className='flex gap-2 mt-3'>
                <Badge variant={selectedUser.role==='ADMIN'?'info':'default'} size='sm'>{selectedUser.role}</Badge>
                <Badge variant={selectedUser.status==='active'?'pass':'fail'} size='sm' dot>{selectedUser.status}</Badge>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-950/20 dark:to-primary-900/10 border border-primary-200/50 dark:border-primary-800/50'>
            <div>
              <p className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide'>Joined</p>
              <p className='font-bold text-gray-900 dark:text-white mt-2'>{formatDate(selectedUser.joinedAt)}</p>
            </div>
            <div>
              <p className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide'>Total Attempts</p>
              <p className='font-bold text-gray-900 dark:text-white mt-2'>{selectedUser.totalAttempts||0}</p>
            </div>
          </div>
        </div>}
      </Modal>
    </PageWrapper>
  );
};
export default UserManager;
