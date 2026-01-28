const fs = require('fs');
const path = require('path');
function w(f, c) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c, 'utf8'); console.log('  ✓ ' + path.relative(ROOT, f)); }
const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, 'apps/web');

console.log('\n🌐 Next.js Web App');

w(path.join(WEB, 'package.json'), JSON.stringify({
  name: "@consedra/web", version: "1.0.0", private: true,
  scripts: { dev: "next dev -p 3000", build: "next build", start: "next start", lint: "next lint", clean: "rm -rf .next" },
  dependencies: {
    next: "^14.2.0", react: "^18.3.0", "react-dom": "^18.3.0",
    "@tanstack/react-query": "^5.60.0", axios: "^1.7.0", zustand: "^5.0.0",
    "lucide-react": "^0.460.0", clsx: "^2.1.0", "tailwind-merge": "^2.6.0",
    "class-variance-authority": "^0.7.0", "date-fns": "^4.1.0", "react-hook-form": "^7.54.0",
    zod: "^3.23.0", sonner: "^1.7.0",
    "@radix-ui/react-dialog": "^1.1.0", "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0", "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-slot": "^1.1.0", "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-switch": "^1.1.0", "@radix-ui/react-separator": "^1.1.0"
  },
  devDependencies: { "@types/node": "^22.0.0", "@types/react": "^18.3.0", "@types/react-dom": "^18.3.0", autoprefixer: "^10.4.0", postcss: "^8.4.0", tailwindcss: "^3.4.0", typescript: "^5.7.0" }
}, null, 2));

w(path.join(WEB, 'tsconfig.json'), JSON.stringify({
  compilerOptions: { target: "es5", lib: ["dom","dom.iterable","esnext"], allowJs: true, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true, jsx: "preserve", incremental: true, plugins: [{ name: "next" }], paths: { "@/*": ["./src/*"] } },
  include: ["next-env.d.ts","**/*.ts","**/*.tsx"], exclude: ["node_modules"]
}, null, 2));

w(path.join(WEB, 'next.config.js'), `/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/api/:path*', destination: \`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/:path*\` }];
  },
};`);

w(path.join(WEB, 'tailwind.config.ts'), `import type { Config } from 'tailwindcss';
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50:'#eff6ff', 100:'#dbeafe', 500:'#3b82f6', 600:'#2563eb', 700:'#1d4ed8', 900:'#1e3a5f' },
        sidebar: { DEFAULT:'#0f172a', foreground:'#e2e8f0', accent:'#1e293b' },
        border: 'hsl(214 32% 91%)', input: 'hsl(214 32% 91%)', ring: 'hsl(221 83% 53%)',
        background: 'hsl(0 0% 100%)', foreground: 'hsl(222 47% 11%)',
        card: { DEFAULT: 'hsl(0 0% 100%)', foreground: 'hsl(222 47% 11%)' },
        muted: { DEFAULT: 'hsl(210 40% 96%)', foreground: 'hsl(215 16% 47%)' },
        destructive: { DEFAULT: 'hsl(0 84% 60%)', foreground: 'hsl(210 40% 98%)' },
      },
      fontFamily: { sans: ['Inter','Noto Sans Arabic','sans-serif'] },
    },
  },
  plugins: [],
};
export default config;`);

w(path.join(WEB, 'postcss.config.js'), `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };`);
w(path.join(WEB, '.env.example'), `NEXT_PUBLIC_API_URL=http://localhost:4000\nNEXT_PUBLIC_APP_URL=http://localhost:3000`);

w(path.join(WEB, 'Dockerfile'), `FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
WORKDIR /app/apps/web
ENV NEXT_PUBLIC_API_URL=http://localhost:4000
RUN pnpm build
FROM base AS runner
WORKDIR /app/apps/web
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/node_modules ./node_modules
COPY --from=build /app/apps/web/package.json ./
EXPOSE 3000
CMD ["pnpm", "start"]`);

