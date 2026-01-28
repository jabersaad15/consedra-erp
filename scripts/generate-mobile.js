const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'apps', 'mobile');

function w(rel, content) {
  const fp = path.join(root, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content.trimStart(), 'utf-8');
  console.log('  ' + rel);
}

console.log('Generating Expo mobile app...');

// ── package.json ──
w('package.json', `
{
  "name": "@consedra/mobile",
  "version": "1.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-localization": "~16.0.0",
    "react": "18.3.1",
    "react-native": "0.76.6",
    "react-native-safe-area-context": "~5.0.0",
    "react-native-screens": "~4.4.0",
    "@tanstack/react-query": "^5.62.0",
    "i18next": "^24.2.0",
    "react-i18next": "^15.4.0",
    "@react-native-async-storage/async-storage": "2.1.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.0",
    "typescript": "^5.7.0"
  }
}
`);

// ── app.json ──
w('app.json', `
{
  "expo": {
    "name": "Consedra Admin",
    "slug": "consedra-admin",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "consedra",
    "userInterfaceStyle": "automatic",
    "splash": {
      "backgroundColor": "#0F172A"
    },
    "ios": { "supportsTablet": true, "bundleIdentifier": "com.consedra.admin" },
    "android": { "adaptiveIcon": { "backgroundColor": "#0F172A" }, "package": "com.consedra.admin" },
    "plugins": ["expo-router", "expo-localization", "expo-secure-store"]
  }
}
`);

// ── tsconfig.json ──
w('tsconfig.json', `
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
`);

// ── babel.config.js ──
w('babel.config.js', `
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
`);

// ── assets placeholder
w('assets/.gitkeep', '');

// ── src/lib/api.ts ──
w('src/lib/api.ts', `
import * as SecureStore from 'expo-secure-store';

const BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000';

async function getHeaders(): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync('accessToken');
  const tenant = await SecureStore.getItemAsync('tenantSlug');
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = 'Bearer ' + token;
  if (tenant) h['X-Tenant-Slug'] = tenant;
  return h;
}

export async function api<T = any>(endpoint: string, opts?: RequestInit): Promise<T> {
  const headers = await getHeaders();
  const res = await fetch(BASE + endpoint, { ...opts, headers: { ...headers, ...opts?.headers } });
  if (res.status === 401) {
    const ok = await refreshToken();
    if (ok) return api(endpoint, opts);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function refreshToken(): Promise<boolean> {
  const rt = await SecureStore.getItemAsync('refreshToken');
  if (!rt) return false;
  try {
    const res = await fetch(BASE + '/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    return true;
  } catch { return false; }
}
`);

// ── src/lib/auth.tsx ──
w('src/lib/auth.tsx', `
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from './api';

interface User { id: string; email: string; firstName: string; lastName: string; isSuperAdmin: boolean; }
interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, tenant: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        try {
          const u = await api('/api/auth/profile');
          setUser(u);
        } catch { await SecureStore.deleteItemAsync('accessToken'); }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string, tenant: string) => {
    await SecureStore.setItemAsync('tenantSlug', tenant);
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    setUser(data.user);
  };

  const logout = async () => {
    try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}
`);

// ── src/i18n/index.ts ──
w('src/i18n/index.ts', `
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './en.json';
import ar from './ar.json';

const lng = Localization.getLocales()[0]?.languageCode || 'en';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: ['ar', 'en'].includes(lng) ? lng : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
export const isRTL = ['ar', 'ur', 'fa'].includes(i18n.language);
`);

w('src/i18n/en.json', JSON.stringify({
  login: { title: 'Consedra Admin', email: 'Email', password: 'Password', tenant: 'Tenant Slug', submit: 'Sign In' },
  nav: { dashboard: 'Dashboard', employees: 'Employees', tasks: 'Tasks', projects: 'Projects', inventory: 'Inventory', purchasing: 'Purchasing', crm: 'CRM', finance: 'Finance', quality: 'Quality', production: 'Production', support: 'IT Support', approvals: 'Approvals', settings: 'Settings', logout: 'Logout' },
  dashboard: { title: 'Dashboard', employees: 'Employees', tasks: 'Tasks', branches: 'Branches', approvals: 'Pending Approvals' },
  common: { loading: 'Loading...', error: 'Error', retry: 'Retry', noData: 'No data', search: 'Search...' }
}, null, 2));

w('src/i18n/ar.json', JSON.stringify({
  login: { title: 'كونسيدرا أدمن', email: 'البريد الإلكتروني', password: 'كلمة المرور', tenant: 'معرّف المنشأة', submit: 'تسجيل الدخول' },
  nav: { dashboard: 'لوحة التحكم', employees: 'الموظفون', tasks: 'المهام', projects: 'المشاريع', inventory: 'المخزون', purchasing: 'المشتريات', crm: 'إدارة العملاء', finance: 'المالية', quality: 'الجودة', production: 'الإنتاج', support: 'الدعم الفني', approvals: 'الموافقات', settings: 'الإعدادات', logout: 'تسجيل الخروج' },
  dashboard: { title: 'لوحة التحكم', employees: 'الموظفون', tasks: 'المهام', branches: 'الفروع', approvals: 'موافقات معلّقة' },
  common: { loading: 'جارٍ التحميل...', error: 'خطأ', retry: 'إعادة المحاولة', noData: 'لا توجد بيانات', search: 'بحث...' }
}, null, 2));

