'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditorPage() {
  const { bookId } = useParams();
  const router = useRouter();

  const editorRef = useRef<any>(null);
  const [summaryTitle, setSummaryTitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Initialize Editor
  useEffect(() => {
    let editor: any;

    const initEditor = async (data?: any) => {
      const EditorJS = (await import('@editorjs/editorjs')).default;
      const Header = (await import('@editorjs/header')).default;
      const Paragraph = (await import('@editorjs/paragraph')).default;
      const List = (await import('@editorjs/list')).default;
      const Quote = (await import('@editorjs/quote')).default;
      const Delimiter = (await import('@editorjs/delimiter')).default;
      const CodeTool = (await import('@editorjs/code')).default;
      const Table = (await import('@editorjs/table')).default;
      const Embed = (await import('@editorjs/embed')).default;
      const Marker = (await import('@editorjs/marker')).default;
      const InlineCode = (await import('@editorjs/inline-code')).default;
      const Underline = (await import('@editorjs/underline')).default;
      const ImageTool = (await import('@editorjs/image')).default;
      const Undo = (await import('editorjs-undo')).default;
      const DragDrop = (await import('editorjs-drag-drop')).default;

      editor = new EditorJS({
        holder: 'editorjs',
        autofocus: true,
        data: data || undefined,
        placeholder: 'Write your book summary...',
        tools: {
          header: { class: Header as any, config: { levels: [2, 3, 4], defaultLevel: 2 } },
          paragraph: { class: Paragraph as any, inlineToolbar: true },
          list: { class: List as any, inlineToolbar: true },
          quote: { class: Quote as any, inlineToolbar: true },
          delimiter: Delimiter as any,
          code: CodeTool as any,
          table: Table as any,
          embed: { class: Embed as any, config: { services: { youtube: true } } },
          marker: Marker as any,
          inlineCode: InlineCode as any,
          underline: Underline as any,
          image: {
            class: ImageTool as any,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const res = await fetch('/api/upload', {
                      method: 'POST',
                      body: formData,
                    });

                    if (!res.ok) throw new Error('Upload failed');

                    const data = await res.json();

                    return {
                      success: 1,
                      file: { url: data.url },
                    };
                  } catch (error) {
                    console.error('Image upload error:', error);
                    return { success: 0 };
                  }
                },
              },
            },
          },
        },
        onReady: () => {
          setTimeout(() => {
            new Undo({ editor });
            new DragDrop(editor);
          }, 0);
        },
      });

      editorRef.current = editor;
    };

    // 🔥 Fetch existing summary first
    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/book/${bookId}/summary`);

        if (res.ok) {
          const data = await res.json();

          setSummaryTitle(data.data.title);
          setIsEditMode(true);

          await initEditor(data.data.content);
        } else {
          setIsEditMode(false);
          await initEditor();
        }
      } catch (err) {
        console.error('Failed to load summary');
        await initEditor();
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchSummary();

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [bookId]);

  // 🔥 Save handler
  const handleSave = async () => {
    if (!editorRef.current) return;

    try {
      const output = await editorRef.current.save();

      const res = await fetch(`/api/book/${bookId}/summary`, {
        method: isEditMode ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: summaryTitle,
          content: output,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert('Summary saved successfully');
      setIsEditMode(true);

    } catch (error) {
      console.error('Save failed:', error);
      alert('Error saving summary');
    }
  };

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

        {/* Title Input */}
        <input
          type="text"
          placeholder="Summary Title..."
          value={summaryTitle}
          onChange={(e) => setSummaryTitle(e.target.value)}
          className="w-full mb-8 bg-transparent border-b border-gray-600 text-3xl font-bold outline-none"
        />

        {/* Editor */}
        <div
          id="editorjs"
          className="prose prose-invert max-w-none"
        />

        {/* Save Button */}
        <div className="mt-10">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            {isEditMode ? 'Update Summary' : 'Publish Summary'}
          </button>
        </div>
      </div>
    </div>
  );
}
