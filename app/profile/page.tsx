'use client';
import { useProfile } from '@/lib/hooks';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfilePage() {
  const { profile, loading } = useProfile();
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [loggingOut, setLoggingOut] = useState(false);

  if (loading) return <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center text-slate-500">Loading profile...</div>;

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center shadow bg-white p-8 rounded-xl max-w-sm w-full">
          <p className="mb-6 text-slate-600">Your profile is not fully configured.</p>
          <button onClick={() => router.push('/onboarding')} className="bg-blue-600 text-white px-4 py-2 w-full rounded-md hover:bg-blue-700 transition">
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
          <button onClick={() => router.push('/onboarding')} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Full Name</h3>
            <p className="mt-1 text-lg text-slate-900">{profile.name || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500">Age & Sex</h3>
            <p className="mt-1 text-lg text-slate-900">{profile.age ? `${profile.age} yrs` : '-'} • <span className="capitalize">{profile.sex || '-'}</span></p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500">Language</h3>
            <p className="mt-1 text-lg text-slate-900">{profile.preferred_language}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500">Phone</h3>
            <p className="mt-1 text-lg text-slate-900">{profile.phone_number || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500">Physical</h3>
            <p className="mt-1 text-lg text-slate-900">{profile.weight_kg ? `${profile.weight_kg} kg` : '-'} • {profile.height_cm ? `${profile.height_cm} cm` : '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500">Blood Group</h3>
            <p className="mt-1 text-lg text-slate-900">{profile.blood_group || '-'}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-slate-500">Medical Data</h3>
          <div className="mt-3 space-y-3">
            <div className="text-slate-900 bg-slate-50 p-4 rounded-md whitespace-pre-wrap border border-slate-100">
              <span className="font-semibold block mb-1 text-sm text-slate-700">Allergies:</span>
              {profile.allergies || <span className="text-slate-400 italic">None listed</span>}
            </div>
            <div className="text-slate-900 bg-slate-50 p-4 rounded-md whitespace-pre-wrap border border-slate-100">
              <span className="font-semibold block mb-1 text-sm text-slate-700">Medications & Conditions:</span>
              {profile.medications || <span className="text-slate-400 italic">None listed</span>}
            </div>
            <div className="text-slate-900 bg-slate-50 p-4 rounded-md whitespace-pre-wrap border border-slate-100">
              <span className="font-semibold block mb-1 text-sm text-slate-700">Past Surgeries / Illnesses:</span>
              {profile.surgeries || <span className="text-slate-400 italic">None listed</span>}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex justify-end">
          <button 
            onClick={handleLogout} 
            disabled={loggingOut}
            className="text-red-600 hover:text-red-800 font-medium transition"
          >
            {loggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
