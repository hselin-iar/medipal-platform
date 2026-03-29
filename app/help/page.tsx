'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useProfile } from '@/lib/hooks';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  metrics?: { label: string; value: string; unit: string; range: string; color: string }[];
}

const MOCK_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content:
      "Hello Nilesh,\n\nI've reviewed your last 4 blood reports. While your overall vitality markers are trending positively, I've noticed a slight dip in your iron stores. Here is the summary of the critical findings:",
    metrics: [
      {
        label: 'HEMOGLOBIN',
        value: '11.2',
        unit: 'g/dL',
        range: 'Ref Range: 13.0 - 17.5',
        color: 'error',
      },
      {
        label: 'FERRITIN',
        value: '28',
        unit: 'ng/mL',
        range: 'Ref Range: 30 - 400',
        color: 'error',
      },
    ],
  },
  {
    role: 'assistant',
    content:
      'This suggests mild iron deficiency anemia. Would you like me to explain the next steps or suggest a dietary plan based on your history?',
  },
  {
    role: 'user',
    content:
      'How does this compare to my test from six months ago? I remember feeling much more tired then.',
  },
];

const QUICK_ACTIONS = ['Explain my last CBC', 'What tests next?', 'Anemia symptoms check'];

export default function HelpPage() {
  const { profile } = useProfile();
  const [messages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  const userName = profile?.name?.split(' ')[0] || 'Nilesh';

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-on-surface-variant">
            4 Recent Reports Indexed
          </span>
          <span className="text-xs text-on-surface-variant">•</span>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            RAG-Powered Intelligence
          </span>
        </div>
        <span className="bg-on-tertiary-container text-white px-4 py-1.5 rounded-full text-xs font-bold">
          Connected ✓
        </span>
      </div>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto space-y-6 pb-40">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl ${
                msg.role === 'user'
                  ? 'bg-secondary text-white rounded-2xl rounded-br-md px-6 py-4'
                  : 'space-y-4'
              }`}
            >
              {msg.role === 'assistant' && i === 0 && (
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full vitality-gradient flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">psychology</span>
                  </div>
                  <span className="text-sm font-bold text-on-surface">
                    Hello {userName},
                  </span>
                </div>
              )}

              <p className="text-sm leading-relaxed whitespace-pre-line">
                {i === 0 ? msg.content.replace(`Hello ${userName},\n\n`, '') : msg.content}
              </p>

              {/* Inline Metric Cards */}
              {msg.metrics && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {msg.metrics.map((m, j) => (
                    <div
                      key={j}
                      className="bg-white rounded-xl border border-slate-100 p-5 min-w-[200px] flex-1"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                          {m.label}
                        </p>
                        <span className="material-symbols-outlined text-secondary text-sm cursor-pointer hover:scale-110 transition-transform">
                          info
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-2xl font-extrabold text-on-surface">{m.value}</span>
                        <span className="text-sm text-on-surface-variant">{m.unit}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-error/20 mt-2 mb-1 overflow-hidden">
                        <div
                          className="h-full bg-error rounded-full"
                          style={{ width: m.label === 'HEMOGLOBIN' ? '64%' : '45%' }}
                        />
                      </div>
                      <p className="text-[10px] text-error font-medium">{m.range}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        <div className="flex justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-on-tertiary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-tertiary-container text-lg">
                psychology
              </span>
            </div>
            <div className="flex gap-1.5 items-center text-sm text-on-surface-variant">
              <span className="font-bold">•</span>
              <span className="font-bold">•</span>
              <span className="font-bold">•</span>
              <span className="ml-2 text-xs uppercase tracking-widest font-bold">
                Scanning History...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions + Input (fixed at bottom) */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-64 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-4 z-30">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                className="bg-surface-container-low text-on-surface px-4 py-2 rounded-full text-xs font-semibold hover:bg-surface-variant transition-all"
              >
                {action}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-surface-container-low rounded-full px-5 py-3 flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask your clinical curator anything..."
                className="flex-1 bg-transparent border-none text-sm text-on-surface focus:ring-0 focus:outline-none placeholder:text-on-surface-variant"
              />
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">attach_file</span>
              </button>
            </div>
            <button className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white hover:opacity-90 transition-opacity active:scale-95">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                send
              </span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
