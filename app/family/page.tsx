'use client';

import AppShell from '@/components/AppShell';

const FAMILY_MEMBERS = [
  { name: 'You', role: 'Self', avatar: '👤', x: 50, y: 60 },
  { name: 'Mom', role: 'Mother', avatar: '👩', x: 30, y: 25 },
  { name: 'Dad', role: 'Father', avatar: '👨', x: 70, y: 25 },
  { name: 'Priya (Mausi)', role: 'Aunt', avatar: '👩‍🦰', x: 60, y: 40 },
];

export default function FamilyPage() {
  return (
    <AppShell>
      <header className="mb-10">
        <h1 className="font-headline font-extrabold text-5xl text-primary tracking-tight mb-2">
          Family Hub
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl">
          A living ecosystem of your collective wellness. Monitor trends, shared genetic insights,
          and upcoming health milestones.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Family Tree */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="relative w-full aspect-square max-w-sm mx-auto">
            {FAMILY_MEMBERS.map((m) => (
              <div
                key={m.name}
                className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
              >
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-2xl border-3 border-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                  {m.avatar}
                </div>
                <span className="text-xs font-bold text-on-surface mt-2">{m.name}</span>
              </div>
            ))}
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              <line x1="50" y1="55" x2="30" y2="30" stroke="#c2c7ce" strokeWidth="0.5" />
              <line x1="50" y1="55" x2="70" y2="30" stroke="#c2c7ce" strokeWidth="0.5" />
              <line x1="50" y1="55" x2="60" y2="42" stroke="#c2c7ce" strokeWidth="0.5" strokeDasharray="2" />
            </svg>
          </div>
        </div>

        {/* Member Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              Member Details
            </p>
            <h3 className="font-headline font-bold text-xl text-primary">
              CURRENTLY VIEWING: <span className="text-secondary">DAD</span>
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-on-surface">Cardiovascular Health</span>
              <span className="text-xs font-bold text-error">Optimal</span>
            </div>
            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-error rounded-full" style={{ width: '85%' }} />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-on-surface">Sleep Efficiency</span>
              <span className="text-xs font-bold text-on-surface-variant">84%</span>
            </div>
            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: '84%' }} />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-on-surface">Hydration Levels</span>
              <span className="text-xs font-bold text-on-tertiary-container">Normal</span>
            </div>
            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-on-tertiary-container rounded-full" style={{ width: '72%' }} />
            </div>
          </div>

          <button className="w-full vitality-gradient text-white py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity">
            View Detailed History
          </button>
        </div>

        {/* Genetic Markers */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-secondary">genetics</span>
            <h3 className="font-headline font-bold text-xl">Genetic Markers</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-sm">science</span>
                </div>
                <div>
                  <p className="text-sm font-bold">MTHFR Variant</p>
                  <p className="text-[10px] text-on-surface-variant">Shared by: You, Mom</p>
                </div>
              </div>
              <span className="bg-secondary-fixed text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                Actionable
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-on-tertiary-container/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-tertiary-container text-sm">
                    science
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold">COMT Activity</p>
                  <p className="text-[10px] text-on-surface-variant">High methylation</p>
                </div>
              </div>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                Stable
              </span>
            </div>
          </div>
        </div>

        {/* Family Roadmap */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            <h3 className="font-headline font-bold text-xl">Family Roadmap</h3>
          </div>
          <div className="space-y-6 relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-surface-variant" />
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xs">circle</span>
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                October 2024
              </p>
              <h4 className="font-bold text-primary">Shared Wellness Retreat</h4>
              <p className="text-xs text-on-surface-variant">
                Meditation, swimming & outdoor workshop for all members.
              </p>
            </div>
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-xs">circle</span>
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                December 2024
              </p>
              <h4 className="font-bold text-primary">Bi-Annual Lab Update</h4>
              <p className="text-xs text-on-surface-variant">
                Synchronized blood panels for metabolic tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
