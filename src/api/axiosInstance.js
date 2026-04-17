import axios from 'axios';
import { useAuthStore } from '../store/authStore';

var USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

var axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use(function(config) {
  var token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

axiosInstance.interceptors.response.use(
  function(response) { return response; },
  function(error) {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

var mU, mE, mQ, mA;

var loadMocks = async function() {
  if (!USE_MOCK) return;
  var u = await import('../mockData/users.js');
  var e = await import('../mockData/exams.js');
  var q = await import('../mockData/questions.js');
  var a = await import('../mockData/attempts.js');
  mU = u; mE = e; mQ = q; mA = a;
};

var mockReady = loadMocks();

var delay = function(ms) {
  if (!ms) ms = 500;
  return new Promise(function(r) { setTimeout(r, ms); });
};

export var mockApi = {
  isActive: USE_MOCK,
  ready: mockReady,
  users: function() { return mU; },
  exams: function() { return mE; },
  questions: function() { return mQ; },
  attempts: function() { return mA; },
  delay: delay
};

export default axiosInstance;
