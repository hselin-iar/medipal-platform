'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/lib/hooks';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';

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
      setError("Please select a file first.");
      return;
    }
    
    if (!user?.id) {
      setError("You must be logged in safely to upload reports.");
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      // 1. Upload to Supabase Storage
      setStatusText('Uploading secure document...');
      const filePath = `${user.id}/${Date.now()}.pdf`;
      const { error: storageError } = await supabase.storage
        .from('reports')
        .upload(filePath, file);

      if (storageError) throw new Error('Failed to upload securely to storage');

      // 2. Call our API Route to Process
      setStatusText('Reading your scanned report...');
      
      const response = await fetch('/api/upload-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process report');
      }

      setStatusText('Done! Redirecting...');
      
      // 3. Redirect to the newly generated report
      router.push(`/report/${data.reportId}`);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during upload.');
      setUploading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Upload Medical Lab Report</h1>
          <p className="text-gray-500">Securely upload your PDF lab report to extract and analyze medical parameters using AI.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center transition-all ${
            file 
              ? 'border-blue-500 bg-blue-50/50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 bg-gray-50 cursor-pointer'
          }`}
        >
          {file ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              {!uploading && (
                <button 
                  onClick={() => setFile(null)}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Remove File
                </button>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center space-y-4 cursor-pointer w-full h-full">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">Only PDF files are supported</p>
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

        <button
          onClick={processUpload}
          disabled={!file || uploading}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
            file && !uploading
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {statusText}
            </>
          ) : (
            'Process using AI Engine'
          )}
        </button>

      </div>
    </main>
  );
}
