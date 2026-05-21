'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/admin/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(notes.map(n => n.category))];
  const filteredNotes = selectedCategory === 'all' ? notes : notes.filter(n => n.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
        <div className="flex items-center gap-3"><div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">📝</div><div><h1 className="text-2xl font-bold">ಅಧ್ಯಯನ ಟಿಪ್ಪಣಿಗಳು</h1><p className="text-green-100 text-sm">Study Notes for KAS | PSI | PDO</p></div></div>
      </div>

      <div className="px-5 mt-4 overflow-x-auto"><div className="flex gap-2 pb-2">{categories.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{cat === 'all' ? '📚 ಎಲ್ಲಾ' : cat}</button>))}</div></div>

      <div className="px-5 py-4">{loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>)}</div> : filteredNotes.map(note => (<Link key={note.id} href={`/notes/${note.id}`}><div className="bg-white rounded-xl shadow-md p-4 mb-3 active:scale-98 transition"><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">📄</div><div className="flex-1"><h3 className="font-semibold text-gray-800">{note.title}</h3><p className="text-xs text-gray-500 mt-1">{note.category} • {note.date}</p><p className="text-sm text-gray-600 mt-2 line-clamp-2">{note.content.substring(0, 100)}...</p></div><span className="text-gray-400">→</span></div></div></Link>))}</div>
    </div>
  );
}
