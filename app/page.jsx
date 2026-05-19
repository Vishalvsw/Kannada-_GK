'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import AdSpace from '@/components/AdSpace';
import InstagramPopup from '@/components/InstagramPopup';

export default function Home() {
  const { t } = useLanguage();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [topUsers, setTopUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [showInstagramPopup, setShowInstagramPopup] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [canTakeQuiz, setCanTakeQuiz] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Check for temp user (just logged in with Google)
    const tempUserData = localStorage.getItem('tempUser');
    if (tempUserData) {
      const parsedUser = JSON.parse(tempUserData);
      setTempUser(parsedUser);
      setShowInstagramPopup(true);
    }
    
    // Check for existing user with Instagram ID
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.instagramId) {
        setCanTakeQuiz(true);
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      const [questionsRes, usersRes] = await Promise.all([
        fetch('/api/questions'),
        fetch('/api/leaderboard'),
      ]);
      const questions = await questionsRes.json();
      const users = await usersRes.json();
      setTotalQuestions(questions.length);
      setTopUsers(users.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInstagramComplete = (instagramId) => {
    setShowInstagramPopup(false);
    setTempUser(null);
    
    if (instagramId) {
      const completedUser = localStorage.getItem('user');
      if (completedUser) {
        setUser(JSON.parse(completedUser));
        setCanTakeQuiz(true);
      }
      localStorage.removeItem('tempUser');
    }
  };

  const categories = [
    { title: t.quiz, icon: '❓', color: 'from-blue-500 to-blue-600', href: canTakeQuiz ? '/quiz' : '#', desc: t.quizDesc },
    { title: t.notes, icon: '📝', color: 'from-green-500 to-green-600', href: '/notes', desc: t.notesDesc },
    { title: t.currentAffairs, icon: '📰', color: 'from-orange-500 to-orange-600', href: '/current-affairs', desc: t.currentAffairsDesc },
    { title: t.leaderboard, icon: '🏆', color: 'from-yellow-500 to-yellow-600', href: '/leaderboard', desc: t.leaderboardDesc },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Instagram Popup - Shows after Google login */}
      {showInstagramPopup && tempUser && (
        <InstagramPopup user={tempUser} onComplete={handleInstagramComplete} />
      )}

      <AdSpace type="banner" className="mx-4 mt-2" />

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-5xl">🎯</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold">{t.appName}</h1>
        <p className="text-blue-100 text-sm mt-1">{t.tagline}</p>
        <p className="text-lg font-semibold mt-4">{t.masterExams}</p>
        
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{t.dailyChallenges}</p>
              <p className="text-2xl font-bold">20 {t.mcq}</p>
              <p className="text-xs opacity-90">{t.winPrizes}</p>
            </div>
            {canTakeQuiz ? (
              <Link href="/quiz">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition transform hover:scale-105">
                  {t.startNow} →
                </button>
              </Link>
            ) : (
              <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold text-sm shadow-lg opacity-75 cursor-not-allowed">
                {t.startNow} →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Warning for users without Instagram ID */}
      {user && !user.instagramId && (
        <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm text-yellow-800">
              Please enter your Instagram ID to take quizzes and win prizes!
            </p>
          </div>
        </div>
      )}

      {user && user.instagramId && (
        <div className="px-5 -mt-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={user.picture} className="w-12 h-12 rounded-full border-2 border-blue-500" />
              <div>
                <p className="font-semibold text-gray-800">@{user.instagramId}</p>
                <p className="text-xs text-gray-500">{t.totalScore}: {user.score || 0} {t.points}</p>
              </div>
            </div>
            {canTakeQuiz && (
              <Link href="/quiz">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  {t.takeQuiz}
                </button>
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="px-5 mt-6">
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href}>
              <div className={`bg-white rounded-2xl shadow-md p-4 text-center hover:shadow-lg transition ${!canTakeQuiz && idx === 0 ? 'opacity-60' : ''}`}>
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center text-3xl shadow-md`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-800 mt-3">{cat.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
                {!canTakeQuiz && idx === 0 && (
                  <p className="text-xs text-red-500 mt-1">Instagram ID required</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <AdSpace type="inArticle" className="mx-4 my-6" />

      {topUsers.length > 0 && (
        <div className="px-5 mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">🏆 {t.winners}</h2>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5">
            <div className="space-y-3">
              {topUsers.map((user, idx) => (
                <div key={user._id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-500'}`}>
                    {idx + 1}
                  </div>
                  <img src={user.image} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.instagramId || user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{user.score}</p>
                    <p className="text-xs text-gray-500">{t.points}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/leaderboard">
              <button className="w-full mt-4 text-blue-600 font-semibold text-sm">📊 {t.viewAll} →</button>
            </Link>
          </div>
        </div>
      )}

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
