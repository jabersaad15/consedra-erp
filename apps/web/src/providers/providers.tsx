'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, createContext, useContext, useEffect } from 'react';
import { Toaster } from 'sonner';

interface AuthCtx { user: any; setUser: (u: any) => void; token: string|null; setToken: (t: string|null) => void; tenantSlug: string|null; setTenantSlug: (s: string|null) => void; locale: string; setLocale: (l: string) => void; logout: () => void; }
export const AuthContext = createContext<AuthCtx>({} as any);
export const useAuth = () => useContext(AuthContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } }));
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string|null>(null);
  const [tenantSlug, setTenantSlug] = useState<string|null>(null);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const t = localStorage.getItem('consedra_token');
    const s = localStorage.getItem('consedra_tenant');
    const l = localStorage.getItem('consedra_locale') || 'en';
    if (t) setToken(t);
    if (s) setTenantSlug(s);
    setLocale(l);
    document.documentElement.dir = ['ar','ur','fa'].includes(l) ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => { if (token) localStorage.setItem('consedra_token', token); else localStorage.removeItem('consedra_token'); }, [token]);
  useEffect(() => { localStorage.setItem('consedra_locale', locale); document.documentElement.dir = ['ar','ur','fa'].includes(locale)?'rtl':'ltr'; }, [locale]);

  const logout = () => { setUser(null); setToken(null); localStorage.removeItem('consedra_token'); localStorage.removeItem('consedra_refresh'); window.location.href = '/login'; };

  return (<AuthContext.Provider value={{ user, setUser, token, setToken, tenantSlug, setTenantSlug, locale, setLocale, logout }}>
    <QueryClientProvider client={qc}>{children}<Toaster position="top-right" richColors /></QueryClientProvider>
  </AuthContext.Provider>);
}