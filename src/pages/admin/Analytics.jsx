import React, { useEffect, useState } from 'react';
import { Users, BookOpen, ClipboardList, TrendingUp, Download } from 'lucide-react';
import { analyticsAPI } from '../../api/analyticsAPI';
import { examsAPI } from '../../api/examsAPI';
import PageWrapper from '../../components/layout/PageWrapper';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { BarChartComponent, LineChartComponent, PieChartComponent } from '../../components/admin/AnalyticsChart';
import { formatScore } from '../../utils/formatters';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4'>
    <div className='w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center'>
      <Icon size={24} className='text-primary-600' />
    </div>
    <div>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='text-2xl font-bold'>{value}</p>
    </div>
  </div>
);

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [examScores, setExamScores] = useState([]);
  const [attPerDay, setAttPerDay] = useState([]);
  const [typeDist, setTypeDist] = useState([]);
  const [topics, setTopics] = useState([]);
  const [exams, setExams] = useState([]);
  const [selExam, setSelExam] = useState('');
  const [examAn, setExamAn] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
    const load = async () => {
      try {
        const [o, es, ap, td, tp, ex] = await Promise.all([
          analyticsAPI.getOverview(),
          analyticsAPI.getExamScoreChart(),
          analyticsAPI.getAttemptsPerDay(),
          analyticsAPI.getQuestionTypeDistribution(),
          analyticsAPI.getTopicAnalytics(),
          examsAPI.getAllExams()
        ]);
        console.log('Analytics raw responses:', { o, es, ap, td, tp, ex });

        // Helper: if response is axios response (has .data and .status), unwrap it
        // otherwise it's already the raw data
        const unwrap = (res) => {
          if (res && typeof res === 'object' && 'data' in res && 'status' in res && 'headers' in res) {
            return res.data;
          }
          return res;
        };

        const overviewData = unwrap(o);
        const examScoresData = unwrap(es);
        const attPerDayData = unwrap(ap);
        const typeDistData = unwrap(td);
        const topicsData = unwrap(tp);
        const examsData = unwrap(ex);

        console.log('Unwrapped data:', { overviewData, examScoresData, attPerDayData, typeDistData, topicsData, examsData });

        setOverview(overviewData || {});
        setExamScores(Array.isArray(examScoresData) ? examScoresData : []);
        setAttPerDay(Array.isArray(attPerDayData) ? attPerDayData : []);
        setTypeDist(Array.isArray(typeDistData) ? typeDistData : []);
        setTopics(Array.isArray(topicsData) ? topicsData : []);
        setExams(Array.isArray(examsData) ? examsData : []);
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
    if (selExam) {
      analyticsAPI.getExamAnalytics(selExam)
        .then(r => {
          const data = (r && r.data && r.status && r.headers) ? r.data : r;
          setExamAn(data);
        })
        .catch(() => {});
    } else {
      setExamAn(null);
    }
  }, [selExam]);

  if (loading) return <div className='flex justify-center py-20'><Spinner size='lg' /></div>;
  const o = overview || {};

  /* Safe sorted copy — never mutate state directly */
  const sortedTopics = [...(topics || [])].sort((a, b) => (a.avgScore || 0) - (b.avgScore || 0));

  return (
    <PageWrapper title='Analytics' subtitle='Platform performance overview'>
      {/* Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <StatCard icon={Users} label='Students' value={o.totalStudents || 0} />
        <StatCard icon={BookOpen} label='Exams' value={o.totalExams || 0} />
        <StatCard icon={ClipboardList} label='Attempts' value={o.totalAttempts || 0} />
        <StatCard icon={TrendingUp} label='Pass Rate' value={formatScore(o.overallPassRate)} />
      </div>

      {/* Charts Row 1 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <BarChartComponent data={examScores || []} title='Average Score by Exam' />
        <LineChartComponent data={attPerDay || []} title='Attempts per Day (Last 30 Days)' />
      </div>

      {/* Charts Row 2 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <PieChartComponent data={typeDist || []} title='Question Type Distribution' />
        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
          <h3 className='text-lg font-semibold mb-4'>Topic Weakness</h3>
          <div className='space-y-3'>
            {sortedTopics.length > 0 ? sortedTopics.map(t => (
              <div key={t.topic} className='flex items-center gap-3'>
                <span className='text-sm font-medium w-24 truncate'>{t.topic}</span>
                <div className='flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                  <div
                    className={'h-full rounded-full transition-all ' + (t.avgScore >= 70 ? 'bg-success-500' : t.avgScore >= 50 ? 'bg-warning-500' : 'bg-danger-500')}
                    style={{ width: (t.avgScore || 0) + '%' }}
                  />
                </div>
                <span className='text-sm font-medium w-12 text-right'>{t.avgScore || 0}%</span>
              </div>
            )) : (
              <p className='text-sm text-gray-500 text-center py-4'>No topic data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Exam-Specific Analytics */}
      <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>Exam-Specific Analytics</h3>
          <div className='flex items-center gap-3'>
            <select value={selExam} onChange={e => setSelExam(e.target.value)} className='rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-800'>
              <option value=''>Select an exam</option>
              {(exams || []).map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            {selExam && (
              <Button variant='secondary' size='sm' onClick={() => { analyticsAPI.exportResults(selExam); toast.success('Exporting...'); }} leftIcon={<Download size={14} />}>
                Export CSV
              </Button>
            )}
          </div>
        </div>
        {examAn ? (
          <div>
            <div className='grid grid-cols-3 gap-4 mb-6'>
              <div className='text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50'>
                <p className='text-sm text-gray-500'>Pass Rate</p>
                <p className='text-2xl font-bold'>{examAn.passRate}%</p>
              </div>
              <div className='text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50'>
                <p className='text-sm text-gray-500'>Avg Score</p>
                <p className='text-2xl font-bold'>{examAn.averageScore}%</p>
              </div>
              <div className='text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50'>
                <p className='text-sm text-gray-500'>Attempts</p>
                <p className='text-2xl font-bold'>{examAn.totalAttempts}</p>
              </div>
            </div>
            {examAn.scoreDistribution && (
              <div className='mb-6'>
                <BarChartComponent data={examAn.scoreDistribution} xKey='range' yKey='count' title='Score Distribution' />
              </div>
            )}
            {examAn.leaderboard && examAn.leaderboard.length > 0 && (
              <div>
                <h4 className='text-sm font-semibold mb-3'>Leaderboard</h4>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b border-gray-200 dark:border-gray-700'>
                        <th className='text-left py-2 px-3 font-medium text-gray-500'>Rank</th>
                        <th className='text-left py-2 px-3 font-medium text-gray-500'>Name</th>
                        <th className='text-left py-2 px-3 font-medium text-gray-500'>Score</th>
                        <th className='text-left py-2 px-3 font-medium text-gray-500'>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examAn.leaderboard.map(l => (
                        <tr key={l.rank} className='border-b border-gray-100 dark:border-gray-700/50'>
                          <td className='py-2 px-3'>
                            <span className={'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ' + (l.rank <= 3 ? 'bg-warning-100 text-warning-700' : 'bg-gray-100 text-gray-600')}>
                              {l.rank}
                            </span>
                          </td>
                          <td className='py-2 px-3 font-medium'>{l.name}</td>
                          <td className='py-2 px-3 font-bold text-primary-600'>{l.score}%</td>
                          <td className='py-2 px-3 text-gray-500'>{Math.round((l.timeTaken || 0) / 60)}min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className='text-sm text-gray-500 text-center py-8'>Select an exam to view detailed analytics</p>
        )}
      </div>
    </PageWrapper>
  );
};

export default Analytics;