export const allExams = [
  {
    id: 'exam-1', title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of core JS concepts.',
    status: 'PUBLISHED', timeLimitSecs: 3600, totalQuestions: 8,
    passingScore: 60, randomize: false,
    questionIds: ['q1','q2','q3','q4','q5','q9','q15','q16'],
    difficultyMix: { easy: 3, medium: 3, hard: 2 },
    totalAttempts: 45, createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'exam-2', title: 'Advanced JavaScript',
    description: 'Challenge yourself with advanced JS topics.',
    status: 'PUBLISHED', timeLimitSecs: 5400, totalQuestions: 7,
    passingScore: 60, randomize: true,
    questionIds: ['q6','q7','q8','q10','q17','q18','q19'],
    difficultyMix: { easy: 0, medium: 4, hard: 3 },
    totalAttempts: 28, createdAt: '2024-02-01T10:00:00Z'
  }
];
export const publishedExams = allExams.filter(function(e) { return e.status === 'PUBLISHED'; });
