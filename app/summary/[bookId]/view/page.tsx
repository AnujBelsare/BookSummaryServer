'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function SummaryViewPage() {
  const { bookId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch(`/api/book/${bookId}/summary`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.data.title);
        setContent(data.data.content);
      }
    };

    fetchSummary();
  }, [bookId]);

  return (
    <div className="min-h-screen bg-[#191919] text-white py-20">
      <div className="max-w-3xl mx-auto px-6">

        <h1 className="text-5xl font-bold mb-12 leading-tight">
          {title}
        </h1>

        <article className="prose prose-invert prose-lg max-w-none
          prose-headings:font-bold
          prose-h1:text-5xl
          prose-h2:text-3xl
          prose-p:text-gray-300"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </article>

      </div>
    </div>
  );
}