'use client';
import { useAuth } from '@/providers/providers';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Users, ClipboardCheck, DollarSign, TrendingUp, Headphones, ShoppingCart, Package, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  return (<div>
    <PageHeader title={`Welcome, ${user?.firstName || 'Admin'}`} description="Platform overview" />
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
}