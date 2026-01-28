'use client';
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
}