// CSS
w(path.join(WEB, 'src/app/globals.css'), `@tailwind base;
@tailwind components;
@tailwind utilities;
[dir="rtl"] { direction: rtl; }`);

// Root layout
w(path.join(WEB, 'src/app/layout.tsx'), `import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers/providers';
export const metadata: Metadata = { title: 'Consedra ERP', description: 'Enterprise Management Platform' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" suppressHydrationWarning><body className="font-sans antialiased"><Providers>{children}</Providers></body></html>);
}`);

w(path.join(WEB, 'src/app/page.tsx'), `import { redirect } from 'next/navigation';
export default function Home() { redirect('/login'); }`);

// Providers
w(path.join(WEB, 'src/providers/providers.tsx'), `'use client';
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
}`);

// Lib
w(path.join(WEB, 'src/lib/api.ts'), `import axios from 'axios';
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
export default api;`);

w(path.join(WEB, 'src/lib/utils.ts'), `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(d: string|Date, locale='en') { return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(d)); }
export function formatCurrency(n: number, cur='SAR', locale='en') { return new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).format(n); }`);

// UI Components
w(path.join(WEB, 'src/components/ui/button.tsx'), `import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'default'|'destructive'|'outline'|'secondary'|'ghost'; size?: 'default'|'sm'|'lg'|'icon'; asChild?: boolean; }
const v: Record<string,string> = { default:'bg-brand-600 text-white hover:bg-brand-700 shadow-sm', destructive:'bg-red-600 text-white hover:bg-red-700', outline:'border bg-transparent hover:bg-muted', secondary:'bg-muted hover:bg-muted/80', ghost:'hover:bg-muted' };
const s: Record<string,string> = { default:'h-10 px-4 py-2', sm:'h-9 px-3 text-sm', lg:'h-11 px-8', icon:'h-10 w-10' };
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant='default', size='default', asChild, ...props }, ref) => {
  const C = asChild ? Slot : 'button';
  return <C className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', v[variant], s[size], className)} ref={ref} {...props} />;
});
Button.displayName = 'Button';`);

w(path.join(WEB, 'src/components/ui/input.tsx'), `import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input className={cn('flex h-10 w-full rounded-lg border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50', className)} ref={ref} {...props} />
));
Input.displayName = 'Input';`);

w(path.join(WEB, 'src/components/ui/badge.tsx'), `import { cn } from '@/lib/utils';
const vs: Record<string,string> = { default:'bg-blue-100 text-blue-700', success:'bg-green-100 text-green-700', warning:'bg-yellow-100 text-yellow-700', destructive:'bg-red-100 text-red-700', secondary:'bg-gray-100 text-gray-600' };
export function Badge({ children, variant='default', className }: { children: React.ReactNode; variant?: keyof typeof vs; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', vs[variant], className)}>{children}</span>;
}`);

// Shared components
w(path.join(WEB, 'src/components/shared/page-header.tsx'), `export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (<div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold">{title}</h1>{description && <p className="text-muted-foreground mt-1">{description}</p>}</div>{actions && <div className="flex items-center gap-2">{actions}</div>}</div>);
}`);

w(path.join(WEB, 'src/components/shared/stat-card.tsx'), `export function StatCard({ title, value, icon, change, trend }: { title: string; value: string|number; icon: React.ReactNode; change?: string; trend?: 'up'|'down'|'neutral' }) {
  return (<div className="bg-card rounded-xl border p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{title}</p><p className="text-2xl font-bold mt-1">{value}</p>{change && <p className={\`text-xs mt-1 \${trend==='up'?'text-green-500':trend==='down'?'text-red-500':'text-muted-foreground'}\`}>{change}</p>}</div><div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-brand-600">{icon}</div></div></div>);
}`);

