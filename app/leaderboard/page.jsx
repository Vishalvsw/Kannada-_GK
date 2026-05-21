'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.instagramId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-3xl shadow-lg animate-pulse">
            🥇
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">1</div>
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-3xl shadow-lg">
            🥈
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 rounded-full text-white text-xs flex items-center justify-center">2</div>
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
            🥉
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 rounded-full text-white text-xs flex items-center justify-center">3</div>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
        {index + 1}
      </div>
    );
  };

  const getMedalColor = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-400';
    if (index === 2) return 'bg-gradient-to-r from-orange-400 to-orange-500';
    return 'bg-gradient-to-r from-blue-400 to-blue-500';
  };

  // Desktop View
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Ad */}
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-5 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="text-5xl mb-3 animate-bounce">🏆</div>
              <h1 className="text-3xl md:text-4xl font-bold">{t.leaderboard || 'Leaderboard'}</h1>
              <p className="text-yellow-100 mt-2">Top performers ranking</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 text-center">
              <p className="text-sm">Total Participants</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-5 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search by name or Instagram ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Podium for Top 3 - Desktop */}
      {!loading && filteredUsers.length >= 3 && (
        <div className="max-w-6xl mx-auto px-5 mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-center text-lg font-semibold text-gray-600 mb-8">🏆 Top Performers 🏆</h3>
            <div className="flex justify-center items-end gap-4 md:gap-8">
              {/* 2nd Place */}
              <div className="text-center flex-1 order-1">
                <div className="relative">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 mx-auto mb-3 overflow-hidden ring-4 ring-gray-400 shadow-xl transform hover:scale-105 transition">
                    <img src={filteredUsers[1]?.image} className="w-full h-full object-cover" alt={filteredUsers[1]?.name} />
                  </div>
                  <div className="absolute -top-3 -right-3 text-3xl md:text-4xl">🥈</div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">2nd</div>
                </div>
                <p className="font-bold text-gray-800 mt-3">{filteredUsers[1]?.name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">@{filteredUsers[1]?.instagramId}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-700 mt-2">{filteredUsers[1]?.score}</p>
                <div className="mt-2 h-24 md:h-32 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-lg w-full"></div>
              </div>

              {/* 1st Place */}
              <div className="text-center flex-1 order-0 md:order-2 -mt-8">
                <div className="relative">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto mb-3 overflow-hidden ring-4 ring-yellow-400 shadow-xl transform hover:scale-105 transition">
                    <img src={filteredUsers[0]?.image} className="w-full h-full object-cover" alt={filteredUsers[0]?.name} />
                  </div>
                  <div className="absolute -top-4 -right-4 text-4xl md:text-5xl">👑</div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">1st</div>
                </div>
                <p className="font-bold text-gray-800 text-lg mt-3">{filteredUsers[0]?.name}</p>
                <p className="text-xs text-gray-500">@{filteredUsers[0]?.instagramId}</p>
                <p className="text-3xl md:text-4xl font-bold text-yellow-600 mt-2">{filteredUsers[0]?.score}</p>
                <div className="mt-2 h-32 md:h-40 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-lg w-full"></div>
                <div className="mt-2 text-xs text-yellow-600 font-semibold">🏆 CHAMPION 🏆</div>
              </div>

              {/* 3rd Place */}
              <div className="text-center flex-1 order-2 md:order-3">
                <div className="relative">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 mx-auto mb-3 overflow-hidden ring-4 ring-orange-500 shadow-xl transform hover:scale-105 transition">
                    <img src={filteredUsers[2]?.image} className="w-full h-full object-cover" alt={filteredUsers[2]?.name} />
                  </div>
                  <div className="absolute -top-3 -right-3 text-3xl md:text-4xl">🥉</div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">3rd</div>
                </div>
                <p className="font-bold text-gray-800 mt-3">{filteredUsers[2]?.name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">@{filteredUsers[2]?.instagramId}</p>
                <p className="text-2xl md:text-3xl font-bold text-orange-600 mt-2">{filteredUsers[2]?.score}</p>
                <div className="mt-2 h-20 md:h-28 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-lg w-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="max-w-6xl mx-auto px-5 mt-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600 border-b">
            <div className="col-span-2">Rank</div>
            <div className="col-span-6">User</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center">Quizzes</div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-gray-500">Loading leaderboard...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="divide-y">
              {filteredUsers.map((user, index) => (
                <div key={user._id || user.id} className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 transition group">
                  <div className="col-span-2">
                    {index < 3 ? (
                      <div className="flex justify-center">
                        {getRankBadge(index)}
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${getMedalColor(index)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="col-span-6 flex items-center gap-3">
                    <img 
                      src={user.image} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-500 transition" 
                      alt={user.name} 
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">@{user.instagramId || user.email?.split('@')[0]}</span>
                        {index === 0 && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">🔥 Hot</span>}
                        {user.score > 200 && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">⭐ Pro</span>}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-xl font-bold text-blue-600">{user.score}</p>
                    <p className="text-xs text-gray-400">points</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-sm font-semibold text-gray-700">{user.totalQuizzesTaken || 0}</p>
                    <p className="text-xs text-gray-400">quizzes</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-gray-600">No rankings yet</p>
              <p className="text-sm text-gray-500 mt-2">Take a quiz to appear on the leaderboard!</p>
              <Link href="/quiz" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Take First Quiz →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      {!loading && users.length > 0 && (
        <div className="max-w-6xl mx-auto px-5 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center transform hover:scale-105 transition">
              <div className="text-2xl mb-1">👥</div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-xs opacity-90">Total Participants</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white text-center transform hover:scale-105 transition">
              <div className="text-2xl mb-1">📊</div>
              <p className="text-2xl font-bold">{users.reduce((sum, u) => sum + (u.totalQuizzesTaken || 0), 0)}</p>
              <p className="text-xs opacity-90">Total Quizzes</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white text-center transform hover:scale-105 transition">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-2xl font-bold">{Math.round(users.reduce((sum, u) => sum + (u.score || 0), 0) / users.length)}</p>
              <p className="text-xs opacity-90">Avg Score</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white text-center transform hover:scale-105 transition">
              <div className="text-2xl mb-1">🏆</div>
              <p className="text-2xl font-bold">{users[0]?.score || 0}</p>
              <p className="text-xs opacity-90">Top Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Ad */}
      <AdSpace type="banner" className="mx-4 mt-8 mb-4" />

      {/* Call to Action */}
      {!loading && users.length === 0 && (
        <div className="max-w-6xl mx-auto px-5 mt-8 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-center text-white">
            <div className="text-5xl mb-3">🚀</div>
            <h3 className="text-xl font-bold mb-2">Be the First on Leaderboard!</h3>
            <p className="mb-4">Take a quiz now and compete with thousands of aspirants</p>
            <Link href="/quiz" className="inline-block bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition">
              Start Quiz Now →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
