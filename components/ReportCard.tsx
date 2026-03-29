'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface ReportCardProps {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'low' | 'high';
  hindi_summary: string;
  severity: 'ok' | 'watch' | 'urgent';
  index: number;
  muted: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  normal: '#16A34A',
  low: '#2563EB',
  high: '#DC2626',
};

const STATUS_LABELS: Record<string, string> = {
  normal: 'Normal',
  low: 'Low',
  high: 'High',
};

const SEVERITY_ICONS: Record<string, string> = {
  ok: '✅',
  watch: '⚠️',
  urgent: '🚨',
};

export default function ReportCard({
  name,
  value,
  unit,
  status,
  hindi_summary,
  severity,
  index,
  muted,
}: ReportCardProps) {
  const [visible, setVisible] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Staggered entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 400);
    return () => clearTimeout(timer);
  }, [index]);

  // Fetch TTS audio on mount
  const fetchAudio = useCallback(async () => {
    if (audioSrc || audioLoading) return;
    setAudioLoading(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: hindi_summary }),
      });
      if (res.ok) {
        const data = await res.json();
        const src = `data:${data.mimeType};base64,${data.audio}`;
        setAudioSrc(src);
        return src;
      }
    } catch (err) {
      console.error('TTS fetch failed:', err);
    } finally {
      setAudioLoading(false);
    }
    return null;
  }, [hindi_summary, audioSrc, audioLoading]);

  // Auto-play audio when card becomes visible
  useEffect(() => {
    if (!visible || muted || audioPlayed) return;

    const timer = setTimeout(async () => {
      const src = await fetchAudio();
      if (src) {
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.play().catch(() => {});
        setAudioPlayed(true);
      }
    }, 300); // Small delay after card appears

    return () => clearTimeout(timer);
  }, [visible, muted, audioPlayed, fetchAudio]);

  // Replay handler
  const handleReplay = async () => {
    let src = audioSrc;
    if (!src) {
      src = await fetchAudio() || null;
    }
    if (src) {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  };

  const bgColor = STATUS_COLORS[status] || STATUS_COLORS.normal;

  return (
    <div
      style={{
        background: bgColor,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
      className="rounded-2xl p-6 shadow-lg relative overflow-hidden"
    >
      {/* Decorative background circle */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15"
        style={{ background: 'white' }}
      />

      {/* Severity badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <span className="text-lg">{SEVERITY_ICONS[severity] || '✅'}</span>
        <span
          className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
          }}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Hindi summary — prominent */}
      <p className="text-white font-bold text-2xl leading-snug mt-1 mb-4 pr-20">
        {hindi_summary}
      </p>

      {/* Parameter details */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
            {name}
          </p>
          <p className="text-white text-3xl font-extrabold tabular-nums">
            {value}
            <span className="text-lg font-normal text-white/70 ml-1">{unit}</span>
          </p>
        </div>

        {/* Audio controls */}
        <button
          onClick={handleReplay}
          disabled={audioLoading}
          className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl"
          title="Replay Hindi audio"
        >
          {audioLoading ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : muted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
