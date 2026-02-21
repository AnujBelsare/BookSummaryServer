'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function EditorPage() {
  const params = useParams();
  const bookId = params?.bookId as string;

  const [summaryTitle, setSummaryTitle] = useState('');
  const [content, setContent] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // -----------------------------
  // Fetch Existing Summary
  // -----------------------------
  useEffect(() => {
    if (!bookId) return;

    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/book/${bookId}/summary`);

        if (res.ok) {
          const data = await res.json();
          setSummaryTitle(data.data.title);
          setContent(data.data.content);
          setIsEditMode(true);
        }
      } catch {
        console.error('Failed to load summary');
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    };

    fetchSummary();
  }, [bookId]);

  // -----------------------------
  // Save Function (Used by both autosave & button)
  // -----------------------------
  const saveSummary = useCallback(async () => {
    if (!summaryTitle.trim() || !content.trim()) return;

    try {
      setSaveStatus('saving');

      const res = await fetch(`/api/book/${bookId}/summary`, {
        method: isEditMode ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: summaryTitle,
          content,
        }),
      });

      if (!res.ok) throw new Error();

      setIsEditMode(true);
      setSaveStatus('saved');

      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

    } catch {
      setSaveStatus('error');
    }
  }, [summaryTitle, content, bookId, isEditMode]);

  // -----------------------------
  // Autosave (Debounced 2s)
  // -----------------------------
  useEffect(() => {
    if (isInitialLoad.current) return;

    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }

    autosaveTimer.current = setTimeout(() => {
      saveSummary();
    }, 2000);

    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }
    };
  }, [content, summaryTitle, saveSummary]);

  // -----------------------------
  // Cloudinary Image Upload
  // -----------------------------
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setSaveStatus('saving');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setContent((prev) =>
        prev + `\n\n![Image](${data.url})\n\n`
      );

      setSaveStatus('saved');

    } catch (error) {
      console.error(error);
      setSaveStatus('error');
    }
  };

  // -----------------------------
  // Loading State
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-[#191919] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191919] text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Title */}
        <input
          type="text"
          placeholder="Summary Title..."
          value={summaryTitle}
          onChange={(e) => setSummaryTitle(e.target.value)}
          className="w-full mb-8 bg-transparent border-b border-gray-600 text-3xl font-bold outline-none"
        />

        {/* Image Upload */}
        <div className="mb-6">
          <label className="cursor-pointer px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        {/* Markdown Editor */}
        <div data-color-mode="dark">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            height={500}
          />
        </div>

        {/* Save Button */}
        <div className="mt-10 flex items-center gap-6">
          <button
            onClick={saveSummary}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            {isEditMode ? 'Update Summary' : 'Publish Summary'}
          </button>

          {/* Save Status Indicator */}
          <span className="text-sm text-gray-400">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved ✓'}
            {saveStatus === 'error' && 'Save failed'}
          </span>
        </div>

      </div>
    </div>
  );
}