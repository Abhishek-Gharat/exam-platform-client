// client/src/pages/admin/Analytics.jsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  Users, BookOpen, ClipboardList, TrendingUp, TrendingDown,
  Download, Activity, Target, Trophy, PieChart, BarChart3,
  LineChart, AlertTriangle, CheckCircle, XCircle, Clock,
  ArrowUpRight, ArrowDownRight, Filter, Calendar, RefreshCw,
  UserX, Award, HelpCircle, Zap, Eye, ChevronDown, ChevronRight
} from 'lucide-react';
import { analyticsAPI } from '../../api/analyticsAPI';
import { examsAPI } from '../../api/examsAPI';
import PageWrapper from '../../components/layout/PageWrapper';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  BarChartComponent, LineChartComponent, PieChartComponent
} from '../../components/admin/AnalyticsChart';
import { formatScore } from '../../utils/formatters';
import toast from 'react-hot-toast';

/* ── Helpers ── */
const unwrapAxios = (res) =>
  res && typeof res === 'object' && 'data' in res && 'status' in res && 'headers' in res
    ? res.data : res;

const unwrapPayload = (raw) => {
  const d = unwrapAxios(raw);
  if (d && typeof d === 'object' && d.success !== undefined && 'data' in d) return d.data;
  return d;
};

const getVal = (obj, ...keys) => {
  if (!obj) return null;
  for (const k of keys) {
    if (obj[k] !== undefined) return obj[k];
  }
  return null;
};

/* ── Stat Card with Trend ── */
const TrendStat = ({ icon: Icon, label, value, trend, trendLabel, color = 'primary' }) => {
  const styles = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    info: 'from-info-500 to-info-600',
    danger: 'from-danger-500 to-danger-600',
  };
  const gradient = styles[color] || styles.primary;
  const isUp = trend > 0;
  const isNeutral = trend === 0 || trend == null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-800 border border-gray-100 dark:border-gray-800 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-[0.05] group-hover:opacity-[0.08] transition-opacity`} />

      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
          <Icon size={16} className="text-white" />
        </div>
        {!isNeutral && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
            isUp
              ? 'text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-900/20'
              : 'text-danger-600 bg-danger-50 dark:text-danger-400 dark:bg-danger-900/20'
          }`}>
            {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wider">{label}</p>
      {trendLabel && (
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{trendLabel}</p>
      )}
    </div>
  );
};

/* ── Section Card ── */
const Section = ({ icon: Icon, title, badge, action, children, className = '', collapsible = false }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className={`bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
      <div
        className={`flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 ${collapsible ? 'cursor-pointer hover:bg-gray-50/50 dark:hover:bg-surface-900/30' : ''}`}
        onClick={collapsible ? () => setOpen(!open) : undefined}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
            <Icon size={13} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
          {badge && (
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
              {badge}
            </span>
          )}
          {collapsible && (
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`} />
          )}
        </div>
        {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
      </div>
      {(!collapsible || open) && <div className="p-4">{children}</div>}
    </div>
  );
};

