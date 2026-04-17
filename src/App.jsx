import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ROUTES } from './constants/routes';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';
import StudentLayout from './components/layout/StudentLayout';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/student/Dashboard';
import ExamLobby from './pages/student/ExamLobby';
import ExamRoom from './pages/student/ExamRoom';
import Results from './pages/student/Results';
import History from './pages/student/History';
import AdminDashboard from './pages/admin/AdminDashboard';
import QuestionBank from './pages/admin/QuestionBank';
import ExamManager from './pages/admin/ExamManager';
import Analytics from './pages/admin/Analytics';
import UserManager from './pages/admin/UserManager';
import Spinner from './components/ui/Spinner';
import AIExamGenerator from './pages/admin/AIExamGenerator';

// Helper component to redirect based on role
const SmartRedirect = () => {
    const { isAuthenticated, user } = useAuthStore();
    if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
    if (user?.role === 'ADMIN' || user?.role === 'admin') {
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES.DASHBOARD} replace />;
};

const App = () => {
    const { isAuthenticated, user, loadFromStorage } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFromStorage();
        setLoading(false);
    }, [loadFromStorage]);

    if (loading) return <div className='flex items-center justify-center min-h-screen'><Spinner size='lg' /></div>;

    // Check if user is admin
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';

    return (
        <Routes>
            {/* Auth routes - redirect based on role if already logged in */}
            <Route path={ROUTES.LOGIN} element={
                isAuthenticated ? (isAdmin ? <Navigate to={ROUTES.ADMIN_DASHBOARD} replace /> : <Navigate to={ROUTES.DASHBOARD} replace />) : <Login />
            } />
            <Route path={ROUTES.REGISTER} element={
                isAuthenticated ? (isAdmin ? <Navigate to={ROUTES.ADMIN_DASHBOARD} replace /> : <Navigate to={ROUTES.DASHBOARD} replace />) : <Register />
            } />

            {/* Student routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<StudentLayout />}>
                    <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                    <Route path={ROUTES.EXAM_LOBBY} element={<ExamLobby />} />
                    <Route path={ROUTES.RESULTS} element={<Results />} />
                    <Route path={ROUTES.HISTORY} element={<History />} />
                </Route>
                <Route path={ROUTES.EXAM_ROOM} element={<ExamRoom />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                    <Route element={<AdminLayout />}>
                        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                        <Route path={ROUTES.ADMIN_QUESTIONS} element={<QuestionBank />} />
                        <Route path={ROUTES.ADMIN_EXAMS} element={<ExamManager />} />
                        <Route path={ROUTES.ADMIN_ANALYTICS} element={<Analytics />} />
                        <Route path={ROUTES.ADMIN_USERS} element={<UserManager />} />
                        <Route path="/admin/ai-generator" element={<AIExamGenerator />} />

                    </Route>
                </Route>
            </Route>

            {/* Catch-all - smart redirect based on role */}
            <Route path='*' element={<SmartRedirect />} />
        </Routes>
    );
};

export default App;