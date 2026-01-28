'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/providers';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken, setTenantSlug } = useAuth();
  const [email, setEmail] = useState('admin@consedra.local');
  const [password, setPassword] = useState('Admin123!');
  const [tenant, setTenant] = useState('consedra');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      localStorage.setItem('consedra_tenant', tenant); setTenantSlug(tenant);
      const res = await api.post('/api/auth/login', { email, password, tenantSlug: tenant });
      setToken(res.data.accessToken);
      localStorage.setItem('consedra_token', res.data.accessToken);
      localStorage.setItem('consedra_refresh', res.data.refreshToken);
      const profile = await api.get('/api/auth/profile');
      setUser(profile.data); toast.success('Logged in'); router.push('/dashboard');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Login failed'); } finally { setLoading(false); }
  };

  return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">C</div>
        <h1 className="text-3xl font-bold">Consedra</h1>
        <p className="text-muted-foreground mt-2">Enterprise Management Platform</p>
      </div>
      <form onSubmit={handleLogin} className="bg-card rounded-2xl border shadow-lg p-8 space-y-5">
        <div><label className="text-sm font-medium mb-2 block">Tenant</label><Input value={tenant} onChange={e => setTenant(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-2 block">Email</label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-2 block">Password</label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>SuperAdmin: admin@consedra.local / Admin123!</p>
          <p>Owner: owner@consedra.local / Owner123!</p>
        </div>
      </form>
    </div>
  </div>);
}