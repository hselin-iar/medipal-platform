'use client';

import { useEffect, useState, use } from 'react';
import { useProfile } from '@/lib/hooks';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import ReportCard from '@/components/ReportCard';
import {
  Loader2,
  AlertCircle,
  Volume2,
  VolumeX,
  ArrowLeft,
  FileText,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface Parameter {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'low' | 'high';
  hindi_summary: string;
  severity: 'ok' | 'watch' | 'urgent';
}

interface ParsedReport {
  parameters: Parameter[];
  overall_summary_hindi: string;
  overall_summary_english: string;
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: profileLoading } = useProfile();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (!user?.id) return;

    const fetchReport = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setReport(data);
      }
      setLoading(false);
    };

    fetchReport();

    // Realtime subscription for live status updates
    const channel = supabase
      .channel(`report-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reports',
          filter: `id=eq.${id}`,
        },
        (payload) => setReport(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, id]);

  // Loading state
  if (profileLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading report...</p>
      </div>
    );
  }

  // Not found state
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Report Not Found</h2>
          <p className="text-gray-500 mt-2 mb-6">
            This report doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Upload a report
          </Link>
        </div>
      </div>
    );
  }

  // Still processing
  if (report.status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center space-y-4 max-w-md">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto opacity-60" />
          <h3 className="text-lg font-semibold text-gray-900">
            Analyzing your report...
          </h3>
          <p className="text-gray-500">
            Our AI is extracting medical parameters from your PDF. This page
            will update automatically.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (report.status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Processing Failed</h2>
          <p className="text-red-600 mt-2 text-sm font-mono bg-red-50 p-3 rounded-xl">
            {report.raw_text || 'An unknown error occurred.'}
          </p>
          <Link
            href="/upload"
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Try again
          </Link>
        </div>
      </div>
    );
  }

  // Success — render cards
  const parsed: ParsedReport | null = report.parsed_json;
  const parameters = parsed?.parameters || [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/upload"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900">Lab Report Analysis</h1>
            </div>
          </div>

          <button
            onClick={() => setMuted((m) => !m)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              muted
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {muted ? (
              <>
                <VolumeX className="w-4 h-4" /> Muted
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> Audio On
              </>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Overall Summary */}
        {parsed && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Overall Summary
            </h2>
            <p className="text-gray-900 text-lg font-medium leading-relaxed">
              {parsed.overall_summary_english}
            </p>
            <p className="text-gray-600 text-base leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
              {parsed.overall_summary_hindi}
            </p>
          </div>
        )}

        {/* Stats bar */}
        <div className="flex gap-3 flex-wrap">
          {['normal', 'low', 'high'].map((s) => {
            const count = parameters.filter((p) => p.status === s).length;
            if (count === 0) return null;
            return (
              <div
                key={s}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: s === 'normal' ? '#16A34A' : s === 'low' ? '#2563EB' : '#DC2626' }}
              >
                {count} {s === 'normal' ? 'Normal' : s === 'low' ? 'Low' : 'High'}
              </div>
            );
          })}
          <div className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600">
            {parameters.length} Total Parameters
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parameters.map((param, idx) => (
            <ReportCard
              key={`${param.name}-${idx}`}
              name={param.name}
              value={param.value}
              unit={param.unit}
              status={param.status}
              hindi_summary={param.hindi_summary}
              severity={param.severity}
              index={idx}
              muted={muted}
            />
          ))}
        </div>

        {/* Empty state */}
        {parameters.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-medium">No parameters extracted</p>
            <p className="text-sm mt-1">
              The AI could not identify medical parameters in this report.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
