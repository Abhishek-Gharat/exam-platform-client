import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, ClipboardList, TrendingUp, Plus, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { analyticsAPI } from '../../api/analyticsAPI';
import { attemptsAPI } from '../../api/attemptsAPI';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { ROUTES } from '../../constants/routes';
import { formatScore, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color = 'primary' }) => (
  <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
    <div className='flex items-center gap-4'>
      <div className={'w-12 h-12 rounded-xl flex items-center justify-center bg-' + color + '-100 dark:bg-' + color + '-900/30'}>
        <Icon size={24} className={'text-' + color + '-600 dark:text-' + color + '-400'} />
      </div>
      <div>
        <p className='text-sm text-gray-500'>{label}</p>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const nav = useNavigate();
  const [overview, setOverview] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [oRes, aRes] = await Promise.all([
          analyticsAPI.getOverview(),
          attemptsAPI.getAllAttempts()
        ]);
        console.log('Admin Dashboard raw responses:', { oRes, aRes });

        // Helper: detect axios response vs raw data
        const unwrap = (res) => {
          if (res && typeof res === 'object' && 'data' in res && 'status' in res && 'headers' in res) {
            return res.data;
          }
          return res;
        };

        const overviewData = unwrap(oRes);
        const attemptsData = unwrap(aRes);

        console.log('Admin Dashboard unwrapped:', { overviewData, attemptsData });

        setOverview(overviewData || {});
        setAttempts(Array.isArray(attemptsData) ? attemptsData : []);
      } catch (err) {
        console.error('Dashboard load error:', err);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className='flex justify-center py-20'><Spinner size='lg' /></div>;

  const o = overview || {};
  return (
    <PageWrapper title={'Welcome, ' + (user?.name || 'Admin')} subtitle='Admin dashboard overview'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <StatCard icon={Users} label='Total Students' value={o.totalStudents || 0} color='primary' />
        <StatCard icon={BookOpen} label='Total Exams' value={o.totalExams || 0} color='success' />
        <StatCard icon={ClipboardList} label='Total Attempts' value={o.totalAttempts || 0} color='warning' />
        <StatCard icon={TrendingUp} label='Pass Rate' value={formatScore(o.overallPassRate)} color='danger' />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8'>
        <Button onClick={() => nav(ROUTES.ADMIN_QUESTIONS)} leftIcon={<Plus size={16} />} fullWidth>Add Question</Button>
        <Button onClick={() => nav(ROUTES.ADMIN_EXAMS)} leftIcon={<ClipboardList size={16} />} fullWidth variant='secondary'>Create Exam</Button>
        <Button onClick={() => nav(ROUTES.ADMIN_ANALYTICS)} leftIcon={<BarChart3 size={16} />} fullWidth variant='secondary'>View Analytics</Button>
      </div>
      <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold mb-4'>Recent Activity</h3>
        {attempts.length > 0 ? (
          <div className='space-y-3'>
            {attempts.slice(0, 10).map(a => (
              <div key={a.id} className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                <div>
                  <p className='text-sm font-medium'>{a.examTitle || 'Exam'}</p>
                  <p className='text-xs text-gray-500'>
                    {a.userName ? a.userName + ' • ' : ''}{formatDate(a.submittedAt || a.createdAt)}
                  </p>
                </div>
                <Badge variant={a.passed ? 'pass' : 'fail'}>{formatScore(a.score)}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-500 text-center py-8'>No recent activity</p>
        )}
      </div>
    </PageWrapper>
  );
};
export default AdminDashboard;