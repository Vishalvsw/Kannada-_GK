'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    // Get users from localStorage
    const storedUsers = localStorage.getItem('users');
    let allUsers = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Also get current user if not in list
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (!allUsers.find(u => u.instagramId === user.instagramId)) {
        allUsers.push(user);
        localStorage.setItem('users', JSON.stringify(allUsers));
      }
    }
    
    // Sort by score
    const sortedUsers = [...allUsers].sort((a, b) => (b.score || 0) - (a.score || 0));
    setUsers(sortedUsers.slice(0, 50));
    setLoading(false);
  };

  const getRankBadge = (index) => {
    if (index === 0) return <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-2xl">🥇</div>;
    if (index === 1) return <div className="w-10 h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-2xl">🥈</div>;
    if (index === 2) return <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-2xl">🥉</div>;
    return <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">{index + 1}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-8">
        <div className="text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-yellow-100 mt-2">Top performers ranking</p>
        </div>
      </div>

      <div className="px-5 -mt-8">
        {users.length >= 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex justify-around items-end">
              {users[1] && (
                <div className="text-center flex-1">
                  <img src={users[1].profileImage} className="w-16 h-16 rounded-full mx-auto border-2 border-gray-400" />
                  <p className="font-semibold text-sm mt-2">@{users[1].instagramId}</p>
                  <p className="text-xl font-bold">{users[1].score || 0}</p>
                  <div className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full mt-1 inline-block">2nd</div>
                </div>
              )}
              {users[0] && (
                <div className="text-center flex-1 -mt-6">
                  <img src={users[0].profileImage} className="w-20 h-20 rounded-full mx-auto border-4 border-yellow-500" />
                  <p className="font-bold text-base mt-2">@{users[0].instagramId}</p>
                  <p className="text-2xl font-bold text-yellow-600">{users[0].score || 0}</p>
                  <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full mt-1 inline-block">1st</div>
                </div>
              )}
              {users[2] && (
                <div className="text-center flex-1">
                  <img src={users[2].profileImage} className="w-16 h-16 rounded-full mx-auto border-2 border-orange-600" />
                  <p className="font-semibold text-sm mt-2">@{users[2].instagramId}</p>
                  <p className="text-xl font-bold">{users[2].score || 0}</p>
                  <div className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full mt-1 inline-block">3rd</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600 border-b">
            <div className="col-span-2">Rank</div>
            <div className="col-span-7">User</div>
            <div className="col-span-3 text-right">Score</div>
          </div>

          {loading ? (
            <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>
          ) : users.length > 0 ? (
            <div className="divide-y">
              {users.map((user, index) => (
                <div key={user.id || index} className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 transition">
                  <div className="col-span-2">{getRankBadge(index)}</div>
                  <div className="col-span-7 flex items-center gap-3">
                    <img src={user.profileImage} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-gray-800">{user.name || user.instagramId}</p>
                      <p className="text-xs text-gray-500">@{user.instagramId}</p>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="text-2xl font-bold text-blue-600">{user.score || 0}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-gray-600">No users yet</p>
              <Link href="/instagram-login" className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">
                Login with Instagram
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