w(path.join(WEB, 'src/components/shared/data-table.tsx'), `'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> { key: string; header: string; render?: (item: T) => React.ReactNode; }
interface Props<T> { columns: Column<T>[]; data: T[]; total?: number; page?: number; limit?: number; onPageChange?: (p: number) => void; onSearch?: (s: string) => void; actions?: (item: T) => React.ReactNode; title?: string; headerActions?: React.ReactNode; }

export function DataTable<T extends Record<string, any>>({ columns, data, total=0, page=1, limit=20, onPageChange, onSearch, actions, title, headerActions }: Props<T>) {
  const [search, setSearch] = useState('');
  const totalPages = Math.ceil(total / limit);
  return (<div className="bg-card rounded-xl border shadow-sm">
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">{title && <h2 className="text-lg font-semibold">{title}</h2>}
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); onSearch?.(e.target.value); }} placeholder="Search..." className="pl-3 pr-4 py-2 bg-muted rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-brand-500" />
      </div>
      {headerActions}
    </div>
    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b bg-muted/50">
      {columns.map(c => <th key={c.key} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{c.header}</th>)}
      {actions && <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>}
    </tr></thead><tbody className="divide-y">
      {data.length === 0 ? <tr><td colSpan={columns.length+(actions?1:0)} className="px-4 py-8 text-center text-muted-foreground">No records</td></tr>
        : data.map((item, i) => <tr key={i} className="hover:bg-muted/30"><>
          {columns.map(c => <td key={c.key} className="px-4 py-3 text-sm">{c.render ? c.render(item) : item[c.key]}</td>)}
          {actions && <td className="px-4 py-3 text-right">{actions(item)}</td>}
        </></tr>)}
    </tbody></table></div>
    {totalPages > 1 && <div className="flex items-center justify-between p-4 border-t">
      <span className="text-sm text-muted-foreground">Page {page} of {totalPages} ({total} total)</span>
      <div className="flex gap-1">
        <button onClick={() => onPageChange?.(page-1)} disabled={page<=1} className="px-3 py-1 rounded text-sm hover:bg-muted disabled:opacity-50">Prev</button>
        <button onClick={() => onPageChange?.(page+1)} disabled={page>=totalPages} className="px-3 py-1 rounded text-sm hover:bg-muted disabled:opacity-50">Next</button>
      </div>
    </div>}
  </div>);
}`);

