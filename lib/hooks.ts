'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from './supabase';

export interface UserProfile {
  id: string;
  name: string | null;
  age: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  sex: string | null;
  blood_group: string | null;
  allergies: string | null;
  medications: string | null;
  surgeries: string | null;
  phone_number: string | null;
  preferred_language: string;
}

export function useProfile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          if (mounted) setLoading(false);
          return;
        }

        if (mounted) setUser(user);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Error code PGRST116 means zero rows returned (i.e. profile not yet created)
        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (mounted && data) {
          setProfile(data as UserProfile);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { mounted = false; };
  }, []);

  return { user, profile, loading, error };
}
