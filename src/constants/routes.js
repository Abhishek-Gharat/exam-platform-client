export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EXAM_LOBBY: '/exam/:id/lobby',
  EXAM_ROOM: '/exam/:id/room',
  RESULTS: '/results/:id',
  HISTORY: '/history',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_EXAMS: '/admin/exams',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_USERS: '/admin/users',
};

export const buildRoute = {
  examLobby: function(id) { return '/exam/' + id + '/lobby'; },
  examRoom: function(id) { return '/exam/' + id + '/room'; },
  results: function(id) { return '/results/' + id; },
};
