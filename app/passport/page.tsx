'use client';

import AppShell from '@/components/AppShell';
import { useProfile } from '@/lib/hooks';

export default function PassportPage() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const p = profile || ({} as Partial<typeof profile & {}>);

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-10">
        <div>
          <h1 className="font-headline font-extrabold text-5xl text-primary tracking-tight">
            MediPal Passport
          </h1>
          <p className="text-on-surface-variant text-lg">
            Official Medical Identification & Clinical Summary
          </p>
        </div>
        <button className="vitality-gradient text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">download</span>
          Download Health Passport (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ID Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl vitality-gradient flex items-center justify-center text-white flex-shrink-0">
              <span className="material-symbols-outlined text-5xl">person</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                Vital Narrative
              </p>
              <h2 className="font-headline font-extrabold text-3xl text-primary">
                {p.name || 'Dr. Arjun V. Mehta'}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                {p.age || 42} Years • Mumbai, MH, India
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">
                Blood
              </p>
              <p className="text-lg font-extrabold text-error">{p.blood_group || 'B+'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">
                Height/Weight
              </p>
              <p className="text-lg font-extrabold text-primary">
                {p.height_cm || 182}cm / {p.weight_kg || 76}kg
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">
                Allergies
              </p>
              <p className="text-sm font-semibold text-primary">
                {p.allergies || 'Penicillin, Latex'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">
                Passport ID
              </p>
              <p className="text-sm font-mono font-bold text-primary">MP-8821-X542</p>
            </div>
          </div>

          <hr className="border-surface-variant mb-8" />

          {/* Clinical Narrative */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-xl text-primary">Clinical Narrative</h3>
              <span className="text-xs text-on-surface-variant font-medium">Updated 2 days ago</span>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm text-primary mb-2">History of Chronic Condition</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Patient presents with a 5-year history of Type 2 Diabetes Mellitus, currently
                  managed through combination therapy and lifestyle modifications. HbA1c levels have
                  remained stable at 6.8% over the last three quarters.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-primary mb-2">Surgical History</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Appendectomy (2012), Left Knee Arthroscopy (2019). No notable complications
                  post-recovery. All incisions healed without keloid formation.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-primary mb-2">Provider Notes</h4>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">
                  &ldquo;Arjun is highly compliant with medication schedules. Recommend continued
                  monitoring of lipid profile every 6 months given family history of
                  hypertension.&rdquo; — Dr. S. Kulkarni, Senior Consultant
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Emergency Access */}
          <div className="bg-error rounded-2xl p-6 text-white">
            <h3 className="font-headline font-bold text-xl mb-2">Emergency Access</h3>
            <p className="text-sm text-white/80 mb-4">
              In case of emergency, scan the code below for instant clinical history and contact
              data.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 flex items-center justify-center">
              <div className="w-32 h-32 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-6xl">qr_code_2</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl mt-4 p-4">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">
                Emergency Contact
              </p>
              <p className="text-sm font-bold">Anupriya Mehta (Spouse)</p>
              <p className="text-xs text-white/70">+91 98XXX XXXXX</p>
            </div>
          </div>

          {/* Active Meds */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-headline font-bold text-xl text-primary mb-4">Active Meds</h3>
            <div className="space-y-3">
              {[
                { name: 'Metformin 500mg', freq: 'Twice daily, after meals' },
                { name: 'Atorvastatin 10mg', freq: 'Once daily, at bedtime' },
                { name: 'Vitamin D3 60K', freq: 'Once weekly, Tuesdays' },
              ].map((med) => (
                <div
                  key={med.name}
                  className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-on-tertiary-container/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-tertiary-container text-sm">
                      medication
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{med.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{med.freq}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
