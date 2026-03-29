'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/lib/hooks';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import AppShell from '@/components/AppShell';
import Link from 'next/link';

export default function UploadPage() {
  const { user, loading: profileLoading } = useProfile();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');

  const supabase = createBrowserSupabaseClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== 'application/pdf') {
        setError('Please drop a valid PDF file.');
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const processUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    if (!user?.id) {
      setError('You must be logged in to upload reports.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      setStatusText('Uploading secure document...');
      const filePath = `${user.id}/${Date.now()}.pdf`;
      const { error: storageError } = await supabase.storage
        .from('reports')
        .upload(filePath, file);

      if (storageError) throw new Error('Failed to upload securely to storage');

      setStatusText('AI is reading your report...');

      const response = await fetch('/api/upload-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process report');
      }

      setStatusText('Done! Redirecting to analysis...');
      router.push(`/report/${data.reportId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during upload.');
      setUploading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium mb-8"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
            </div>
            <h1 className="font-headline font-extrabold text-3xl text-primary tracking-tight">
              Upload Medical Report
            </h1>
            <p className="text-on-surface-variant max-w-md mx-auto">
              Securely upload your PDF lab report. Our Clinical AI will parse and analyze every
              parameter within minutes.
            </p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined flex-shrink-0">error</span>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center transition-all ${
              file
                ? 'border-secondary bg-secondary/5'
                : 'border-outline-variant/30 hover:border-secondary/50 hover:bg-surface-container-low cursor-pointer'
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">description</span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-on-surface">{file.name}</p>
                  <p className="text-sm text-on-surface-variant">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {!uploading && (
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-error hover:text-on-error-container font-semibold transition-colors"
                  >
                    Remove File
                  </button>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center space-y-4 cursor-pointer w-full h-full">
                <div className="w-16 h-16 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                </div>
                <div className="space-y-1">
                  <p className="text-on-surface font-semibold">Click to upload or drag and drop</p>
                  <p className="text-sm text-on-surface-variant">Only PDF files are supported</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Process Button */}
          <button
            onClick={processUpload}
            disabled={!file || uploading}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
              file && !uploading
                ? 'vitality-gradient text-white shadow-lg shadow-cyan-900/10 hover:opacity-90 active:scale-[0.98]'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
            }`}
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {statusText}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                Process with Clinical AI
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>End-to-end encrypted. Your data never leaves our secure infrastructure.</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
