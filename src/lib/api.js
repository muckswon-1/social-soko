import axios from 'axios';



const BACKEND_URL = import.meta.env.VITE_SERVER_URL;
const api = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  // Only for unsafe methods
  const unsafe = /^(POST|PUT|PATCH|DELETE)$/i.test(config.method || '');

  if(unsafe) {
    const csrf = getCookie('XSRF-TOKEN');  // implement a tiny cookie reader if you use this pattern
    if(csrf) config.headers['X-CSRF-TOKEN'] = csrf;
  }

  return config;
});

//401 -> try refreshing once, then retry original request
let isRefreshing = false;
let waiters = [];

const notifyWaiters = () => {waiters.forEach((request) => request()); waiters = [];}

api.interceptors.response.use((r) => r,
 async (error) => {
  const {config, response} = error;

  if(!response) return Promise.reject(error); // network timeout

  console.warn('[API error]',
    config?.method?.toUpperCase(),
    config?.url,
    response?.status,
    response?.data
  );

  // Don't attempt to refresh for public auth endpoints or explcit opt-out

  // Could be public routes: verify-email|send-verification-email|forgot-password|reset-password|email-update-with-digit-code|send-verification-digits-code|reset-password-with-digit-code


  const url = (config && config.url) || '';
  // const isPublicAuth = /^\/auth\/(verify-email| send-verification-email | forgot-password)/.test(url);
const isPublicAuth = /^\/auth\/(register|login|forgot-password|send-verification-email|verify-email(?:\/[^/]+)?|reset-password(?:\/.*)?|email-update-with-digit-code|refresh-token)$/.test(url);




  console.log(`is ${url} a public auth route?: ${isPublicAuth}`);

  if(isPublicAuth || config?._skipRefresh) {
    return Promise.reject(error);
  }


  if(response.status === 401 && !config._retry) {
    // queue requests while refreshing
    if(isRefreshing) {
      await new Promise(resolve => waiters.push(resolve));
      config._retry = true;
      return api(config);
    }

    isRefreshing = true;
    config._retry = true;

    try {
      await api.post('/auth/refresh-token', {}, {_skipRefresh: true}); // uses refresh cookie, sets new access cookie
      notifyWaiters();
      return api(config);
    } catch (error) {
       // refresh failed - user mut login again
       return Promise.reject(error);
    }finally {
      isRefreshing = false
    }
  }
  return Promise.reject(error);
 }
);

// Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // Unauthorized - redirect to login
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default api;

// tiny cokie reader if you use CSRF header pattern
export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}