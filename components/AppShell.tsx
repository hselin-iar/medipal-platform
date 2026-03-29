'use client';

import Link from 'next/link';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Top App Bar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 max-w-full bg-slate-50/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-headline font-extrabold text-2xl text-cyan-900">
            MediPal
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <span className="text-slate-500 font-medium hover:text-cyan-600 transition-colors font-headline text-lg tracking-tight cursor-pointer">
              हिन्दी
            </span>
            <span className="text-cyan-700 font-bold border-b-2 border-cyan-700 pb-1 font-headline text-lg tracking-tight cursor-pointer">
              English
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-cyan-900 hover:bg-slate-100 rounded-full transition-all active:scale-95 duration-150">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link
            href="/profile"
            className="p-2 text-cyan-900 hover:bg-slate-100 rounded-full transition-all active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </header>

      <Sidebar />

      {/* Main Content */}
      <main className="lg:ml-64 pt-24 pb-20 lg:pb-12 px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="lg:ml-64 bg-slate-50 w-full mt-auto py-12 px-8 border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
          <span className="font-headline font-semibold text-slate-400 text-xl tracking-tight">
            MediPal
          </span>
          <div className="flex flex-wrap justify-center gap-8">
            <span className="text-slate-400 hover:text-slate-900 transition-colors font-body text-xs uppercase tracking-widest cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-slate-400 hover:text-slate-900 transition-colors font-body text-xs uppercase tracking-widest cursor-pointer">
              Terms of Service
            </span>
            <span className="text-slate-400 hover:text-slate-900 transition-colors font-body text-xs uppercase tracking-widest cursor-pointer">
              Contact Support
            </span>
          </div>
          <p className="text-slate-500 font-body text-xs leading-relaxed max-w-2xl">
            © 2024 MediPal. Medical Disclaimer: Information provided is for educational purposes and
            not a substitute for professional medical advice. Always consult with a qualified
            healthcare provider for clinical diagnosis.
          </p>
        </div>
      </footer>
    </>
  );
}
