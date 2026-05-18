'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NoteDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await fetch(`/api/notes/${id}`);
      const data = await response.json();
      setNote(data);
    } catch (error) {
      // Sample note if API fails
      setNote({
        id: id,
        title: "Karnataka History - Important Dynasties",
        category: "History",
        content: "The major dynasties that ruled Karnataka include:\n\n1. Kadambas (345-525 CE) - First native kingdom\n2. Chalukyas (543-753 CE) - Badami Chalukyas\n3. Rashtrakutas (753-982 CE)\n4. Hoysalas (1026-1343 CE)\n5. Vijayanagara Empire (1336-1646 CE)\n6. Wodeyars of Mysore (1399-1947 CE)\n\nEach dynasty contributed significantly to Karnataka's culture, architecture, and literature.",
        date: "2024-05-17"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
        <Link href="/notes" className="text-white/80 text-sm mb-2 inline-block">← Back to Notes</Link>
        <h1 className="text-xl font-bold mt-2">{note?.title}</h1>
        <p className="text-green-100 text-sm mt-1">{note?.category} • {note?.date}</p>
      </div>

      <div className="px-5 py-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {note?.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
