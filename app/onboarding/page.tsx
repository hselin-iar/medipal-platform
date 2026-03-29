'use client';
import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { UserProfile, useProfile } from '@/lib/hooks';

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
    surgeries: ''
  });

  // Pre-fill if profile exists
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? null : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const currentUserId = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  }

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const userId = await currentUserId();
      if (!userId) throw new Error("Not authenticated");

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (upsertError) throw upsertError;
      
      router.push('/profile');
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Build your Profile</h2>
        <p className="text-sm text-slate-500 mb-6">Step {step} of 3</p>
        
        {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Age</label>
                  <input type="number" name="age" value={formData.age || ''} onChange={handleChange} required
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Sex</label>
                  <select name="sex" value={formData.sex || ''} onChange={handleChange} required
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500">
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <input type="tel" name="phone_number" value={formData.phone_number || ''} onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Preferred Language</label>
                <select name="preferred_language" value={formData.preferred_language || 'hi'} onChange={handleChange} required
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500">
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Weight (kg)</label>
                  <input type="number" step="0.1" name="weight_kg" value={formData.weight_kg || ''} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Height (cm)</label>
                  <input type="number" step="0.1" name="height_cm" value={formData.height_cm || ''} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Blood Group</label>
                <select name="blood_group" value={formData.blood_group || ''} onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Unknown</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-700">Allergies (if any)</label>
                <textarea name="allergies" value={formData.allergies || ''} onChange={handleChange} rows={2}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. Peanuts, Penicillin" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Current Medications & Conditions</label>
                <textarea name="medications" value={formData.medications || ''} onChange={handleChange} rows={2}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. Metformin for Diabetes" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Past Surgeries / Major Illnesses</label>
                <textarea name="surgeries" value={formData.surgeries || ''} onChange={handleChange} rows={2}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. Appendectomy in 2015" />
              </div>
            </div>
          )}

          <div className="pt-6 flex justify-between gap-4">
            {step > 1 && (
              <button type="button" onClick={handleBack} disabled={saving}
                className="w-full py-2 px-4 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors">
                Back
              </button>
            )}
            <button type="submit" disabled={saving}
              className={`w-full py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors ${step === 1 ? 'col-span-2' : ''}`}>
              {step === 3 ? (saving ? 'Saving...' : 'Finish') : 'Next'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
