'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Building, Users, Bell, Shield, Palette, Globe, CreditCard, Database } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'الشركة', icon: Building },
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'appearance', label: 'المظهر', icon: Palette },
    { id: 'localization', label: 'اللغة والمنطقة', icon: Globe },
    { id: 'billing', label: 'الفوترة', icon: CreditCard },
    { id: 'data', label: 'البيانات', icon: Database },
  ];

  return (
    <div>
      <PageHeader title="الإعدادات" description="إدارة إعدادات النظام والتفضيلات" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl border p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id ? 'bg-brand-500 text-white' : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="lg:col-span-3 bg-card rounded-xl border p-6">
          {activeTab === 'company' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">معلومات الشركة</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم الشركة</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg" defaultValue="مطاعم الشرق" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                  <input type="email" className="w-full px-3 py-2 border rounded-lg" defaultValue="info@alsharq.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                  <input type="tel" className="w-full px-3 py-2 border rounded-lg" defaultValue="+966 50 123 4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الرقم الضريبي</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg" defaultValue="300123456789012" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">العنوان</label>
                  <textarea className="w-full px-3 py-2 border rounded-lg" rows={2} defaultValue="الرياض، المملكة العربية السعودية" />
                </div>
                <Button>حفظ التغييرات</Button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">إدارة المستخدمين</h3>
              <div className="space-y-3">
                {[
                  { name: 'أحمد محمد', email: 'ahmed@alsharq.com', role: 'مدير النظام', status: 'نشط' },
                  { name: 'سارة علي', email: 'sara@alsharq.com', role: 'مدير العمليات', status: 'نشط' },
                  { name: 'خالد عمر', email: 'khaled@alsharq.com', role: 'محاسب', status: 'نشط' },
                  { name: 'فاطمة أحمد', email: 'fatima@alsharq.com', role: 'موارد بشرية', status: 'غير نشط' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="font-medium">{user.name}</span>
                      <span className="text-sm text-muted-foreground block">{user.email}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-sm">{user.role}</span>
                      <span className={`text-xs block ${user.status === 'نشط' ? 'text-green-600' : 'text-red-600'}`}>{user.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">إضافة مستخدم</Button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">إعدادات الإشعارات</h3>
              <div className="space-y-4">
                {[
                  { label: 'إشعارات البريد الإلكتروني', desc: 'استلام إشعارات عبر البريد', enabled: true },
                  { label: 'إشعارات الجوال', desc: 'إشعارات فورية على التطبيق', enabled: true },
                  { label: 'إشعارات SMS', desc: 'رسائل نصية للأحداث المهمة', enabled: false },
                  { label: 'تنبيهات المخزون', desc: 'عند وصول المخزون للحد الأدنى', enabled: true },
                  { label: 'تنبيهات الموافقات', desc: 'عند وجود طلبات تحتاج موافقة', enabled: true },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="font-medium">{setting.label}</span>
                      <span className="text-sm text-muted-foreground block">{setting.desc}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">إعدادات الأمان</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">تغيير كلمة المرور</h4>
                  <div className="space-y-3">
                    <input type="password" placeholder="كلمة المرور الحالية" className="w-full px-3 py-2 border rounded-lg" />
                    <input type="password" placeholder="كلمة المرور الجديدة" className="w-full px-3 py-2 border rounded-lg" />
                    <input type="password" placeholder="تأكيد كلمة المرور" className="w-full px-3 py-2 border rounded-lg" />
                    <Button>تحديث كلمة المرور</Button>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">المصادقة الثنائية</h4>
                  <p className="text-sm text-muted-foreground mb-3">أضف طبقة حماية إضافية لحسابك</p>
                  <Button variant="outline">تفعيل المصادقة الثنائية</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">المظهر</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">السمة</label>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 border rounded-lg bg-white text-black">فاتح</button>
                    <button className="px-4 py-2 border rounded-lg bg-gray-900 text-white">داكن</button>
                    <button className="px-4 py-2 border rounded-lg">تلقائي</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اللون الرئيسي</label>
                  <div className="flex gap-3">
                    <button className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow"></button>
                    <button className="w-8 h-8 rounded-full bg-green-500"></button>
                    <button className="w-8 h-8 rounded-full bg-purple-500"></button>
                    <button className="w-8 h-8 rounded-full bg-orange-500"></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'localization' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">اللغة والمنطقة</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اللغة</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>العربية</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">المنطقة الزمنية</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>Asia/Riyadh (GMT+3)</option>
                    <option>Asia/Dubai (GMT+4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تنسيق التاريخ</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">العملة</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>ريال سعودي (SAR)</option>
                    <option>درهم إماراتي (AED)</option>
                  </select>
                </div>
                <Button>حفظ التغييرات</Button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">الفوترة والاشتراك</h3>
              <div className="p-4 bg-brand-50 border border-brand-200 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-brand-700">الخطة الاحترافية</span>
                    <span className="text-sm text-brand-600 block">تجدد في 15 فبراير 2024</span>
                  </div>
                  <span className="text-2xl font-bold text-brand-700">499 ر.س/شهر</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">سجل الفواتير</h4>
                {[
                  { date: 'يناير 2024', amount: '499 ر.س', status: 'مدفوع' },
                  { date: 'ديسمبر 2023', amount: '499 ر.س', status: 'مدفوع' },
                  { date: 'نوفمبر 2023', amount: '499 ر.س', status: 'مدفوع' },
                ].map((invoice, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>{invoice.date}</span>
                    <span className="font-medium">{invoice.amount}</span>
                    <span className="text-xs text-green-600">{invoice.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">إدارة البيانات</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">تصدير البيانات</h4>
                  <p className="text-sm text-muted-foreground mb-3">تحميل نسخة كاملة من بياناتك</p>
                  <Button variant="outline">تصدير البيانات</Button>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">النسخ الاحتياطي</h4>
                  <p className="text-sm text-muted-foreground mb-3">آخر نسخة: منذ ساعتين</p>
                  <Button variant="outline">إنشاء نسخة احتياطية</Button>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-700 mb-2">حذف الحساب</h4>
                  <p className="text-sm text-red-600 mb-3">هذا الإجراء لا يمكن التراجع عنه</p>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">حذف الحساب</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
