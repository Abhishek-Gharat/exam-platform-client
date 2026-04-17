import axiosInstance, { mockApi } from './axiosInstance';

export var analyticsAPI = {
  getOverview: async function() {
    if (mockApi.isActive) { await mockApi.delay(500); return { data: { totalStudents: 156, totalExams: 12, totalAttempts: 487, overallPassRate: 72 } }; }
    return (await axiosInstance.get('/analytics/overview')).data;
  },

  getExamAnalytics: async function(examId) {
    if (mockApi.isActive) {
      await mockApi.delay(400);
      return {
        data: {
          examId: examId, passRate: 68, averageScore: 71, totalAttempts: 45,
          scoreDistribution: [
            { range: '0-20', count: 2 }, { range: '21-40', count: 5 },
            { range: '41-60', count: 12 }, { range: '61-80', count: 18 },
            { range: '81-100', count: 8 }
          ],
          leaderboard: [
            { rank: 1, name: 'Alice', score: 98, timeTaken: 1200 },
            { rank: 2, name: 'Bob', score: 95, timeTaken: 1340 },
            { rank: 3, name: 'Carol', score: 92, timeTaken: 1100 }
          ]
        }
      };
    }
    return (await axiosInstance.get('/analytics/exams/' + examId)).data;
  },

  getTopicAnalytics: async function() {
    if (mockApi.isActive) {
      await mockApi.delay(400);
      return { data: [
        { topic: 'Closures', avgScore: 45, totalQuestions: 15 },
        { topic: 'Promises', avgScore: 52, totalQuestions: 12 },
        { topic: 'Arrays', avgScore: 78, totalQuestions: 20 },
        { topic: 'Variables', avgScore: 88, totalQuestions: 18 }
      ]};
    }
    return (await axiosInstance.get('/analytics/topics')).data;
  },

  getExamScoreChart: async function() {
    if (mockApi.isActive) {
      await mockApi.delay(400);
      return { data: [
        { name: 'JS Fundamentals', avgScore: 72 },
        { name: 'Advanced JS', avgScore: 58 },
        { name: 'React Basics', avgScore: 81 }
      ]};
    }
    return (await axiosInstance.get('/analytics/exam-scores')).data;
  },

  getAttemptsPerDay: async function() {
    if (mockApi.isActive) {
      await mockApi.delay(400);
      var data = [];
      for (var i = 29; i >= 0; i--) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        data.push({ date: d.toISOString().split('T')[0], attempts: Math.floor(Math.random() * 20) + 1 });
      }
      return { data: data };
    }
    return (await axiosInstance.get('/analytics/attempts-per-day')).data;
  },

  getQuestionTypeDistribution: async function() {
    if (mockApi.isActive) {
      await mockApi.delay(300);
      return { data: [{ name: 'MCQ', value: 45 }, { name: 'Explain Me', value: 30 }, { name: 'Write Code', value: 25 }] };
    }
    return (await axiosInstance.get('/analytics/question-types')).data;
  },

  exportResults: async function(examId) {
    if (mockApi.isActive) {
      await mockApi.delay(800);
      var csvText = 'Rank,Name,Score\n1,Alice,98\n2,Bob,95';
      var blob = new Blob([csvText], { type: 'text/csv' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'results-' + examId + '.csv';
      a.click();
      URL.revokeObjectURL(url);
      return { data: { message: 'Exported' } };
    }
    var response = await axiosInstance.get('/analytics/export/' + examId, { responseType: 'blob' });
    var blob2 = new Blob([response.data], { type: 'text/csv' });
    var url2 = URL.createObjectURL(blob2);
    var a2 = document.createElement('a');
    a2.href = url2;
    a2.download = 'results-' + examId + '.csv';
    a2.click();
    URL.revokeObjectURL(url2);
    return { data: { message: 'Exported' } };
  }
};
