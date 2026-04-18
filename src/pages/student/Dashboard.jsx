import React, { useEffect, useState } from 'react';
import { BookOpen, Trophy, Target, ArrowUpRight, Sparkles, Clock, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { examsAPI } from '../../api/examsAPI';
import { attemptsAPI } from '../../api/attemptsAPI';
import PageWrapper from '../../components/layout/PageWrapper';
import ExamCard from '../../components/exam/ExamCard';
import ResultCard from '../../components/exam/ResultCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatScore } from '../../utils/formatters';
import toast from 'react-hot-toast';

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, label, value, color = 'primary', index = 0 }) => {
  const styles = {
    primary: { gradient: 'from-primary-500 to-primary-600', glow: 'shadow-primary-500/5' },
    success: { gradient: 'from-success-500 to-success-600', glow: 'shadow-success-500/5' },
    warning: { gradient: 'from-warning-500 to-warning-600', glow: 'shadow-warning-500/5' },
  };
  const s = styles[color] || styles.primary;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl bg-white dark:bg-surface-800
        border border-gray-100 dark:border-gray-800
        p-4 transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5 ${s.glow}
        group cursor-default
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${s.gradient} opacity-[0.06] group-hover:opacity-[0.1] transition-opacity`} />

      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm`}>
          <Icon size={16} className="text-white" />
        </div>
        <ArrowUpRight size={13} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" />
      </div>

      <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">{label}</p>
    </div>
  );
};

/* ── Section Header ── */
const SectionHeader = ({ icon: Icon, title, count, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
        <Icon size={13} className="text-white" />
      </div>
      <h2 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h2>
      {count != null && (
        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
          {count}
        </span>
      )}
    </div>
    {action}
  </div>
);

/* ── Main Dashboard ── */
const Dashboard = () => {
  const { user } = useAuthStore();
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [exRes, atRes] = await Promise.all([
          examsAPI.getPublishedExams(),
          attemptsAPI.getMyAttempts(),
        ]);
        setExams(exRes.data || []);
        setAttempts(atRes.data || []);
      } catch (e) {
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
        <p className="text-sm text-gray-400 dark:text-gray-500 animate-pulse">Loading your dashboard...</p>
      </div>
    );

  const totalExams = attempts.length;
  const avgScore = totalExams > 0 ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / totalExams) : 0;
  const bestScore = totalExams > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;
  const recent = attempts.slice(0, 3);

  return (
    <PageWrapper
      title={
        <span className="flex items-center gap-2">
          Welcome back, {user?.name || 'Student'}
          <Sparkles size={20} className="text-warning-500" />
        </span>
      }
      subtitle="Here's your exam overview and progress"
    >
      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6">
        {[
          { icon: BookOpen, label: 'Exams Taken', value: totalExams, color: 'primary' },
          { icon: Target, label: 'Average Score', value: formatScore(avgScore), color: 'success' },
          { icon: Trophy, label: 'Best Score', value: formatScore(bestScore), color: 'warning' },
        ].map((item, idx) => (
          <div key={idx} className="animate-fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
            <StatCard {...item} index={idx} />
          </div>
        ))}
      </div>

      {/* ── Available Exams + Recent Results ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">

        {/* Exams — 2 cols */}
        <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <SectionHeader
            icon={BookOpen}
            title="Available Exams"
            count={exams.length > 0 ? exams.length : null}
          />
          {exams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exams.map((e, idx) => (
                <div
                  key={e.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${(idx * 60) + 200}ms` }}
                >
                  <ExamCard exam={e} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-surface-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <BookOpen size={24} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No exams available</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Check back later for new exams</p>
            </div>
          )}
        </div>

        {/* Recent Results — 1 col sidebar */}
        <div className="lg:col-span-1 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <SectionHeader
            icon={Clock}
            title="Recent Results"
            count={recent.length > 0 ? recent.length : null}
          />
          {recent.length > 0 ? (
            <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {recent.map((a, idx) => (
                  <div
                    key={a.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${(idx * 60) + 300}ms` }}
                  >
                    <ResultCard attempt={a} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-surface-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                <Trophy size={20} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No results yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Take an exam to see results</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;