// Layout components
w(path.join(WEB, 'src/components/layout/sidebar.tsx'), `'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/providers';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ClipboardCheck, Users, DollarSign, ShoppingCart, Package, TrendingUp, Headphones, Megaphone, Monitor, ShieldCheck, Factory, FolderKanban, CheckCircle, FileText, BarChart3, FolderOpen, Plug, Settings, Shield, Building2, LogOut } from 'lucide-react';

const MODULES = [
  { key:'dashboard', name:'Dashboard', icon:LayoutDashboard, path:'/dashboard' },
  { key:'operations', name:'Operations', icon:ClipboardCheck, path:'/operations' },
  { key:'hr', name:'HR', icon:Users, path:'/hr' },
  { key:'finance', name:'Finance', icon:DollarSign, path:'/finance' },
  { key:'purchasing', name:'Purchasing', icon:ShoppingCart, path:'/purchasing' },
  { key:'inventory', name:'Inventory', icon:Package, path:'/inventory' },
  { key:'sales', name:'Sales', icon:TrendingUp, path:'/sales' },
  { key:'crm', name:'CRM', icon:Headphones, path:'/crm' },
  { key:'marketing', name:'Marketing', icon:Megaphone, path:'/marketing' },
  { key:'it-helpdesk', name:'IT Helpdesk', icon:Monitor, path:'/it-helpdesk' },
  { key:'quality', name:'Quality', icon:ShieldCheck, path:'/quality' },
  { key:'production', name:'Production', icon:Factory, path:'/production' },
  { key:'projects', name:'Projects', icon:FolderKanban, path:'/projects' },
  { key:'approvals', name:'Approvals', icon:CheckCircle, path:'/approvals' },
  { key:'forms', name:'Forms', icon:FileText, path:'/forms' },
  { key:'reports', name:'Reports', icon:BarChart3, path:'/reports' },
  { key:'documents', name:'Documents', icon:FolderOpen, path:'/documents' },
  { key:'integrations', name:'Integrations', icon:Plug, path:'/integrations' },
];
const ADMIN = [
  { name:'Users', icon:Users, path:'/users' }, { name:'Roles', icon:Shield, path:'/roles' },
  { name:'Org Structure', icon:Building2, path:'/org-structure' }, { name:'Modules', icon:Package, path:'/modules' },
  { name:'Audit Log', icon:FileText, path:'/audit' }, { name:'Settings', icon:Settings, path:'/settings' },
];

export function Sidebar() {
  const p = usePathname();
  const { user, logout } = useAuth();
  return (<aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col rtl:left-auto rtl:right-0">
    <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
      <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">C</div>
      <span className="text-lg font-semibold">Consedra</span>
    </div>
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">Modules</div>
      {MODULES.map(m => { const active = p === m.path || p?.startsWith(m.path+'/'); return (
        <Link key={m.key} href={m.path} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors', active ? 'bg-brand-600 text-white' : 'hover:bg-sidebar-accent')}>
          <m.icon className="w-4 h-4" /><span>{m.name}</span>
        </Link>); })}
      <div className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase">Admin</div>
      {ADMIN.map(m => { const active = p === m.path; return (
        <Link key={m.path} href={m.path} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors', active ? 'bg-brand-600 text-white' : 'hover:bg-sidebar-accent')}>
          <m.icon className="w-4 h-4" /><span>{m.name}</span>
        </Link>); })}
      {user?.isSuperAdmin && <>
        <div className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase">Platform</div>
        <Link href="/admin/tenants" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-sidebar-accent"><Building2 className="w-4 h-4" /><span>Tenants</span></Link>
        <Link href="/admin/transfer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-sidebar-accent"><Shield className="w-4 h-4" /><span>Transfer</span></Link>
      </>}
    </nav>
    <div className="p-4 border-t border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
        <div className="text-sm"><div className="font-medium">{user?.firstName} {user?.lastName}</div><div className="text-xs text-gray-400">{user?.email}</div></div></div>
      <button onClick={logout} className="p-1 hover:bg-sidebar-accent rounded"><LogOut className="w-4 h-4" /></button>
    </div>
  </aside>);
}`);

w(path.join(WEB, 'src/components/layout/header.tsx'), `'use client';
import { useAuth } from '@/providers/providers';
import { Bell, Globe, Moon, Sun, Search } from 'lucide-react';
import { useState } from 'react';
const LOCALES = [{code:'en',name:'English'},{code:'ar',name:'العربية'},{code:'fr',name:'Français'},{code:'ur',name:'اردو'},{code:'fa',name:'فارسی'},{code:'hi',name:'हिन्दी'},{code:'bn',name:'বাংলা'}];

export function Header() {
  const { locale, setLocale } = useAuth();
  const [dark, setDark] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const toggleDark = () => { setDark(!dark); document.documentElement.classList.toggle('dark', !dark); };
  return (<header className="h-16 border-b bg-card flex items-center justify-between px-6">
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="Search..." className="pl-10 pr-4 py-2 bg-muted rounded-lg text-sm w-64 outline-none" /></div>
    <div className="flex items-center gap-2">
      <div className="relative"><button onClick={() => setShowLang(!showLang)} className="p-2 hover:bg-muted rounded-lg"><Globe className="w-5 h-5" /></button>
        {showLang && <div className="absolute right-0 top-full mt-1 bg-card border rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
          {LOCALES.map(l => <button key={l.code} onClick={() => {setLocale(l.code);setShowLang(false)}} className={\`block w-full text-left px-4 py-2 text-sm hover:bg-muted \${locale===l.code?'font-bold text-brand-600':''}\`}>{l.name}</button>)}
        </div>}
      </div>
      <button onClick={toggleDark} className="p-2 hover:bg-muted rounded-lg">{dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
      <button className="p-2 hover:bg-muted rounded-lg relative"><Bell className="w-5 h-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></button>
    </div>
  </header>);
}`);

