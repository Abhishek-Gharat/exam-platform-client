import React from 'react';
import{Navigate,Outlet,useLocation}from'react-router-dom';
import{useAuthStore}from'../../store/authStore';
import{ROUTES}from'../../constants/routes';
const ProtectedRoute=()=>{
  const{isAuthenticated}=useAuthStore();
  const loc=useLocation();
  if(!isAuthenticated)return<Navigate to={ROUTES.LOGIN} state={{from:loc}} replace/>;
  return<Outlet/>;
};
export default ProtectedRoute;
