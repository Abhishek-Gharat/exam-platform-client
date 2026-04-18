import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, ClipboardList, TrendingUp,
  Plus, BarChart3, ArrowUpRight, Activity, Sparkles
} from 'lucide-react';
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

const StatCard = ({ icon: Icon, label, value, color = 'primary', index = 0 }) => {
  const styles = {
    primary: {
      gradient: 'from-primary-500 to-primary-600',
      bg: 'bg-primary-50 dark:bg-primary-950/20',
      ring: 'ring-primary-100 dark:ring-primary-900/30',
      text: 'text-primary-600 dark:text-primary-400',
      glow: 'shadow-primary-500/5',
    },
    success: {
      gradient: 'from-success-500 to-success-600',
      bg: 'bg-success-50 dark:bg-success-950/20',
      ring: 'ring-success-100 dark:ring-success-900/30',
      text: 'text-success-600 dark:text-success-400',
      glow: 'shadow-success-500/5',
    },
    warning: {
      gradient: 'from-warning-500 to-warning-600',
      bg: 'bg-warning-50 dark:bg-warning-950/20',
      ring: 'ring-warning-100 dark:ring-warning-900/30',
      text: 'text-warning-600 dark:text-warning-400',
      glow: 'shadow-warning-500/5',
    },
    danger: {
      gradient: 'from-danger-500 to-danger-600',
      bg: 'bg-danger-50 dark:bg-danger-950/20',
      ring: 'ring-danger-100 dark:ring-danger-900/30',
      text: 'text-danger-600 dark:text-danger-400',
      glow: 'shadow-danger-500/5',
    },
  };

  const s = styles[color] || styles.primary;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl bg-white dark:bg-surface-800 
        border border-gray-100 dark:border-gray-800 
        p-5 transition-all duration-300 
        hover:shadow-lg hover:-translate-y-0.5 ${s.glow}
        group cursor-default
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Subtle background accent */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${s.gradient} opacity-[0.06] group-hover:opacity-[0.1] transition-opacity`} />

      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm`}>
          <Icon size={18} className="text-white" />
        </div>
        <ArrowUpRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors" />
      </div>

      <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">{label}</p>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, sublabel, onClick, variant = 'default' }) => {
  const variants = {
    default: 'border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50/50 dark:hover:bg-primary-950/20',
    accent: 'border-primary-200 dark:border-primary-800/60 bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/30 dark:to-surface-800 hover:shadow-md hover:shadow-primary-500/10',
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-800 
        border transition-all duration-200 group text-left w-full
        hover:-translate-y-0.5 active:translate-y-0
        ${variants[variant]}
      `}
    >
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
        ${variant === 'accent'
          ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400'
        }
      `}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{sublabel}</p>
      </div>
      <ArrowUpRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
    </button>
  );
};

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
          attemptsAPI.getAllAttempts(),
        ]);
        const unwrap = (res) =>
          res && typeof res === 'object' && 'data' in res && 'status' in res && 'headers' in res
            ? res.data
            : res;
        setOverview(unwrap(oRes) || {});
        setAttempts(Array.isArray(unwrap(aRes)) ? unwrap(aRes) : []);
      } catch (err) {
        console.error('Dashboard load error:', err);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-gray-400 dark:text-gray-500 animate-pulse">Loading dashboard...</p>
      </div>
    );

  const o = overview || {};
  const statCards = [
    { icon: Users, label: 'Total Students', value: o.totalStudents || 0, color: 'primary' },
    { icon: BookOpen, label: 'Total Exams', value: o.totalExams || 0, color: 'success' },
    { icon: ClipboardList, label: 'Total Attempts', value: o.totalAttempts || 0, color: 'warning' },
    { icon: TrendingUp, label: 'Pass Rate', value: formatScore(o.overallPassRate), color: 'danger' },
  ];

  return (
    <PageWrapper
      title={
        <span className="flex items-center gap-2">
          Welcome back, {user?.name || 'Admin'}
          <Sparkles size={20} className="text-warning-500" />
        </span>
      }
      subtitle="Here's what's happening with your platform today"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {statCards.map((item, idx) => (
          <div key={idx} className="animate-fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
            <StatCard {...item} index={idx} />
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1 mb-1">
            Quick Actions
          </h3>
          <QuickAction
            icon={Plus}
            label="Add Question"
            sublabel="Create new question"
            onClick={() => nav(ROUTES.ADMIN_QUESTIONS)}
            variant="accent"
          />
          <QuickAction
            icon={ClipboardList}
            label="Create Exam"
            sublabel="Build a new exam"
            onClick={() => nav(ROUTES.ADMIN_EXAMS)}
          />
          <QuickAction
            icon={BarChart3}
            label="View Analytics"
            sublabel="Performance insights"
            onClick={() => nav(ROUTES.ADMIN_ANALYTICS)}
          />
        </div>

        {/* Recent Activity */}
        <div
          className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-up"
          style={{ animationDelay: '300ms' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Activity</h3>
              {attempts.length > 0 && (
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
                  {attempts.length}
                </span>
              )}
            </div>
            {attempts.length > 10 && (
              <button
                onClick={() => nav(ROUTES.ADMIN_ANALYTICS)}
                className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                View all
              </button>
            )}
          </div>

          {/* Activity List */}
          {attempts.length > 0 ? (
            <div className="divide-y divide-gray-50 dark:divide-gray-800/50 max-h-[420px] overflow-y-auto">
              {attempts.slice(0, 10).map((a, idx) => (
                <div
                  key={a.id}
                  style={{ animationDelay: `${(idx * 40) + 300}ms` }}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50/70 dark:hover:bg-surface-900/50 transition-colors animate-fade-up group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white text-xs font-bold">
                        {(a.userName || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {a.examTitle || 'Exam'}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                        {a.userName ? `${a.userName} • ` : ''}
                        {formatDate(a.submittedAt || a.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={a.passed ? 'pass' : 'fail'}>{formatScore(a.score)}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 px-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <Activity size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No recent activity</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Attempts will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;