// import axiosInstance, { mockApi } from './axiosInstance';

// export var authAPI = {
//   login: async function(email, password) {
//     if (mockApi.isActive) {
//       await mockApi.ready;
//       await mockApi.delay(600);
//       var users = mockApi.users();
//       var user = users.allUsers.find(function(u) { return u.email === email && u.password === password; });
//       if (!user) throw { response: { data: { message: 'Invalid credentials' } } };
//       var safeUser = Object.assign({}, user);
//       delete safeUser.password;
//       return { data: { token: 'mock-' + user.id, user: safeUser } };
//     }
//     var response = await axiosInstance.post('/auth/login', { email: email, password: password });
// return response;
//   },

//   register: async function(name, email, password) {
//     if (mockApi.isActive) {
//       await mockApi.ready;
//       await mockApi.delay(600);
//       var users = mockApi.users();
//       var exists = users.allUsers.find(function(u) { return u.email === email; });
//       if (exists) throw { response: { data: { message: 'Email already in use' } } };
//       var newUser = { id: 'user-' + Date.now(), name: name, email: email, role: 'STUDENT', status: 'active', joinedAt: new Date().toISOString() };
//       return { data: { token: 'mock-' + newUser.id, user: newUser } };
//     }
//     var response = await axiosInstance.post('/auth/register', { name: name, email: email, password: password });
// return response;
//   },

//   getMe: async function() {
//     if (mockApi.isActive) {
//       await mockApi.ready;
//       await mockApi.delay(200);
//       var token = localStorage.getItem('exam_token');
//       if (!token) throw { response: { status: 401 } };
//       var users = mockApi.users();
//       var userId = token.replace('mock-', '');
//       var user = users.allUsers.find(function(u) { return u.id === userId; });
//       if (!user) throw { response: { status: 401 } };
//       var safeUser = Object.assign({}, user);
//       delete safeUser.password;
//       return { data: { user: safeUser } };
//     }
//     var response = await axiosInstance.get('/auth/me');
// return response;
//   }
// };


import axiosInstance from './axiosInstance';

export const authAPI = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response;
  },

  register: async (name, email, password) => {
    const response = await axiosInstance.post('/auth/register', { name, email, password });
    return response;
  },

  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response;
  },
};