'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { History, User, Database, Shield } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['audit', page, search],
    queryFn: () => api.get('/api/audit-logs', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const actionLabels: Record<string, string> = {
    CREATE: 'إنشاء',
    UPDATE: 'تحديث',
    DELETE: 'حذف',
    LOGIN: 'تسجيل دخول',
    LOGOUT: 'تسجيل خروج',
  };

  const entityLabels: Record<string, string> = {
    USER: 'مستخدم',
    EMPLOYEE: 'موظف',
    BRANCH: 'فرع',
    PRODUCT: 'منتج',
    ORDER: 'طلب',
  };

  const columns = [
    { key: 'action', header: 'الإجراء', render: (item: Record<string, any>) => {
      const colors: Record<string, string> = {
        CREATE: 'text-green-600',
        UPDATE: 'text-blue-600',
        DELETE: 'text-red-600',
        LOGIN: 'text-purple-600',
      };
      return <span className={`font-medium ${colors[item.action] || ''}`}>{actionLabels[item.action] || item.action}</span>;
    }},
    { key: 'entityType', header: 'نوع الكيان', render: (item: Record<string, any>) => entityLabels[item.entityType] || item.entityType },
    { key: 'entityId', header: 'معرف الكيان' },
    { key: 'actorEmail', header: 'المستخدم' },
    { key: 'createdAt', header: 'التاريخ والوقت', render: (item: Record<string, any>) => item.createdAt ? new Date(item.createdAt).toLocaleString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="سجل المراجعة" description="تتبع جميع العمليات والتغييرات في النظام" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي السجلات" value="12,450" icon={<History className="w-6 h-6" />} />
        <StatCard title="المستخدمون النشطون" value="45" icon={<User className="w-6 h-6" />} />
        <StatCard title="عمليات اليوم" value="328" trend="up" icon={<Database className="w-6 h-6" />} />
        <StatCard title="تنبيهات الأمان" value="2" icon={<Shield className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">سجل المراجعة</h3>
          <DataTable
            columns={columns}
            data={data?.data || []}
            total={data?.meta?.total || 0}
            page={page}
            limit={20}
            onPageChange={setPage}
            onSearch={setSearch}
          />
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">النشاط الأخير</h3>
          {[
            { action: 'تسجيل دخول', user: 'أحمد محمد', time: 'منذ 5 دقائق', type: 'LOGIN' },
            { action: 'تحديث منتج', user: 'سارة علي', time: 'منذ 15 دقيقة', type: 'UPDATE' },
            { action: 'إضافة موظف', user: 'خالد عمر', time: 'منذ 30 دقيقة', type: 'CREATE' },
            { action: 'حذف طلب', user: 'فاطمة أحمد', time: 'منذ ساعة', type: 'DELETE' },
            { action: 'تسجيل خروج', user: 'محمد سعيد', time: 'منذ ساعتين', type: 'LOGOUT' },
          ].map((log, i) => {
            const colors: Record<string, string> = {
              LOGIN: 'bg-purple-100 text-purple-700',
              LOGOUT: 'bg-gray-100 text-gray-700',
              CREATE: 'bg-green-100 text-green-700',
              UPDATE: 'bg-blue-100 text-blue-700',
              DELETE: 'bg-red-100 text-red-700',
            };
            return (
              <div key={i} className="p-3 bg-muted/50 rounded-lg mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${colors[log.type]}`}>{log.action}</span>
                    <p className="text-sm mt-1">{log.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              </div>
            );
          })}

          <h3 className="text-lg font-semibold mb-4 mt-6">إحصائيات الإجراءات</h3>
          {[
            { action: 'تسجيل دخول', count: 156, percent: 45 },
            { action: 'تحديث', count: 89, percent: 26 },
            { action: 'إنشاء', count: 67, percent: 19 },
            { action: 'حذف', count: 16, percent: 5 },
          ].map((stat, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{stat.action}</span>
                <span className="font-semibold">{stat.count}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${stat.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
