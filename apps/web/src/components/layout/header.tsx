'use client';
import { useAuth } from '@/providers/providers';
import { Bell, Globe, Moon, Sun, Search } from 'lucide-react';
import { useState } from 'react';

const LOCALES = [
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ur', name: 'اردو' },
  { code: 'fa', name: 'فارسی' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
];

export function Header() {
  const { locale, setLocale } = useAuth();
  const [dark, setDark] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark', !dark);
  };

  const notifications = [
    { id: 1, title: 'طلب موافقة جديد', desc: 'أمر شراء #PO-0030 بانتظار موافقتك', time: 'منذ 5 دقائق', unread: true },
    { id: 2, title: 'تنبيه مخزون', desc: 'صدور دجاج وصل للحد الأدنى', time: 'منذ 15 دقيقة', unread: true },
    { id: 3, title: 'مهمة مكتملة', desc: 'تم إكمال فحص الجودة - فرع العليا', time: 'منذ ساعة', unread: false },
    { id: 4, title: 'تذكرة عميل جديدة', desc: 'شكوى من عميل - فرع الملز', time: 'منذ ساعتين', unread: false },
  ];

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input placeholder="بحث..." className="pr-10 pl-4 py-2 bg-muted rounded-lg text-sm w-64 outline-none" />
      </div>
      <div className="flex items-center gap-2">
        {/* Language selector */}
        <div className="relative">
          <button onClick={() => setShowLang(!showLang)} className="p-2 hover:bg-muted rounded-lg" title="تغيير اللغة">
            <Globe className="w-5 h-5" />
          </button>
          {showLang && (
            <div className="absolute left-0 top-full mt-1 bg-card border rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
              {LOCALES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLocale(l.code); setShowLang(false); }}
                  className={`block w-full text-right px-4 py-2 text-sm hover:bg-muted ${locale === l.code ? 'font-bold text-brand-600' : ''}`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button onClick={toggleDark} className="p-2 hover:bg-muted rounded-lg" title={dark ? 'الوضع الفاتح' : 'الوضع الداكن'}>
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)} className="p-2 hover:bg-muted rounded-lg relative" title="الإشعارات">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {showNotif && (
            <div className="absolute left-0 top-full mt-1 bg-card border rounded-lg shadow-lg z-50 w-80">
              <div className="p-3 border-b font-semibold">الإشعارات</div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 border-b hover:bg-muted cursor-pointer ${n.unread ? 'bg-brand-50' : ''}`}>
                    <div className="flex items-start gap-2">
                      {n.unread && <span className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0" />}
                      <div>
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-xs text-muted-foreground">{n.desc}</div>
                        <div className="text-xs text-muted-foreground mt-1">{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center">
                <button className="text-sm text-brand-600 hover:underline">عرض جميع الإشعارات</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
