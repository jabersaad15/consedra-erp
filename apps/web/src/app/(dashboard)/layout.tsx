'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/providers';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import api from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, user, setUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!token && typeof window !== 'undefined' && !localStorage.getItem('consedra_token')) { router.push('/login'); return; }
    if (!user) api.get('/api/auth/profile').then(r => setUser(r.data)).catch(() => router.push('/login'));
  }, [token, user]);
  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" /></div>;
  return (<div className="min-h-screen bg-background" dir="rtl"><Sidebar /><div className="mr-64"><Header /><main className="p-6">{children}</main></div></div>);
}