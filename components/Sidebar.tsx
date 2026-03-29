'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'dashboard_customize', label: 'Dashboard' },
  { href: '/history', icon: 'history_edu', label: 'History' },
  { href: '/family', icon: 'family_restroom', label: 'Family' },
  { href: '/passport', icon: 'badge', label: 'Passport' },
  { href: '/help', icon: 'help_outline', label: 'Help' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-slate-100 py-8 z-40">
        <div className="px-8 mb-12 mt-16">
          <h2 className="font-headline font-bold text-xl text-cyan-900">Clinical Curator</h2>
          <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
            Your Health Narrative
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? 'flex items-center gap-3 bg-white text-cyan-700 rounded-l-full ml-4 pl-4 py-3 shadow-sm font-body text-sm font-semibold translate-x-1 duration-200'
                    : 'flex items-center gap-3 text-slate-600 pl-8 py-3 hover:bg-slate-200 transition-all font-body text-sm font-semibold'
                }
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mt-auto">
          <button className="w-full vitality-gradient text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-cyan-900/10 hover:opacity-90 transition-opacity">
            Book Consultation
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-slate-50/90 backdrop-blur-lg border-t border-slate-200 flex justify-around items-center py-3 z-50">
        {NAV_ITEMS.slice(0, 4).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                isActive ? 'text-cyan-700' : 'text-slate-500'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
        <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </>
  );
}
