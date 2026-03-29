'use client';
import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { UserProfile, useProfile } from '@/lib/hooks';
import Link from 'next/link';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const SEX_OPTIONS = ['Male', 'Female', 'Other'];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const { profile, loading: profileLoading } = useProfile();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: null,
    sex: '',
    phone_number: '',
    preferred_language: 'hi',
    weight_kg: null,
    height_cm: null,
    blood_group: '',
    allergies: '',
    medications: '',
    surgeries: '',
  });

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? null : Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const currentUserId = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setSaving(true);
    setError('');

    try {
      const userId = await currentUserId();
      if (!userId) throw new Error('Not authenticated');

      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: userId,
        ...formData,
        updated_at: new Date().toISOString(),
      });

      if (upsertError) throw upsertError;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Top bar */}
      <header className="flex justify-between items-center px-8 py-6">
        <span className="font-headline font-extrabold text-xl text-cyan-900">MediPal</span>
        <span className="text-sm text-on-surface-variant font-semibold">
          STEP {step} OF 2
        </span>
      </header>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto px-6 mb-8">
        <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full vitality-gradient rounded-full transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
          {error && (
            <div className="mb-6 bg-error-container text-on-error-container p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="animate-slide-in-right space-y-6">
                <div>
                  <h1 className="font-headline font-extrabold text-4xl text-primary mb-2">
                    Personal details
                  </h1>
                  <p className="text-on-surface-variant">
                    Let&apos;s begin your clinical narrative. This information helps us tailor your
                    health insights.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Julian Thorne"
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary bg-white placeholder:text-slate-400"
                  />
                </div>

                {/* Age & Sex */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ''}
                      onChange={handleChange}
                      placeholder="Years"
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary bg-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2">Sex</label>
                    <div className="flex gap-2">
                      {SEX_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, sex: opt.toLowerCase() }))}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                            formData.sex === opt.toLowerCase()
                              ? 'vitality-gradient text-white shadow-sm'
                              : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Weight & Height */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="weight_kg"
                      value={formData.weight_kg || ''}
                      onChange={handleChange}
                      placeholder="e.g. 72"
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary bg-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="height_cm"
                      value={formData.height_cm || ''}
                      onChange={handleChange}
                      placeholder="e.g. 178"
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary bg-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Blood Group
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BLOOD_GROUPS.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, blood_group: bg }))}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          formData.blood_group === bg
                            ? 'vitality-gradient text-white shadow-sm'
                            : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-slide-in-right space-y-6">
                <div>
                  <h1 className="font-headline font-extrabold text-4xl text-primary mb-2">
                    Clinical Narrative
                  </h1>
                  <p className="text-on-surface-variant">
                    Your medical history allows MediPal to provide context-aware insights. Please
                    detail your journey with precision.
                  </p>
                </div>

                {/* Allergies */}
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-primary">Allergies</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Include reactions to medications, foods, and environmental factors
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">
                      Known Allergies
                    </label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies || ''}
                      onChange={handleChange}
                      placeholder="e.g. Penicillin, Latex, Peanuts"
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary bg-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <hr className="border-surface-variant" />

                {/* Medications */}
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-primary">
                      Current Medications
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Prescriptions, over-the-counter drugs, and herbal supplements
                    </p>
                  </div>
                  <textarea
                    name="medications"
                    value={formData.medications || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. Lisinopril 10mg, daily, blood pressure"
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary bg-white placeholder:text-slate-400"
                  />
                </div>

                <hr className="border-surface-variant" />

                {/* Surgeries */}
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-primary">Past Surgeries</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Surgical procedures and major hospitalizations
                    </p>
                  </div>
                  <textarea
                    name="surgeries"
                    value={formData.surgeries || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="List procedures and approximate years (e.g., Appendectomy, 2015)"
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary bg-white placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-center gap-4 pt-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
                >
                  ← Back to Personal Details
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="w-full vitality-gradient text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-cyan-900/10 hover:opacity-90 transition-all active:scale-[0.98] duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {step === 1 ? (
                  <>Continue →</>
                ) : saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Complete Profile →</>
                )}
              </button>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>
                  {step === 1
                    ? 'Your clinical data is encrypted with enterprise-grade security.'
                    : 'Your data is encrypted and HIPAA compliant.'}
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Skip link */}
        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
          >
            I&apos;ll complete this later
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-400 mt-8 max-w-lg mx-auto">
          © 2024 MediPal. Medical disclaimer: Information provided is for educational purposes and
          not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