/* ── Insight Card ── */
const InsightCard = ({ icon: Icon, title, description, type = 'info' }) => {
  const types = {
    info: 'border-info-200 dark:border-info-800 bg-info-50/50 dark:bg-info-900/10',
    warning: 'border-warning-200 dark:border-warning-800 bg-warning-50/50 dark:bg-warning-900/10',
    danger: 'border-danger-200 dark:border-danger-800 bg-danger-50/50 dark:bg-danger-900/10',
    success: 'border-success-200 dark:border-success-800 bg-success-50/50 dark:bg-success-900/10',
  };
  const iconColors = {
    info: 'text-info-500',
    warning: 'text-warning-500',
    danger: 'text-danger-500',
    success: 'text-success-500',
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${types[type]}`}>
      <Icon size={16} className={`${iconColors[type]} flex-shrink-0 mt-0.5`} />
      <div>
        <p className="text-xs font-bold text-gray-900 dark:text-white">{title}</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
};

/* ── Progress Bar ── */
const ProgressBar = ({ label, value, max = 100, color = 'primary', sublabel }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    danger: 'from-danger-500 to-danger-600',
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{label}</span>
          {sublabel && <span className="text-[10px] text-gray-400 flex-shrink-0">{sublabel}</span>}
        </div>
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/* ── Main Analytics ── */
const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [examScores, setExamScores] = useState([]);
  const [attPerDay, setAttPerDay] = useState([]);
  const [typeDist, setTypeDist] = useState([]);
  const [topics, setTopics] = useState([]);
  const [exams, setExams] = useState([]);
  const [selExam, setSelExam] = useState('');
  const [examAn, setExamAn] = useState(null);
  const [examAnLoading, setExamAnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    const load = async () => {
      try {
        const [o, es, ap, td, tp, ex] = await Promise.all([
          analyticsAPI.getOverview(),
          analyticsAPI.getExamScoreChart(),
          analyticsAPI.getAttemptsPerDay(),
          analyticsAPI.getQuestionTypeDistribution(),
          analyticsAPI.getTopicAnalytics(),
          examsAPI.getAllExams(),
        ]);

        setOverview(unwrapPayload(o) || {});
        setExamScores(Array.isArray(unwrapPayload(es)) ? unwrapPayload(es) : []);
        setAttPerDay(Array.isArray(unwrapPayload(ap)) ? unwrapPayload(ap) : []);
        setTypeDist(Array.isArray(unwrapPayload(td)) ? unwrapPayload(td) : []);
        setTopics(Array.isArray(unwrapPayload(tp)) ? unwrapPayload(tp) : []);
        setExams(Array.isArray(unwrapPayload(ex)) ? unwrapPayload(ex) : []);
      } catch (err) {
        console.error('Analytics load error:', err);
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selExam) { setExamAn(null); return; }
    setExamAnLoading(true);
    analyticsAPI.getExamAnalytics(selExam)
      .then((r) => {
        const axiosData = unwrapAxios(r);
        let resolved = axiosData;
        if (axiosData?.data && typeof axiosData.data === 'object') resolved = axiosData.data;
        else if (axiosData?.analytics) resolved = axiosData.analytics;
        else if (axiosData?.exam) resolved = axiosData.exam;
        setExamAn(resolved);
      })
      .catch(() => { toast.error('Failed to load exam analytics'); setExamAn(null); })
      .finally(() => setExamAnLoading(false));
  }, [selExam]);

  /* ── Derived Insights ── */
  const insights = useMemo(() => {
    if (!overview) return [];
    const o = overview;
    const list = [];

    // Pass rate insight
    const passRate = o.overallPassRate || 0;
    if (passRate < 50) {
      list.push({
        icon: AlertTriangle, type: 'danger',
        title: 'Low Overall Pass Rate',
        description: `Only ${passRate}% of students pass. Consider reviewing question difficulty or providing study materials.`
      });
    } else if (passRate > 85) {
      list.push({
        icon: CheckCircle, type: 'success',
        title: 'Excellent Pass Rate',
        description: `${passRate}% pass rate. Your exams are well-calibrated. Consider adding harder questions for top performers.`
      });
    }

    // Weak topics
    const weakTopics = (topics || []).filter(t => (t.avgScore || 0) < 50);
    if (weakTopics.length > 0) {
      list.push({
        icon: Target, type: 'warning',
        title: `${weakTopics.length} Weak Topic${weakTopics.length > 1 ? 's' : ''} Detected`,
        description: `${weakTopics.map(t => t.topic).join(', ')} — students score below 50%. Add practice materials or review questions.`
      });
    }

    // Low attempts
    if ((o.totalAttempts || 0) < (o.totalStudents || 1) * 2) {
      list.push({
        icon: UserX, type: 'warning',
        title: 'Low Student Engagement',
        description: 'Average attempts per student is below 2. Consider sending reminders or making exams more accessible.'
      });
    }

    // Good engagement
    if ((o.totalAttempts || 0) > (o.totalStudents || 1) * 5) {
      list.push({
        icon: Zap, type: 'success',
        title: 'High Student Engagement',
        description: 'Students are actively taking exams. Great platform adoption!'
      });
    }

    return list;
  }, [overview, topics]);

  /* ── Exam Health Metrics ── */
  const examHealth = useMemo(() => {
    if (!examScores || examScores.length === 0) return [];
    return examScores.map(e => {
      const score = e.avgScore || e.averageScore || e.score || 0;
      const health = score >= 70 ? 'good' : score >= 50 ? 'moderate' : 'poor';
      return { ...e, score, health };
    }).sort((a, b) => a.score - b.score);
  }, [examScores]);

  /* ── Topic Analysis ── */
  const sortedTopics = useMemo(() =>
    [...(topics || [])].sort((a, b) => (a.avgScore || 0) - (b.avgScore || 0)),
    [topics]
  );

  const strongTopics = sortedTopics.filter(t => (t.avgScore || 0) >= 70);
  const weakTopics = sortedTopics.filter(t => (t.avgScore || 0) < 50);
  const midTopics = sortedTopics.filter(t => (t.avgScore || 0) >= 50 && (t.avgScore || 0) < 70);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-gray-400 animate-pulse">Loading analytics...</p>
      </div>
    );

  const o = overview || {};

  const examPassRate = getVal(examAn, 'passRate', 'pass_rate');
  const examAvgScore = getVal(examAn, 'averageScore', 'average_score', 'avgScore');
  const examTotalAttempts = getVal(examAn, 'totalAttempts', 'total_attempts', 'attempts');
  const examScoreDist = getVal(examAn, 'scoreDistribution', 'score_distribution');
  const examLeaderboard = getVal(examAn, 'leaderboard', 'topStudents', 'rankings');

  return (
    <PageWrapper
      title="Analytics"
      subtitle="Platform performance, student insights & actionable data"
      actions={
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="exp-input rounded-lg text-xs py-2 px-3"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={13} />} onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      }
    >
      {/* ═══ 1. OVERVIEW STATS ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <TrendStat
          icon={Users} label="Total Students" color="primary"
          value={o.totalStudents || 0}
          trend={o.studentGrowth || null}
          trendLabel="vs last month"
        />
        <TrendStat
          icon={BookOpen} label="Active Exams" color="info"
          value={o.totalExams || 0}
          trend={null}
          trendLabel={`${exams.filter(e => e.isPublished).length || 0} published`}
        />
        <TrendStat
          icon={ClipboardList} label="Total Attempts" color="success"
          value={o.totalAttempts || 0}
          trend={o.attemptGrowth || null}
          trendLabel="vs last month"
        />
        <TrendStat
          icon={TrendingUp} label="Pass Rate" color="warning"
          value={formatScore(o.overallPassRate)}
          trend={o.passRateChange || null}
          trendLabel="vs last month"
        />
      </div>

      {/* ═══ 2. AI INSIGHTS ═══ */}
      {insights.length > 0 && (
        <Section icon={Zap} title="Insights & Recommendations" badge={`${insights.length}`} className="mb-4" collapsible>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {insights.map((insight, idx) => (
              <InsightCard key={idx} {...insight} />
            ))}
          </div>
        </Section>
      )}

      {/* ═══ 3. PERFORMANCE CHARTS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Section icon={BarChart3} title="Avg Score by Exam">
          {examScores.length > 0 ? (
            <BarChartComponent data={examScores} title="" />
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">No exam data yet</p>
          )}
        </Section>
        <Section icon={LineChart} title="Daily Attempts Trend">
          {attPerDay.length > 0 ? (
            <LineChartComponent data={attPerDay} title="" />
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">No attempt data yet</p>
          )}
        </Section>
      </div>

      {/* ═══ 4. TOPIC ANALYSIS + QUESTION TYPES ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Topic Breakdown — 2 cols */}
        <Section
          icon={Target}
          title="Topic Performance"
          badge={`${sortedTopics.length} topics`}
          className="lg:col-span-2"
        >
          {sortedTopics.length > 0 ? (
            <div className="space-y-4">
              {/* Summary badges */}
              <div className="flex flex-wrap gap-2">
                {weakTopics.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20 px-2 py-1 rounded-lg">
                    <XCircle size={10} /> {weakTopics.length} weak (&lt;50%)
                  </span>
                )}
                {midTopics.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/20 px-2 py-1 rounded-lg">
                    <AlertTriangle size={10} /> {midTopics.length} moderate (50-70%)
                  </span>
                )}
                {strongTopics.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20 px-2 py-1 rounded-lg">
                    <CheckCircle size={10} /> {strongTopics.length} strong (&gt;70%)
                  </span>
                )}
              </div>

              {/* Bars */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {sortedTopics.map((t) => {
                  const score = t.avgScore || 0;
                  const color = score >= 70 ? 'success' : score >= 50 ? 'warning' : 'danger';
                  return (
                    <ProgressBar
                      key={t.topic}
                      label={t.topic}
                      value={score}
                      color={color}
                      sublabel={t.totalAttempts ? `${t.totalAttempts} attempts` : ''}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <Target size={20} className="text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">No topic data available</p>
            </div>
          )}
        </Section>

        {/* Question Type Dist — 1 col */}
        <Section icon={PieChart} title="Question Types">
          {typeDist.length > 0 ? (
            <PieChartComponent data={typeDist} title="" />
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">No data</p>
          )}
        </Section>
      </div>

      {/* ═══ 5. EXAM HEALTH OVERVIEW ═══ */}
      {examHealth.length > 0 && (
        <Section
          icon={Activity}
          title="Exam Health Overview"
          badge={`${examHealth.length} exams`}
          className="mb-4"
          collapsible
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exam</th>
                  <th className="text-center py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24">Avg Score</th>
                  <th className="text-center py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">Health</th>
                  <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-40">Performance</th>
                </tr>
              </thead>
              <tbody>
                {examHealth.map((e, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-surface-900/30 transition-colors cursor-pointer"
                    onClick={() => setSelExam(e.examId || e.id || '')}
                  >
                    <td className="py-2 px-3">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white truncate block max-w-[200px]">
                        {e.examTitle || e.title || e.name || `Exam ${idx + 1}`}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-xs font-bold tabular-nums ${
                        e.score >= 70 ? 'text-success-600' : e.score >= 50 ? 'text-warning-600' : 'text-danger-600'
                      }`}>
                        {e.score}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        e.health === 'good'
                          ? 'bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400'
                          : e.health === 'moderate'
                            ? 'bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400'
                            : 'bg-danger-50 text-danger-600 dark:bg-danger-900/20 dark:text-danger-400'
                      }`}>
                        {e.health === 'good' ? <CheckCircle size={9} /> : e.health === 'moderate' ? <AlertTriangle size={9} /> : <XCircle size={9} />}
                        {e.health}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            e.score >= 70 ? 'bg-success-500' : e.score >= 50 ? 'bg-warning-500' : 'bg-danger-500'
                          }`}
                          style={{ width: `${e.score}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* ═══ 6. EXAM-SPECIFIC DEEP DIVE ═══ */}
      <Section
        icon={Eye}
        title="Exam Deep Dive"
        className="mb-4"
        action={
          <div className="flex items-center gap-2">
            <select
              value={selExam}
              onChange={(e) => setSelExam(e.target.value)}
              className="exp-input rounded-lg text-xs py-1.5 px-3 min-w-[180px]"
            >
              <option value="">Select an exam</option>
              {(exams || []).map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
            {selExam && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { analyticsAPI.exportResults(selExam); toast.success('Exporting...'); }}
                leftIcon={<Download size={12} />}
              >
                Export
              </Button>
            )}
          </div>
        }
      >
        {examAnLoading ? (
          <div className="flex flex-col items-center py-12 gap-2">
            <Spinner size="md" />
            <p className="text-xs text-gray-400">Loading exam data...</p>
          </div>
        ) : examAn ? (
          <div className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-success-50/50 dark:bg-success-900/10 border border-success-100 dark:border-success-900/20">
                <TrendingUp size={16} className="text-success-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pass Rate</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{examPassRate ?? '—'}%</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20">
                <Target size={16} className="text-primary-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg Score</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{examAvgScore ?? '—'}%</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-warning-50/50 dark:bg-warning-900/10 border border-warning-100 dark:border-warning-900/20">
                <ClipboardList size={16} className="text-warning-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attempts</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{examTotalAttempts ?? '—'}</p>
              </div>
            </div>

            {/* Score Distribution */}
            {examScoreDist && Array.isArray(examScoreDist) && examScoreDist.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Score Distribution</p>
                <BarChartComponent data={examScoreDist} xKey="range" yKey="count" title="" />
              </div>
            )}

            {/* Leaderboard */}
            {examLeaderboard && Array.isArray(examLeaderboard) && examLeaderboard.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy size={14} className="text-warning-500" />
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Top Performers</p>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
                    {examLeaderboard.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {examLeaderboard.slice(0, 5).map((l, idx) => {
                    const rank = l.rank || idx + 1;
                    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

                    return (
                      <div key={rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-900/50 transition-colors">
                        <span className="w-6 text-center text-xs font-bold text-gray-400">
                          {medal || `#${rank}`}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[10px] font-bold">
                            {(l.name || l.userName || 'U')[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex-1 truncate">
                          {l.name || l.userName || 'Unknown'}
                        </span>
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 tabular-nums">
                          {l.score ?? l.percentage ?? '—'}%
                        </span>
                        <span className="text-[10px] text-gray-400 tabular-nums">
                          {Math.round((l.timeTaken || l.time_taken || 0) / 60)}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Debug fallback */}
            {examPassRate == null && examAvgScore == null && examTotalAttempts == null && (
              <div className="p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
                <p className="text-xs font-medium text-warning-700 dark:text-warning-300 mb-1">
                  ⚠ Data received but fields not recognized. Keys:
                </p>
                <code className="text-[10px] text-warning-600 break-all">
                  {JSON.stringify(Object.keys(examAn))}
                </code>
                <details className="mt-2">
                  <summary className="text-[10px] text-warning-500 cursor-pointer">Raw data</summary>
                  <pre className="text-[10px] mt-1 overflow-auto max-h-32">{JSON.stringify(examAn, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-12">
            <Eye size={24} className="text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm font-medium text-gray-400">Select an exam above</p>
            <p className="text-[11px] text-gray-400 mt-0.5">View pass rates, score distribution & leaderboard</p>
          </div>
        )}
      </Section>

      {/* ═══ 7. PLATFORM SUMMARY ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-surface-900/50 border border-gray-100 dark:border-gray-800 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg per Student</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {o.totalStudents ? ((o.totalAttempts || 0) / o.totalStudents).toFixed(1) : '0'} exams
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-surface-900/50 border border-gray-100 dark:border-gray-800 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Questions Created</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{o.totalQuestions || 0}</p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-surface-900/50 border border-gray-100 dark:border-gray-800 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weakest Topic</p>
          <p className="text-sm font-bold text-danger-600 dark:text-danger-400 mt-1 truncate">
            {weakTopics.length > 0 ? weakTopics[0].topic : 'None'}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-surface-900/50 border border-gray-100 dark:border-gray-800 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Strongest Topic</p>
          <p className="text-sm font-bold text-success-600 dark:text-success-400 mt-1 truncate">
            {strongTopics.length > 0 ? strongTopics[strongTopics.length - 1].topic : 'None'}
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Analytics;