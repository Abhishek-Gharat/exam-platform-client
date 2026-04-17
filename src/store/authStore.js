import { create } from 'zustand';
export const useAuthStore = create((set, get) => ({
  user:null, token:null, isAuthenticated:false,
  login:(token,user)=>{ localStorage.setItem('exam_token',token); localStorage.setItem('exam_user',JSON.stringify(user)); set({user,token,isAuthenticated:true}); },
  logout:()=>{ localStorage.removeItem('exam_token'); localStorage.removeItem('exam_user'); set({user:null,token:null,isAuthenticated:false}); },
  setUser:(user)=>{ localStorage.setItem('exam_user',JSON.stringify(user)); set({user}); },
  loadFromStorage:()=>{ const t=localStorage.getItem('exam_token'); const u=localStorage.getItem('exam_user'); if(t&&u){try{set({user:JSON.parse(u),token:t,isAuthenticated:true});}catch{localStorage.removeItem('exam_token');localStorage.removeItem('exam_user');}} },
  getToken:()=>get().token,
}));
