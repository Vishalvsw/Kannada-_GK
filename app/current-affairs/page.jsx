'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CurrentAffairsPage() {
  const [affairs, setAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    fetchCurrentAffairs();
  }, [selectedDate]);

  const fetchCurrentAffairs = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      setAffairs(data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching affairs:', error);
      setAffairs([
        { _id: "1", question: "Karnataka budget 2024 highlights", answer: "₹3.71 lakh crore", category: "Economy", date: "2024-05-17" },
        { _id: "2", question: "New agricultural policy launched", answer: "Kisan Samruddhi Yojana", category: "Agriculture", date: "2024-05-16" },
        { _id: "3", question: "IT sector growth in Bengaluru", answer: "15% YoY growth", category: "Economy", date: "2024-05-15" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const dates = [
    { date: "2024-05-17", day: "Today", events: 3 },
    { date: "2024-05-16", day: "Yesterday", events: 5 },
    { date: "2024-05-15", day: "May 15", events: 2 },
    { date: "2024-05-14", day: "May 14", events: 4 },
    { date: "2024-05-13", day: "May 13", events: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
            📰
          </div>
          <div>
            <h1 className="text-2xl font-bold">Current Affairs</h1>
            <p className="text-orange-100 text-sm">Daily updates for exams</p>
          </div>
        </div>
      </div>

      {/* Calendar Date Picker */}
      <div className="px-5 mt-4">
        <button
          onClick={() => setCalendarOpen(!calendarOpen)}
          className="w-full bg-white rounded-xl shadow-md p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <div>
              <p className="font-semibold text-gray-800">Select Date</p>
              <p className="text-xs text-gray-500">{selectedDate}</p>
            </div>
          </div>
          <span className="text-gray-400">{calendarOpen ? '▲' : '▼'}</span>
        </button>

        {calendarOpen && (
          <div className="bg-white rounded-xl shadow-lg mt-2 p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-gray-500 font-semibold">{day}</div>
              ))}
              {Array(31).fill().map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDate(`2024-05-${String(i+1).padStart(2, '0')}`);
                    setCalendarOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-orange-100 transition"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date-wise Affairs List */}
      <div className="px-5 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">📅 {selectedDate}</h2>
          <p className="text-xs text-gray-500">{affairs.length} updates</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>)}
          </div>
        ) : affairs.length > 0 ? (
          <div className="space-y-3">
            {affairs.map((affair, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{affair.question}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">📅 {selectedDate}</span>
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">⭐ Important</span>
                    </div>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600 text-xs">Show Answer</summary>
                      <p className="text-xs text-green-600 mt-1 p-2 bg-green-50 rounded">✓ {affair.answer}</p>
                    </details>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-5xl mb-3">📰</div>
            <p className="text-gray-600">No current affairs for this date</p>
          </div>
        )}
      </div>

      {/* Daily Quiz Link */}
      <div className="px-5 mt-6">
        <Link href="/quiz">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white text-center">
            <p className="font-semibold">📝 Take Daily Quiz</p>
            <p className="text-xs opacity-90">Test your knowledge with 20 MCQ</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
