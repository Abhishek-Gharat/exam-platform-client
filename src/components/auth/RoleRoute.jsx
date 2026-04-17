import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../constants/routes';

const RoleRoute = ({ allowedRoles = [] }) => {
    const { user } = useAuthStore();
    if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
    
    const userRole = user.role?.toUpperCase();
    const allowed = allowedRoles.map(r => r.toUpperCase());
    
    if (!allowed.includes(userRole)) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    return <Outlet />;
};

export default RoleRoute;