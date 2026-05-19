'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [instagramId, setInstagramId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setInstagramId(parsedUser.instagramId || '');
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/users/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalScore: user?.score || 0,
        totalQuizzes: user?.totalQuizzesTaken || 0,
        correctAnswers: 0,
        accuracy: 0,
        quizHistory: []
      });
    }
  };

  const handleUpdateInstagram = () => {
    if (!instagramId) return;
    
    setLoading(true);
    const cleanId = instagramId.replace('@', '');
    const updatedUser = { ...user, instagramId: cleanId, instagramUsername: cleanId };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 pt-8 pb-12">
        <div className="text-center">
          <img src={user.profileImage} className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg" />
          <h1 className="text-xl font-bold text-white mt-3">{user.name}</h1>
          <p className="text-blue-100 text-sm">{user.email}</p>
          
          {user.instagramId ? (
            <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs mt-2">
              <span>📸</span>
              <span>@{user.instagramId}</span>
              <button onClick={() => setIsEditing(true)} className="ml-1 text-white underline">Edit</button>
            </div>
          ) : (
            <div className="mt-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold animate-pulse"
              >
                ⚠️ Add Instagram ID to Take Quizzes
              </button>
            </div>
          )}
        </div>
      </div>

      {!user.instagramId && (
        <div className="mx-4 -mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📸</span>
              <p className="text-sm text-yellow-800">
                Instagram ID is required to take quizzes and win prizes!
              </p>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-3">Update Instagram ID</h3>
            <p className="text-sm text-gray-600 mb-3">Required to take quizzes and win prizes!</p>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">@</span>
              <input
                type="text"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value.replace('@', ''))}
                placeholder="username"
                className="w-full pl-8 pr-4 py-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUpdateInstagram}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold"
              >
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-gray-500 text-xs">Total Score</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.totalScore || 0}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-gray-500 text-xs">Quizzes Taken</p>
              <p className="text-2xl font-bold text-green-600">{stats?.totalQuizzes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 flex gap-3">
        {user.instagramId ? (
          <Link href="/quiz" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-center">
            🎯 Take Quiz
          </Link>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-center"
          >
            📸 Add Instagram ID
          </button>
        )}
        <Link href="/leaderboard" className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-center">
          🏆 Leaderboard
        </Link>
      </div>

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />
    </div>
  );
}
