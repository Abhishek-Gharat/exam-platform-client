import{useEffect,useState}from'react';
import{useNavigate}from'react-router-dom';
import{useAuthStore}from'../store/authStore';
import{authAPI}from'../api/authAPI';
import{ROUTES}from'../constants/routes';
import toast from'react-hot-toast';

export const useAuth=()=>{
  const nav=useNavigate();
  const{user,isAuthenticated,login:sLogin,logout:sLogout,setUser,loadFromStorage}=useAuthStore();
  const[isLoading,setIsLoading]=useState(true);

  useEffect(()=>{
    const init=async()=>{
      loadFromStorage();
      const t=localStorage.getItem('exam_token');
      if(t){try{const r=await authAPI.getMe();setUser(r.data.user);}catch{sLogout();}}
      setIsLoading(false);
    };
    init();
  },[]);
const login = async (email, pw) => {
    const r = await authAPI.login(email, pw);
    console.log('=== LOGIN RESPONSE ===');
    console.log('User:', r.data.user);
    console.log('Role:', r.data.user.role);
    
    sLogin(r.data.token, r.data.user);
    toast.success('Welcome, ' + r.data.user.name + '!');
    
    if (r.data.user.role === 'ADMIN' || r.data.user.role === 'admin') {
        console.log('=== NAVIGATING TO ADMIN ===');
        nav(ROUTES.ADMIN_DASHBOARD);
    } else {
        console.log('=== NAVIGATING TO DASHBOARD ===');
        nav(ROUTES.DASHBOARD);
    }
};
  const register=async(name,email,pw)=>{const r=await authAPI.register(name,email,pw);sLogin(r.data.token,r.data.user);toast.success('Account created!');nav(ROUTES.DASHBOARD);};
  const logout=()=>{sLogout();toast.success('Logged out');nav(ROUTES.LOGIN);};
  return{user,isAuthenticated,isLoading,login,register,logout};
};
