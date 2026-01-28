import axios from 'axios';
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', withCredentials: true });
api.interceptors.request.use((c) => {
  const t = typeof window !== 'undefined' ? localStorage.getItem('consedra_token') : null;
  const s = typeof window !== 'undefined' ? localStorage.getItem('consedra_tenant') : null;
  if (t) c.headers.Authorization = 'Bearer ' + t;
  if (s) c.headers['X-Tenant-Slug'] = s;
  return c;
});
api.interceptors.response.use(r => r, async err => {
  if (err.response?.status === 401 && typeof window !== 'undefined') {
    const rf = localStorage.getItem('consedra_refresh');
    if (rf) { try { const r = await axios.post(api.defaults.baseURL+'/api/auth/refresh', { refreshToken: rf }); localStorage.setItem('consedra_token', r.data.accessToken); localStorage.setItem('consedra_refresh', r.data.refreshToken); err.config.headers.Authorization = 'Bearer '+r.data.accessToken; return api(err.config); } catch { localStorage.removeItem('consedra_token'); window.location.href='/login'; } }
  }
  return Promise.reject(err);
});
export default api;