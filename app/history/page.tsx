'use client';

import { useEffect, useState } from 'react';
import { useProfile } from '@/lib/hooks';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import AppShell from '@/components/AppShell';
import Link from 'next/link';

export default function HistoryPage() {
  const { user } = useProfile();
  const supabase = createBrowserSupabaseClient();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('reports')
      .select('id, file_path, status, uploaded_at')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false })
      .then(({ data }) => {
        if (data) setReports(data);
      });
  }, [user?.id]);

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-10">
        <div>
          <h1 className="font-headline font-extrabold text-5xl text-primary tracking-tight">
            History
          </h1>
          <p className="text-on-surface-variant text-lg">
            Analyze and track your longitudinal health journey.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2.5">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
          <input
            type="text"
            placeholder="Search medical reports, vitals..."
            className="bg-transparent border-none text-sm text-on-surface focus:ring-0 focus:outline-none placeholder:text-on-surface-variant w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Reports Sidebar */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-headline font-bold text-lg text-primary">Recent Reports</h3>
            <button className="text-secondary text-xs font-bold hover:underline">View All</button>
          </div>

          {reports.length > 0 ? (
            reports.map((r, i) => (
              <Link
                key={r.id}
                href={`/report/${r.id}`}
                className="block p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      i === 0
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    Report {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-[10px] text-on-surface-variant ml-auto">
                    {new Date(r.uploaded_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h4 className="font-bold text-primary mb-1">
                  {r.file_path?.split('/').pop()?.replace('.pdf', '') || 'Lab Report'}
                </h4>
                <p className="text-[10px] text-on-surface-variant">
                  {r.status === 'done' ? 'AI Analysis Complete' : 'Processing...'}
                </p>
                {r.status === 'done' && (
                  <span className="inline-flex items-center gap-1 text-xs text-secondary font-semibold mt-2">
                    <span className="material-symbols-outlined text-xs">compare</span>
                    Ready for Comparison
                  </span>
                )}
              </Link>
            ))
          ) : (
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                folder_open
              </span>
              <p className="text-sm text-on-surface-variant">No reports uploaded yet.</p>
              <Link
                href="/upload"
                className="inline-block mt-4 vitality-gradient text-white px-6 py-2 rounded-full text-sm font-bold"
              >
                Upload First Report
              </Link>
            </div>
          )}

          {/* Trust Score */}
          <div className="bg-gradient-to-br from-primary-container to-primary p-6 rounded-2xl text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-fixed-dim mb-2">
              Trust Score
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">98</span>
              <span className="text-lg text-primary-fixed">/100</span>
            </div>
            <p className="text-xs text-on-primary-container mt-2">
              Verified by MediPal Blockchain Health ID. High report integrity.
            </p>
          </div>
        </aside>

        {/* Analytical Comparison */}
        <section className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-headline font-bold text-2xl text-primary">
                Analytical Comparison
              </h3>
              <p className="text-sm text-on-surface-variant">
                Visualizing deltas between selected medical reports
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-variant transition-all">
                <span className="material-symbols-outlined text-on-surface-variant">download</span>
              </button>
              <button className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-variant transition-all">
                <span className="material-symbols-outlined text-on-surface-variant">share</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* B12 */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h4 className="font-bold text-primary">Vitamin B12 (Cyanocobalamin)</h4>
                  <p className="text-xs text-on-surface-variant">Optimal Range: 200 - 950 pg/mL</p>
                </div>
                <span className="text-xs font-bold text-on-tertiary-container">
                  +18.5% Improvement
                </span>
              </div>
              <div className="flex gap-2 h-7">
                <div className="bg-on-tertiary-container/20 rounded-full h-full flex-1 flex items-center overflow-hidden">
                  <div
                    className="bg-on-tertiary-container h-full rounded-full flex items-center justify-center text-[9px] text-white font-bold px-3"
                    style={{ width: '65%' }}
                  >
                    615 pg/mL, Mar 04
                  </div>
                </div>
                <div className="bg-primary-fixed rounded-full h-full w-24 flex items-center justify-center overflow-hidden">
                  <span className="text-[9px] font-bold text-primary">714 pg/mL (↑)</span>
                </div>
              </div>
            </div>

            {/* Haemoglobin */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h4 className="font-bold text-primary">Haemoglobin (Hb)</h4>
                  <p className="text-xs text-on-surface-variant">Optimal Range: 13.5 - 17.5 g/dL</p>
                </div>
                <span className="text-xs font-bold text-secondary">+4.5% Stable</span>
              </div>
              <div className="flex gap-2 h-7">
                <div className="bg-secondary/20 rounded-full h-full flex-1 flex items-center overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full flex items-center justify-center text-[9px] text-white font-bold px-3"
                    style={{ width: '55%' }}
                  >
                    13.6 g/dL, Mar 04
                  </div>
                </div>
                <div className="bg-secondary-fixed rounded-full h-full w-24 flex items-center justify-center overflow-hidden">
                  <span className="text-[9px] font-bold text-secondary">14.2 g/dL (↑)</span>
                </div>
              </div>
            </div>

            {/* LDL */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h4 className="font-bold text-primary">LDL Cholesterol</h4>
                  <p className="text-xs text-on-surface-variant">Optimal Range: &lt;100mg/dL</p>
                </div>
                <span className="text-xs font-bold text-error">-12.5% Caution</span>
              </div>
              <div className="flex gap-2 h-7">
                <div className="bg-error/20 rounded-full h-full flex-1 flex items-center overflow-hidden">
                  <div
                    className="bg-error h-full rounded-full flex items-center justify-center text-[9px] text-white font-bold px-3"
                    style={{ width: '80%' }}
                  >
                    105 mg/dL, Mar 04
                  </div>
                </div>
                <div className="bg-error-container rounded-full h-full w-24 flex items-center justify-center overflow-hidden">
                  <span className="text-[9px] font-bold text-on-error-container">
                    92, Oct 19 (↓)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Insight */}
          <div className="mt-10 p-6 bg-surface-container-low rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full vitality-gradient flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">psychology</span>
              </div>
              <h4 className="font-headline font-bold text-lg text-primary">Clinical Insight</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Your B12 levels have entered the normal range following the prescribed 3-month course.
              LDL shows a downward trend but remains above optimal thresholds. Recommend continuing
              the current cardiovascular regime.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
