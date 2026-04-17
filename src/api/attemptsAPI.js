import axiosInstance, { mockApi } from './axiosInstance';

export var attemptsAPI = {
  startAttempt: async function(examId) {
    if (mockApi.isActive) {
      await mockApi.ready; await mockApi.delay(500);
      var exams = mockApi.exams();
      var exam = exams.allExams.find(function(e) { return e.id === examId; });
      var allQ = mockApi.questions().allQuestions;
      var qIds = exam ? (exam.questionIds || []) : [];
      var selected;
      if (qIds.length > 0) {
        selected = allQ.filter(function(q) { return qIds.indexOf(q.id) !== -1; });
      } else {
        selected = allQ.slice(0, 5);
      }
      var clean = selected.map(function(q) {
        var copy = Object.assign({}, q);
        delete copy.correctOption;
        delete copy.modelAnswer;
        delete copy.expectedOutput;
        delete copy.testCases;
        return copy;
      });
      return {
        data: {
          attemptId: 'attempt-' + Date.now(),
          examId: examId,
          questions: clean,
          timeLimitSecs: exam ? exam.timeLimitSecs : 3600,
          examMeta: {
            title: exam ? exam.title : 'Exam',
            timeLimitSecs: exam ? exam.timeLimitSecs : 3600,
            totalQuestions: clean.length
          }
        }
      };
    }
    return await axiosInstance.post('/attempts/start', { examId: examId });
  },

  submitAttempt: async function(attemptId, answers, tabSwitchCount) {
    if (mockApi.isActive) {
      await mockApi.delay(800);
      var allQ = mockApi.questions().allQuestions;
      var totalScore = 0;
      var maxScore = 0;
      var questionResults = [];
      var entries = Object.entries(answers);
      for (var i = 0; i < entries.length; i++) {
        var qId = entries[i][0];
        var answer = entries[i][1];
        var question = allQ.find(function(q) { return q.id === qId; });
        if (!question) continue;
        var points = question.points || 10;
        maxScore += points;
        var isCorrect = false;
        if (question.type === 'MCQ') isCorrect = answer.selectedOption === question.correctOption;
        else if (question.type === 'EXPLAIN_ME') isCorrect = answer.writtenAnswer && answer.writtenAnswer.trim().length > 10;
        else if (question.type === 'WRITE_CODE') isCorrect = answer.codeAnswer && answer.codeAnswer.trim().length > 5;
        if (isCorrect) totalScore += points;
        questionResults.push({ questionId: qId, question: question, answer: answer, isCorrect: isCorrect, pointsEarned: isCorrect ? points : 0, pointsMax: points });
      }
      var pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
      return {
        data: {
          attemptId: attemptId, score: pct, totalScore: totalScore, maxScore: maxScore,
          passed: pct >= 60, timeTaken: Math.floor(Math.random() * 1800) + 300,
          submittedAt: new Date().toISOString(), tabSwitchCount: tabSwitchCount || 0,
          questionResults: questionResults
        }
      };
    }
    return await axiosInstance.post('/attempts/' + attemptId + '/submit', { answers: answers, tabSwitchCount: tabSwitchCount });
  },

  getAttemptResult: async function(id) {
    if (mockApi.isActive) {
      await mockApi.ready; await mockApi.delay(400);
      var attempts = mockApi.attempts();
      var attempt = attempts.allAttempts.find(function(a) { return a.id === id; });
      return {
        data: attempt || { id: id, examTitle: 'Exam', score: 75, passed: true, timeTaken: 1200, submittedAt: new Date().toISOString(), questionResults: [] }
      };
    }
    return await axiosInstance.get('/attempts/' + id + '/result');
  },

  getMyAttempts: async function() {
    if (mockApi.isActive) {
      await mockApi.ready; await mockApi.delay(400);
      return { data: mockApi.attempts().allAttempts };
    }
    return await axiosInstance.get('/attempts/my');
  },

  getAllAttempts: async function() {
    if (mockApi.isActive) {
      await mockApi.ready; await mockApi.delay(400);
      return { data: mockApi.attempts().allAttempts };
    }
    return await axiosInstance.get('/attempts/all');
  },

  autoSaveAnswer: async function(attemptId, qid, answer) {
    if (mockApi.isActive) { await mockApi.delay(150); return { data: { saved: true } }; }
    return await axiosInstance.patch('/attempts/' + attemptId + '/autosave', { questionId: qid, answer: answer });
  }
};