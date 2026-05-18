'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDemoAuth } from '@/components/DemoAuth';

export default function ProfilePage() {
  const { user: authUser, logout } = useDemoAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deviceType, setDeviceType] = useState('mobile');
  const [isEditing, setIsEditing] = useState(false);
  const [instagramId, setInstagramId] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (!storedUser && !authUser) {
      router.push('/demo-login');
      return;
    }
    const currentUser = authUser || JSON.parse(storedUser);
    setUser(currentUser);
    setInstagramId(currentUser?.instagramId || '');
    fetchStats();
    
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) setDeviceType('mobile');
      else setDeviceType('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [authUser, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/users/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalScore: 265,
        totalQuizzes: 25,
        correctAnswers: 210,
        wrongAnswers: 40,
        accuracy: 84,
        quizHistory: [
          { score: 85, totalQuestions: 100, percentage: 85, date: new Date().toISOString() },
          { score: 90, totalQuestions: 100, percentage: 90, date: new Date().toISOString() },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInstagram = async () => {
    try {
      const response = await fetch('/api/user/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, instagramId })
      });
      if (response.ok) {
        const updatedUser = { ...user, instagramId };
        localStorage.setItem('demoUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating Instagram:', error);
    }
  };

  if (!user) return null;

  // Mobile View
  if (deviceType === 'mobile') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Profile Header - No duplicate logo */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 pt-8 pb-10">
          <div className="text-center">
            <img src={user.image} className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg" />
            <h1 className="text-xl font-bold text-white mt-3">{user.name}</h1>
            <p className="text-blue-100 text-xs">{user.email}</p>
            <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs mt-2">
              <span>📸</span>
              <span>{user.instagramId || 'Not connected'}</span>
              <button onClick={() => setIsEditing(true)} className="ml-1 text-white underline">Edit</button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 -mt-6">
          <div className="bg-white rounded-2xl shadow-xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <p className="text-gray-500 text-xs">Total Score</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.totalScore || 265}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-gray-500 text-xs">Quizzes Taken</p>
                <p className="text-2xl font-bold text-green-600">{stats?.totalQuizzes || 25}</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <p className="text-gray-500 text-xs">Correct Answers</p>
                <p className="text-xl font-bold text-purple-600">{stats?.correctAnswers || 210}</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-xl">
                <p className="text-gray-500 text-xs">Accuracy</p>
                <p className="text-xl font-bold text-orange-600">{stats?.accuracy || 84}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-gray-800 mb-3">📊 Your Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Overall Score</span>
                  <span className="font-semibold text-blue-600">{stats?.totalScore || 265} pts</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Quiz Completion</span>
                  <span className="font-semibold text-green-600">{stats?.totalQuizzes || 25}/50</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 mt-6 flex gap-3">
          <Link href="/quiz" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-center">🎯 Take Quiz</Link>
          <Link href="/leaderboard" className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-center">🏆 Leaderboard</Link>
        </div>

        {/* Logout Button */}
        <div className="px-4 mt-4">
          <button onClick={logout} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold">🚪 Logout</button>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header - No duplicate logo */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-8 flex-wrap">
            <img src={user.image} className="w-32 h-32 rounded-full border-4 border-white shadow-xl" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-blue-100 mt-1">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 rounded-full px-3 py-1 text-sm">📸 {user.instagramId || 'Not connected'}</span>
                <button onClick={() => setIsEditing(true)} className="text-sm underline">Edit</button>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-2xl p-4">
                <p className="text-sm">Current Rank</p>
                <p className="text-4xl font-bold">#1</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-5xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
            <p className="text-gray-500 text-sm">Total Score</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalScore || 265}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
            <p className="text-gray-500 text-sm">Quizzes Taken</p>
            <p className="text-3xl font-bold text-green-600">{stats?.totalQuizzes || 25}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
            <p className="text-gray-500 text-sm">Correct Answers</p>
            <p className="text-2xl font-bold text-purple-600">{stats?.correctAnswers || 210}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
            <p className="text-gray-500 text-sm">Accuracy</p>
            <p className="text-3xl font-bold text-orange-600">{stats?.accuracy || 84}%</p>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="max-w-5xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Performance Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Overall Score</span>
                <span className="font-semibold text-blue-600">{stats?.totalScore || 265} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quiz Completion</span>
                <span className="font-semibold text-green-600">{stats?.totalQuizzes || 25}/50</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Accuracy Rate</span>
                <span className="font-semibold text-orange-600">{stats?.accuracy || 84}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-orange-600 h-3 rounded-full" style={{ width: `${stats?.accuracy || 84}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz History */}
      {stats?.quizHistory && stats.quizHistory.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 mt-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Quiz History</h3>
            <div className="space-y-3">
              {stats.quizHistory.map((quiz, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">Quiz #{idx + 1}</p>
                    <p className="text-sm text-gray-500">{new Date(quiz.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Score</p>
                    <p className="font-bold">{quiz.score}/{quiz.totalQuestions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Percentage</p>
                    <p className="font-bold text-blue-600">{quiz.percentage}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-semibold ${quiz.percentage >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {quiz.percentage >= 80 ? 'Passed' : 'Good'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-4">
        <Link href="/quiz" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-center hover:shadow-lg transition">🎯 Take New Quiz</Link>
        <Link href="/leaderboard" className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-center hover:bg-gray-300 transition">🏆 View Leaderboard</Link>
        <button onClick={logout} className="px-6 bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition">🚪 Logout</button>
      </div>

      {/* Instagram Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-3">Update Instagram ID</h3>
            <input
              type="text"
              value={instagramId}
              onChange={(e) => setInstagramId(e.target.value)}
              placeholder="@username"
              className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button onClick={handleUpdateInstagram} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold">Save</button>
              <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 py-2 rounded-lg font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
