'use client';
import { useAuth } from '@/providers/providers';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Users, ClipboardCheck, DollarSign, TrendingUp, Headphones, ShoppingCart, Package, AlertTriangle, Building2, CheckCircle, FileText, Factory } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title={`مرحباً، ${user?.firstName || 'مدير'}`} description="نظرة عامة على المنصة" />

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي الموظفين" value="60" change="+5 هذا الشهر" icon={<Users className="w-6 h-6" />} trend="up" />
        <StatCard title="المهام النشطة" value="100" change="12 متأخرة" icon={<ClipboardCheck className="w-6 h-6" />} trend="neutral" />
        <StatCard title="الموافقات المعلقة" value="40" change="8 عاجلة" icon={<AlertTriangle className="w-6 h-6" />} trend="down" />
        <StatCard title="الإيرادات (الشهر)" value="2.4M ر.س" change="+12%" icon={<TrendingUp className="w-6 h-6" />} trend="up" />
      </div>

      {/* إحصائيات الأقسام */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="تذاكر العملاء المفتوحة" value="80" icon={<Headphones className="w-6 h-6" />} />
        <StatCard title="أوامر الشراء" value="30" icon={<ShoppingCart className="w-6 h-6" />} />
        <StatCard title="أصناف المخزون" value="250" icon={<Package className="w-6 h-6" />} />
        <StatCard title="المصروفات (الشهر)" value="890K ر.س" icon={<DollarSign className="w-6 h-6" />} />
      </div>

      {/* إحصائيات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="الفروع" value="7" icon={<Building2 className="w-6 h-6" />} />
        <StatCard title="طلبات الإجازات" value="20" icon={<FileText className="w-6 h-6" />} />
        <StatCard title="أوامر الإنتاج" value="15" icon={<Factory className="w-6 h-6" />} />
        <StatCard title="المهام المكتملة" value="78" icon={<CheckCircle className="w-6 h-6" />} />
      </div>

      {/* الأقسام السفلية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* الموافقات المعلقة */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">الموافقات المعلقة</h3>
          {[
            { title: 'طلب إجازة - أحمد علي', type: 'إجازة', status: 'معلق' },
            { title: 'أمر شراء #PO-0012 - معدات مطبخ', type: 'مشتريات', status: 'معلق' },
            { title: 'تقرير مصروفات - فرع العليا', type: 'مالية', status: 'عاجل' },
            { title: 'أمر إنتاج #PRD-005 - كبسة', type: 'إنتاج', status: 'معلق' },
            { title: 'طلب صيانة - جهاز POS #3', type: 'دعم فني', status: 'معلق' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div>
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground mr-2">({item.type})</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'عاجل' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        {/* آخر النشاطات */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">آخر النشاطات</h3>
          {[
            { text: 'تم إنشاء نقل مخزون #TRF-042', time: 'منذ 5 دقائق' },
            { text: 'فرع العليا أكمل قائمة الفحص اليومية', time: 'منذ 15 دقيقة' },
            { text: 'تمت الموافقة على أمر الشراء #PO-0028', time: 'منذ 30 دقيقة' },
            { text: 'تذكرة عميل جديدة #CRM-080', time: 'منذ ساعة' },
            { text: 'اكتمل أمر الإنتاج #B-015', time: 'منذ ساعتين' },
            { text: 'تم تسجيل دخول موظف جديد', time: 'منذ 3 ساعات' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg mb-2">
              <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm">{item.text}</span>
                <span className="text-xs text-muted-foreground block">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أداء الفروع */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">أعلى الفروع مبيعات</h3>
          {[
            { name: 'فرع العليا', sales: '520K ر.س', orders: 245 },
            { name: 'فرع الملز', sales: '410K ر.س', orders: 198 },
            { name: 'فرع التحلية', sales: '380K ر.س', orders: 176 },
            { name: 'فرع الكورنيش', sales: '350K ر.س', orders: 162 },
          ].map((branch, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div>
                <span className="text-sm font-medium">{branch.name}</span>
                <span className="text-xs text-muted-foreground block">{branch.orders} طلب</span>
              </div>
              <span className="text-sm font-semibold text-brand-600">{branch.sales}</span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">تنبيهات المخزون</h3>
          {[
            { item: 'صدور دجاج', stock: 15, min: 50, unit: 'كجم' },
            { item: 'أرز بسمتي', stock: 25, min: 100, unit: 'كجم' },
            { item: 'زيت زيتون', stock: 8, min: 20, unit: 'لتر' },
            { item: 'علب تغليف', stock: 200, min: 500, unit: 'قطعة' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg mb-2">
              <div>
                <span className="text-sm font-medium">{item.item}</span>
                <span className="text-xs text-muted-foreground block">الحد الأدنى: {item.min} {item.unit}</span>
              </div>
              <span className="text-sm font-semibold text-red-600">{item.stock} {item.unit}</span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">المهام اليوم</h3>
          {[
            { task: 'مراجعة تقرير المبيعات الأسبوعي', assignee: 'محمد', done: true },
            { task: 'اجتماع مع الموردين', assignee: 'خالد', done: false },
            { task: 'فحص جودة المطبخ المركزي', assignee: 'سارة', done: false },
            { task: 'تحديث أسعار القائمة', assignee: 'أحمد', done: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-2">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {item.done && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${item.done ? 'line-through text-muted-foreground' : ''}`}>{item.task}</span>
                <span className="text-xs text-muted-foreground block">{item.assignee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