// Login page
w(path.join(WEB, 'src/app/(auth)/login/page.tsx'), `'use client';
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
}`);

// Dashboard layout
w(path.join(WEB, 'src/app/(dashboard)/layout.tsx'), `'use client';
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
  return (<div className="min-h-screen bg-background"><Sidebar /><div className="ml-64 rtl:ml-0 rtl:mr-64"><Header /><main className="p-6">{children}</main></div></div>);
}`);

// Dashboard page
w(path.join(WEB, 'src/app/(dashboard)/dashboard/page.tsx'), `'use client';
import { useAuth } from '@/providers/providers';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Users, ClipboardCheck, DollarSign, TrendingUp, Headphones, ShoppingCart, Package, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  return (<div>
    <PageHeader title={\`Welcome, \${user?.firstName || 'Admin'}\`} description="Platform overview" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard title="Total Employees" value="60" change="+5 this month" icon={<Users className="w-6 h-6" />} trend="up" />
      <StatCard title="Active Tasks" value="100" change="12 overdue" icon={<ClipboardCheck className="w-6 h-6" />} trend="neutral" />
      <StatCard title="Pending Approvals" value="40" change="8 urgent" icon={<AlertTriangle className="w-6 h-6" />} trend="down" />
      <StatCard title="Revenue (MTD)" value="SAR 2.4M" change="+12%" icon={<TrendingUp className="w-6 h-6" />} trend="up" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard title="Open CRM Tickets" value="80" icon={<Headphones className="w-6 h-6" />} />
      <StatCard title="Purchase Orders" value="30" icon={<ShoppingCart className="w-6 h-6" />} />
      <StatCard title="Inventory Items" value="250" icon={<Package className="w-6 h-6" />} />
      <StatCard title="Expenses (MTD)" value="SAR 890K" icon={<DollarSign className="w-6 h-6" />} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-xl border p-6"><h3 className="text-lg font-semibold mb-4">Recent Approvals</h3>
        {['Leave Request - Ahmad Ali','PO #PO-0012','Expense Report - Branch 3','Production Order #PRD-005'].map((t,i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2"><span className="text-sm">{t}</span><span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pending</span></div>))}
      </div>
      <div className="bg-card rounded-xl border p-6"><h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {['Inventory transfer #TRF-042 created','Downtown completed daily checklist','PO #PO-0028 approved','New CRM ticket #CRM-080','Production batch #B-015 completed'].map((t,i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg mb-2"><div className="w-2 h-2 bg-brand-500 rounded-full mt-2" /><span className="text-sm">{t}</span></div>))}
      </div>
    </div>
  </div>);
}`);

// Generate all module pages
function genPage(routePath, title, entity, apiPath, columns) {
  const colDefs = columns.map(c => `{ key: '${c}', header: '${c.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}' }`).join(',\n      ');
  w(path.join(WEB, 'src/app/(dashboard)', routePath, 'page.tsx'), `'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default function ${title.replace(/[^a-zA-Z]/g, '')}Page() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['${entity}', page, search],
    queryFn: () => api.get('/api/${apiPath}', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
      ${colDefs}
  ];

  return (<div>
    <PageHeader title="${title}" actions={<Button><Plus className="w-4 h-4 mr-2" />Create</Button>} />
    <DataTable
      columns={columns}
      data={data?.data || []}
      total={data?.meta?.total || 0}
      page={page}
      limit={20}
      onPageChange={setPage}
      onSearch={setSearch}
    />
  </div>);
}`);
}