// ── src/hooks/useQuery.ts ──
w('src/hooks/useQuery.ts', `
import { useQuery as useRQ, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useList<T = any>(key: string, endpoint: string) {
  return useRQ<T[]>({ queryKey: [key], queryFn: () => api(endpoint) });
}

export function useDetail<T = any>(key: string, endpoint: string) {
  return useRQ<T>({ queryKey: [key], queryFn: () => api(endpoint) });
}

export function useCreate(key: string, endpoint: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}
`);

// ── src/components/StatCard.tsx ──
w('src/components/StatCard.tsx', `
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { title: string; value: string | number; color?: string; }

export function StatCard({ title, value, color = '#6366F1' }: Props) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderLeftWidth: 4, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  value: { fontSize: 28, fontWeight: '700', color: '#0F172A' },
  title: { fontSize: 13, color: '#64748B', marginTop: 4 },
});
`);

// ── src/components/ListScreen.tsx ──
w('src/components/ListScreen.tsx', `
import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';

interface Props<T> {
  data: T[] | undefined;
  isLoading: boolean;
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T) => string;
  title: string;
  searchable?: boolean;
}

export function ListScreen<T>({ data, isLoading, renderItem, keyExtractor, title }: Props<T>) {
  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#6366F1" /></View>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data || []}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={styles.empty}>No data</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 40 },
});
`);

// ── src/components/RowCard.tsx ──
w('src/components/RowCard.tsx', `
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props { title: string; subtitle?: string; right?: string; onPress?: () => void; }

export function RowCard({ title, subtitle, right, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      {right ? <Text style={styles.right}>{right}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  sub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  right: { fontSize: 13, fontWeight: '600', color: '#6366F1' },
});
`);

// ── Expo Router: _layout.tsx (root) ──
w('src/app/_layout.tsx', `
import React from 'react';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../lib/auth';
import '../i18n';

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 30000 } } });

export default function RootLayout() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </QueryClientProvider>
  );
}
`);

// ── Login screen ──
w('src/app/login.tsx', `
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../lib/auth';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@consedra.local');
  const [password, setPassword] = useState('Admin123!');
  const [tenant, setTenant] = useState('consedra');
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    setBusy(true);
    try {
      await login(email, password, tenant);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login Failed', e.message);
    } finally { setBusy(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Consedra Admin</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Tenant slug" value={tenant} onChangeText={setTenant} autoCapitalize="none" />
      <TouchableOpacity style={styles.btn} onPress={handle} disabled={busy}>
        <Text style={styles.btnText}>{busy ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0F172A' },
  brand: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1E293B', color: '#fff', borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 15 },
  btn: { backgroundColor: '#6366F1', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
`);

// ── Index redirect ──
w('src/app/index.tsx', `
import { Redirect } from 'expo-router';
import { useAuth } from '../lib/auth';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  return <Redirect href={user ? '/(tabs)' : '/login'} />;
}
`);

// ── Tabs layout ──
w('src/app/(tabs)/_layout.tsx', `
import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: '#6366F1', tabBarStyle: { backgroundColor: '#fff' } }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarLabel: 'Home' }} />
      <Tabs.Screen name="employees" options={{ title: 'Employees' }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
      <Tabs.Screen name="inventory" options={{ title: 'Inventory' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );
}
`);

// ── Dashboard tab ──
w('src/app/(tabs)/index.tsx', `
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../lib/auth';
import { StatCard } from '../../components/StatCard';
import { useList } from '../../hooks/useQuery';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: employees } = useList('employees', '/api/employees');
  const { data: tasks } = useList('tasks', '/api/tasks');
  const { data: branches } = useList('branches', '/api/branches');
  const { data: approvals } = useList('approvals', '/api/approvals');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.greeting}>Welcome, {user?.firstName || 'Admin'}</Text>
      <StatCard title="Employees" value={employees?.length ?? '—'} color="#6366F1" />
      <StatCard title="Tasks" value={tasks?.length ?? '—'} color="#F59E0B" />
      <StatCard title="Branches" value={branches?.length ?? '—'} color="#10B981" />
      <StatCard title="Pending Approvals" value={approvals?.length ?? '—'} color="#EF4444" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  greeting: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 20 },
});
`);

// ── Employees tab ──
w('src/app/(tabs)/employees.tsx', `
import React from 'react';
import { useList } from '../../hooks/useQuery';
import { ListScreen } from '../../components/ListScreen';
import { RowCard } from '../../components/RowCard';

export default function Employees() {
  const { data, isLoading } = useList('employees', '/api/employees');
  return (
    <ListScreen
      title="Employees"
      data={data}
      isLoading={isLoading}
      keyExtractor={(e: any) => e.id}
      renderItem={(e: any) => <RowCard title={e.firstName + ' ' + e.lastName} subtitle={e.position || e.department} right={e.status} />}
    />
  );
}
`);

