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
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      // Sample notes if API fails
      setNotes([
        { id: 1, title: "Karnataka History - Important Dynasties", category: "History", content: "The major dynasties that ruled Karnataka include Kadambas, Chalukyas, Rashtrakutas, Hoysalas, Vijayanagara Empire...", date: "2024-05-17" },
        { id: 2, title: "KAS Exam - Complete Syllabus Guide", category: "Exam Guide", content: "KAS exam consists of Prelims, Mains, and Interview. Prelims has two papers of 200 marks each...", date: "2024-05-16" },
        { id: 3, title: "Karnataka Geography - Rivers and Dams", category: "Geography", content: "Major rivers: Kaveri, Krishna, Tungabhadra, Sharavathi. Important dams: Krishna Raja Sagara, Almatti, Tungabhadra...", date: "2024-05-15" },
        { id: 4, title: "Indian Constitution - Important Articles", category: "Polity", content: "Key articles for KAS: Article 14-18 (Right to Equality), Article 19-22 (Right to Freedom)...", date: "2024-05-14" },
        { id: 5, title: "Karnataka Economy - Agriculture and Industries", category: "Economy", content: "Karnataka is major producer of coffee, silk, and sandalwood. IT hub in Bengaluru...", date: "2024-05-13" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'History', 'Exam Guide', 'Geography', 'Polity', 'Economy'];
  const filteredNotes = selectedCategory === 'all' ? notes : notes.filter(n => n.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
            📝
          </div>
          <div>
            <h1 className="text-2xl font-bold">Study Notes</h1>
            <p className="text-green-100 text-sm">50 Important Questions & Answers</p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-5 mt-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {cat === 'all' ? '📚 All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      <div className="px-5 py-4">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>)}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <div className="bg-white rounded-xl shadow-md p-4 active:scale-98 transition">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      📄
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{note.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{note.category} • {note.date}</p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{note.content.substring(0, 100)}...</p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