const pages = [
  ['users', 'Users Management', 'users', 'users', ['email','firstName','lastName','isActive','createdAt']],
  ['roles', 'Roles & Permissions', 'roles', 'roles', ['name','key','isSystem','createdAt']],
  ['org-structure', 'Organization Structure', 'org', 'org/regions', ['name','code']],
  ['modules', 'Module Manager', 'modules', 'modules', ['moduleKey','isEnabled','order']],
  ['audit', 'Audit Log', 'audit', 'audit-logs', ['action','entityType','entityId','actorEmail','createdAt']],
  ['approvals', 'Approvals Inbox', 'approvals', 'approvals', ['entityType','entityId','status','currentStep','createdAt']],
  ['forms', 'Forms Builder', 'forms', 'forms', ['name','moduleKey','createdAt']],
  ['reports', 'Reports & Analytics', 'reports', 'reports', ['name','moduleKey','entity']],
  ['projects', 'Projects & Plans', 'projects', 'projects', ['name','status','startDate','endDate']],
  ['notifications', 'Notifications', 'notifications', 'notifications', ['title','type','isRead','createdAt']],
  ['documents', 'Documents', 'documents', 'documents', ['name','mimeType','entityType','createdAt']],
  ['integrations', 'Integration Hub', 'integrations', 'integrations', ['name','type','isActive']],
  ['operations', 'Operations', 'checklists', 'operations/checklists', ['title','branchId','frequency','completedAt','createdAt']],
  ['hr', 'HR Management', 'employees', 'hr/employees', ['employeeNumber','firstName','lastName','email','departmentId','hireDate']],
  ['finance', 'Finance', 'expenses', 'finance/expenses', ['description','amount','status','branchId','date']],
  ['purchasing', 'Purchasing', 'purchaseOrders', 'purchasing/orders', ['number','supplierId','status','totalAmount','createdAt']],
  ['inventory', 'Inventory', 'inventoryItems', 'inventory/items', ['name','sku','unit','minStock']],
  ['sales', 'Sales / Revenue', 'salesSummaries', 'sales/summaries', ['branchId','date','totalSales','totalOrders']],
  ['crm', 'CRM / Customer Service', 'crmTickets', 'crm/tickets', ['number','customerName','subject','category','status','priority']],
  ['marketing', 'Marketing', 'campaigns', 'marketing/campaigns', ['name','type','status','startDate','budget']],
  ['it-helpdesk', 'IT Helpdesk', 'supportTickets', 'it/tickets', ['number','title','category','status','priority']],
  ['quality', 'Quality & Compliance', 'qualityChecklists', 'quality/checklists', ['title','branchId','type','score']],
  ['production', 'Manufacturing / Production', 'productionOrders', 'production/orders', ['number','status','quantity','batchNumber','yieldQuantity']],
  ['settings', 'Settings', 'settings', 'tenants', ['name','slug','isActive']],
  ['admin/tenants', 'Tenant Management', 'tenants', 'tenants', ['name','slug','isActive','createdAt']],
  ['admin/transfer', 'Ownership Transfer', 'transfers', 'tenants', ['name','slug','ownerId']],
];

pages.forEach(([route, title, entity, api, cols]) => genPage(route, title, entity, api, cols));

// Brand assets
w(path.join(ROOT, 'assets/brand/consedra-icon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="96" fill="#2563EB"/>
  <path d="M310 160c-30-20-70-30-108-20-55 14-95 65-95 122 0 68 55 123 123 123 35 0 67-15 90-38" stroke="white" stroke-width="48" stroke-linecap="round" fill="none"/>
  <circle cx="340" cy="180" r="24" fill="white" opacity="0.6"/>
</svg>`);

w(path.join(ROOT, 'assets/brand/consedra-wordmark.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" fill="none">
  <rect width="56" height="56" rx="12" y="12" fill="#2563EB"/>
  <path d="M38 28c-8-5-18-7-27-5-14 4-24 17-24 31 0 17 14 31 31 31 9 0 17-4 23-10" stroke="white" stroke-width="8" stroke-linecap="round" fill="none" transform="translate(4,0)"/>
  <text x="72" y="52" font-family="Inter,sans-serif" font-size="36" font-weight="700" fill="#0f172a">consedra</text>
</svg>`);

// Specs package.json
w(path.join(ROOT, 'packages/specs/package.json'), JSON.stringify({ name: "@consedra/specs", version: "1.0.0", private: true }, null, 2));

console.log('\n✅ All web files generated!');
