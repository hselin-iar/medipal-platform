'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import AppShell from '@/components/AppShell';

interface Metric {
  name: string;
  value: string;
  unit: string;
  normal_range: string;
  status: 'normal' | 'low' | 'high';
  hindi_summary: string;
}

export default function ReportPage() {
  const { id } = useParams();
  const supabase = createBrowserSupabaseClient();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setReport(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const parsed = report?.parsed_json || {};
  const metrics: Metric[] = parsed.parameters || [];

  // Check if any metric is critical
  const hasCritical = metrics.some((m) => m.status === 'high' || m.status === 'low');

  const getCardStyles = (status: string) => {
    switch (status) {
      case 'high':
        return {
          bg: 'bg-[#ffebee]',
          stripe: 'bg-error',
          label: 'CRITICAL',
          labelColor: 'text-error',
          hindiColor: 'text-error',
          iconColor: 'text-error',
        };
      case 'low':
        return {
          bg: 'bg-[#fff9c4]',
          stripe: 'bg-amber-500',
          label: 'MONITOR',
          labelColor: 'text-amber-700',
          hindiColor: 'text-amber-800',
          iconColor: 'text-amber-600',
        };
      default:
        return {
          bg: 'bg-[#e8f5e9]',
          stripe: 'bg-on-tertiary-container',
          label: 'NORMAL',
          labelColor: 'text-on-tertiary-container',
          hindiColor: 'text-on-tertiary-container',
          iconColor: 'text-on-tertiary-container',
        };
    }
  };

  // Use mock data if no metrics from parsed_json
  const displayMetrics: Metric[] =
    metrics.length > 0
      ? metrics
      : [
          {
            name: 'Hemoglobin',
            value: '8.2',
            unit: 'g/dL',
            normal_range: '12.0 - 15.5',
            status: 'low',
            hindi_summary: 'खून की कमी के संकेत हैं',
          },
          {
            name: 'Glucose',
            value: '115',
            unit: 'mg/dL',
            normal_range: '70 - 100',
            status: 'high',
            hindi_summary: 'चीनी का स्तर थोड़ा बढ़ा है',
          },
          {
            name: 'TSH',
            value: '2.4',
            unit: 'mIU/L',
            normal_range: '0.4 - 4.0',
            status: 'normal',
            hindi_summary: 'थायराइड बिल्कुल ठीक है',
          },
        ];

  const playTTS = async (text: string) => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const { audio } = await res.json();
      const audioEl = new Audio(`data:audio/mpeg;base64,${audio}`);
      audioEl.play();
    } catch {
      /* silently fail if TTS not configured */
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Urgent Banner */}
        {hasCritical && (
          <section className="bg-error-container text-on-error-container p-6 rounded-[1.5rem] flex items-center justify-between shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="bg-error p-3 rounded-full flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  warning
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold font-headline leading-tight">
                  धैर्य रखें, कुछ रिपोर्ट सामान्य नहीं हैं
                </h2>
                <p className="text-sm font-medium opacity-90">
                  Please stay calm. Some of your laboratory findings require medical attention.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Metric Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayMetrics.map((metric, i) => {
            const styles = getCardStyles(metric.status);
            return (
              <div
                key={i}
                className={`${styles.bg} p-8 rounded-[1.5rem] relative overflow-hidden group animate-fade-in-up`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`absolute top-0 left-0 w-2 h-full ${styles.stripe}`} />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span
                      className={`${styles.labelColor} font-bold text-xs tracking-widest uppercase mb-1 block`}
                    >
                      {styles.label}
                    </span>
                    <h3 className="text-3xl font-bold text-on-surface">{metric.name}</h3>
                  </div>
                  <button
                    onClick={() => playTTS(metric.hindi_summary)}
                    className="bg-white/80 p-4 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    <span
                      className={`material-symbols-outlined ${styles.iconColor}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                  </button>
                </div>

                <div className="mb-8">
                  <h4 className={`text-2xl font-extrabold ${styles.hindiColor} mb-2 leading-tight`}>
                    {metric.hindi_summary}
                  </h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {metric.status === 'low'
                      ? 'Your levels are below the healthy range for your age group.'
                      : metric.status === 'high'
                      ? 'Values are elevated. Diet control is recommended.'
                      : 'Levels are within the optimal clinical range.'}
                  </p>
                </div>

                <div className="bg-white/50 p-4 rounded-xl flex items-end justify-between">
                  <div>
                    <p className="text-[0.65rem] text-slate-500 font-bold uppercase">Result</p>
                    <p className="text-2xl font-extrabold font-headline">
                      {metric.value}{' '}
                      <span className="text-sm font-normal">{metric.unit}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.65rem] text-slate-500 font-bold uppercase">Normal</p>
                    <p className="text-sm font-semibold">{metric.normal_range}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Expert Recommendations + Doctor Talk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommendations */}
          <section className="bg-surface-container-low p-8 rounded-[1.5rem]">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">restaurant</span>
              <h3 className="text-xl font-bold font-headline">Expert Recommendations</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-xl flex gap-4">
                <div className="w-20 h-20 rounded-lg bg-on-tertiary-container/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-tertiary-container text-3xl">
                    nutrition
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Increase Iron Intake</h4>
                  <p className="text-sm text-on-surface-variant">
                    पालक, मेथी, और हरी सब्जियां ज़्यादा खाएं। (Eat more spinach and greens)
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl flex gap-4">
                <div className="w-20 h-20 rounded-lg bg-error/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-error text-3xl">
                    no_food
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Limit Sweet Foods</h4>
                  <p className="text-sm text-on-surface-variant">
                    मीठा और मैदा कम करें। (Reduce sugar and refined flour)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Doctor Talk */}
          <section className="bg-surface-container-low p-8 rounded-[1.5rem]">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">forum</span>
              <h3 className="text-xl font-bold font-headline">Doctor Talk</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 font-medium">
              Use these points when speaking with your physician:
            </p>
            <ul className="space-y-3">
              {[
                '"I noticed my hemoglobin is low (8.2). Should I take iron supplements?"',
                '"My fasting glucose is 115. Do I need a HbA1c test?"',
                '"Are these values related to my recent tiredness?"',
              ].map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 p-4 bg-white/40 rounded-xl hover:bg-white/70 transition-colors cursor-default group"
                >
                  <div className="mt-1 bg-primary text-white p-1 rounded-full group-hover:scale-110 duration-200">
                    <span className="material-symbols-outlined text-xs">check</span>
                  </div>
                  <span className="text-on-surface font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