// ── Tasks tab ──
w('src/app/(tabs)/tasks.tsx', `
import React from 'react';
import { useList } from '../../hooks/useQuery';
import { ListScreen } from '../../components/ListScreen';
import { RowCard } from '../../components/RowCard';

export default function Tasks() {
  const { data, isLoading } = useList('tasks', '/api/tasks');
  return (
    <ListScreen
      title="Tasks"
      data={data}
      isLoading={isLoading}
      keyExtractor={(t: any) => t.id}
      renderItem={(t: any) => <RowCard title={t.title} subtitle={t.status} right={t.priority} />}
    />
  );
}
`);

// ── Inventory tab ──
w('src/app/(tabs)/inventory.tsx', `
import React from 'react';
import { useList } from '../../hooks/useQuery';
import { ListScreen } from '../../components/ListScreen';
import { RowCard } from '../../components/RowCard';

export default function Inventory() {
  const { data, isLoading } = useList('inventory', '/api/inventory');
  return (
    <ListScreen
      title="Inventory Items"
      data={data}
      isLoading={isLoading}
      keyExtractor={(i: any) => i.id}
      renderItem={(i: any) => <RowCard title={i.name} subtitle={i.sku} right={i.unit} />}
    />
  );
}
`);

// ── More tab ──
w('src/app/(tabs)/more.tsx', `
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../lib/auth';

const links = [
  { label: 'Projects', href: '/projects' },
  { label: 'Purchasing', href: '/purchasing' },
  { label: 'CRM', href: '/crm' },
  { label: 'Finance', href: '/finance' },
  { label: 'Quality', href: '/quality' },
  { label: 'Production', href: '/production' },
  { label: 'IT Support', href: '/support' },
  { label: 'Approvals', href: '/approvals' },
];

export default function More() {
  const { logout, user } = useAuth();
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>More</Text>
      <Text style={styles.user}>{user?.email}</Text>
      {links.map(l => (
        <TouchableOpacity key={l.href} style={styles.link} onPress={() => router.push(l.href as any)}>
          <Text style={styles.linkText}>{l.label}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.logout} onPress={() => { logout(); router.replace('/login'); }}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  title: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  user: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  link: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 8 },
  linkText: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  logout: { backgroundColor: '#FEE2E2', borderRadius: 10, padding: 16, marginTop: 16, alignItems: 'center' },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#EF4444' },
});
`);

// ── Additional screens (stack routes) ──
const listScreens = [
  { name: 'projects', endpoint: '/api/projects', title: 'Projects', titleField: 'name', subField: 'status' },
  { name: 'purchasing', endpoint: '/api/purchase-orders', title: 'Purchase Orders', titleField: 'poNumber', subField: 'status', rightField: 'totalAmount' },
  { name: 'crm', endpoint: '/api/crm-tickets', title: 'CRM Tickets', titleField: 'subject', subField: 'status', rightField: 'priority' },
  { name: 'finance', endpoint: '/api/expenses', title: 'Expenses', titleField: 'description', subField: 'category', rightField: 'amount' },
  { name: 'quality', endpoint: '/api/quality-checklists', title: 'Quality Checklists', titleField: 'name', subField: 'status' },
  { name: 'production', endpoint: '/api/production-orders', title: 'Production Orders', titleField: 'orderNumber', subField: 'status' },
  { name: 'support', endpoint: '/api/support-tickets', title: 'IT Support Tickets', titleField: 'subject', subField: 'status', rightField: 'priority' },
  { name: 'approvals', endpoint: '/api/approvals', title: 'Approvals', titleField: 'id', subField: 'status', rightField: 'type' },
];

for (const s of listScreens) {
  const tf = s.titleField, sf = s.subField || '', rf = s.rightField || '';
  w(`src/app/${s.name}.tsx`, `
import React from 'react';
import { Stack } from 'expo-router';
import { useList } from '../hooks/useQuery';
import { ListScreen } from '../components/ListScreen';
import { RowCard } from '../components/RowCard';

export default function ${s.name.charAt(0).toUpperCase() + s.name.slice(1)}Screen() {
  const { data, isLoading } = useList('${s.name}', '${s.endpoint}');
  return (
    <>
      <Stack.Screen options={{ title: '${s.title}' }} />
      <ListScreen
        title="${s.title}"
        data={data}
        isLoading={isLoading}
        keyExtractor={(i: any) => i.id}
        renderItem={(i: any) => <RowCard title={String(i.${tf} || '')} ${sf ? `subtitle={String(i.${sf} || '')}` : ''} ${rf ? `right={String(i.${rf} || '')}` : ''} />}
      />
    </>
  );
}
`);
}

console.log('\\nMobile app generation complete!');
