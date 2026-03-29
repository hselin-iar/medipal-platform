'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/lib/hooks';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import AppShell from '@/components/AppShell';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, profile, loading } = useProfile();
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('reports')
      .select('id, file_path, status, uploaded_at')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setReports(data);
      });
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const userName = profile?.name?.split(' ')[0] || 'there';

  return (
    <AppShell>
      {/* Greeting */}
      <header className="mb-12">
        <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-primary tracking-tight mb-2">
          Good morning, {userName}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-on-tertiary-container bg-tertiary-fixed px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            Premium Curator
          </span>
          <p className="text-on-surface-variant font-medium">
            Your physiological narrative is trending positively today.
          </p>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* AI Suggestions */}
        <section className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-primary-container to-primary text-white shadow-xl group">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl mb-4 text-primary-fixed">
                wb_sunny
              </span>
              <h3 className="font-headline font-bold text-2xl mb-2">Vitamin D Synthesis</h3>
              <p className="text-on-primary-container text-sm leading-relaxed mb-6">
                Current levels are 28ng/mL. A 15-minute exposure during morning sun is recommended
                to reach the 40ng/mL target.
              </p>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold hover:bg-white/20 transition-all">
                Review Protocol
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span
                className="material-symbols-outlined text-[180px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                wb_sunny
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-secondary-container to-secondary text-white shadow-xl group">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl mb-4 text-secondary-fixed">
                favorite
              </span>
              <h3 className="font-headline font-bold text-2xl mb-2">Cardio Optimization</h3>
              <p className="text-on-secondary-container text-sm leading-relaxed mb-6">
                Your resting heart rate has stabilized at 62bpm. Introduce 10 mins of Zone 3
                intensity today.
              </p>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold hover:bg-white/20 transition-all">
                View Exercise Map
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span
                className="material-symbols-outlined text-[180px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
          </div>
        </section>

        {/* Recent Reports Sidebar */}
        <aside className="md:col-span-4 bg-surface-container-low rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline font-bold text-lg text-primary">Recent Reports</h3>
            <Link href="/history" className="text-secondary text-xs font-bold hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {reports.length > 0 ? (
              reports.map((r) => (
                <Link
                  key={r.id}
                  href={`/report/${r.id}`}
                  className="p-4 bg-surface-container-lowest rounded-xl flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg vitality-gradient flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-xl">biotech</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        {r.file_path?.split('/').pop()?.replace('.pdf', '') || 'Lab Report'}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {new Date(r.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter ${
                      r.status === 'done'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : r.status === 'processing'
                        ? 'bg-secondary-fixed text-secondary'
                        : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    {r.status === 'done' ? 'Analyzed' : r.status}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-4">
                No reports yet. Upload your first one below!
              </p>
            )}
          </div>
        </aside>

        {/* Upload Section */}
        <section className="md:col-span-12">
          <div className="bg-surface-container-low p-1 rounded-2xl">
            <div className="border-2 border-dashed border-outline-variant/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-surface-container-lowest">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">
                  upload_file
                </span>
              </div>
              <h2 className="font-headline font-bold text-2xl text-primary mb-2">
                Upload New Report
              </h2>
              <p className="text-on-surface-variant text-sm mb-8 max-w-md">
                Our Clinical AI will parse your PDF and integrate it into your health narrative
                within minutes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/upload"
                  className="bg-[#004d6a] text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Select Files
                </Link>
                <button className="bg-surface-container-highest text-on-surface px-8 py-3 rounded-full font-bold text-sm hover:bg-surface-variant transition-all">
                  Connect Lab Portal
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Vitality Progress */}
        <section className="md:col-span-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline font-bold text-3xl text-primary">Vitality Progress</h2>
              <p className="text-on-surface-variant font-medium">
                Tracking long-term physiological trends
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-surface-container rounded-full px-4 py-2">
              <span className="text-xs font-bold text-on-surface-variant">Timeframe:</span>
              <span className="text-xs font-bold text-primary">Last 6 Months</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Haemoglobin */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-secondary transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Haemoglobin
                  </p>
                  <h4 className="text-3xl font-extrabold text-primary">
                    14.2 <span className="text-sm font-medium text-on-surface-variant">g/dL</span>
                  </h4>
                </div>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span>
                  Improving
                </span>
              </div>
              <div className="h-20 w-full flex items-end gap-1">
                {[40, 45, 38, 55, 65, 75, 82].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all ${
                      i === 6 ? 'bg-secondary' : 'bg-secondary/10 hover:bg-secondary'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Vitamin D */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-error transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Vitamin D
                  </p>
                  <h4 className="text-3xl font-extrabold text-primary">
                    28.0{' '}
                    <span className="text-sm font-medium text-on-surface-variant">ng/mL</span>
                  </h4>
                </div>
                <span className="bg-error-container text-on-error-container px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_down</span>
                  Deficient
                </span>
              </div>
              <div className="h-20 w-full flex items-end gap-1">
                {[60, 55, 50, 45, 42, 38, 35].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all ${
                      i === 6 ? 'bg-error' : 'bg-error/10 hover:bg-error'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* LDL Cholesterol */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-tertiary transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                    LDL Cholesterol
                  </p>
                  <h4 className="text-3xl font-extrabold text-primary">
                    92 <span className="text-sm font-medium text-on-surface-variant">mg/dL</span>
                  </h4>
                </div>
                <span className="bg-surface-container text-on-surface-variant px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">horizontal_rule</span>
                  Stable
                </span>
              </div>
              <div className="h-20 w-full flex items-end gap-1">
                {[70, 72, 71, 70, 69, 70, 70].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all ${
                      i === 6 ? 'bg-tertiary' : 'bg-tertiary/10 hover:bg-tertiary'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
