'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import AdSpace from '@/components/AdSpace';

export default function Home() {
  const { t } = useLanguage();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [topUsers, setTopUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  useEffect(() => {
    fetchData();
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % slidingLogos.length);
    }, 3000);
    return () => clearInterval(interval);
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

  const slidingLogos = [
    { name: 'KAS Exam', icon: '👨‍⚖️', color: 'from-blue-500 to-blue-600' },
    { name: 'PSI Exam', icon: '👮', color: 'from-green-500 to-green-600' },
    { name: 'PDO Exam', icon: '📋', color: 'from-purple-500 to-purple-600' },
    { name: 'FDA Exam', icon: '📝', color: 'from-orange-500 to-orange-600' },
    { name: 'SDA Exam', icon: '📊', color: 'from-red-500 to-red-600' },
  ];

  const currentLogo = slidingLogos[currentLogoIndex];

  const categories = [
    { title: t.quiz, icon: '❓', color: 'from-blue-500 to-blue-600', href: '/quiz', desc: '20 MCQ / Win Prizes', bgColor: 'bg-blue-50' },
    { title: t.notes, icon: '📝', color: 'from-green-500 to-green-600', href: '/notes', desc: '50 imp Questions & Answers', bgColor: 'bg-green-50' },
    { title: t.currentAffairs, icon: '📰', color: 'from-orange-500 to-orange-600', href: '/current-affairs', desc: 'Check It Now', bgColor: 'bg-orange-50' },
    { title: t.leaderboard, icon: '🏆', color: 'from-yellow-500 to-yellow-600', href: '/leaderboard', desc: 'Top Winners', bgColor: 'bg-yellow-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-5xl">🎯</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold">{t.appName}</h1>
        <p className="text-blue-100 text-sm mt-1">{t.tagline}</p>
        <p className="text-lg font-semibold mt-4">{t.masterExams}</p>
        
        {/* Sliding Logos */}
        <div className="mt-6 overflow-hidden">
          <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 animate-slide-left">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentLogo.color} flex items-center justify-center text-2xl shadow-lg`}>
              {currentLogo.icon}
            </div>
            <span className="font-semibold text-sm">{currentLogo.name}</span>
            <span className="w-2 h-2 rounded-full bg-white/50"></span>
            <span className="text-xs opacity-75">Next: {slidingLogos[(currentLogoIndex + 1) % slidingLogos.length].name}</span>
          </div>
        </div>
        
        {/* Daily Challenge Card */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{t.dailyChallenges}</p>
              <p className="text-2xl font-bold">20 {t.mcq}</p>
              <p className="text-xs opacity-90">{t.winPrizes}</p>
            </div>
            <Link href="/quiz">
              <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition transform hover:scale-105">
                {t.startNow} →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* User Welcome Card */}
      {user && (
        <div className="px-5 -mt-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={user.profileImage} className="w-12 h-12 rounded-full border-2 border-blue-500" />
              <div>
                <p className="font-semibold text-gray-800">@{user.instagramId}</p>
                <p className="text-xs text-gray-500">{t.totalScore}: {user.score || 0} {t.points}</p>
              </div>
            </div>
            <Link href="/quiz">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">{t.takeQuiz}</button>
            </Link>
          </div>
        </div>
      )}

      {/* Category Cards */}
      <div className="px-5 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href}>
              <div className="bg-white rounded-2xl shadow-md p-4 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center text-3xl shadow-md`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-800 mt-3">{cat.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <AdSpace type="inArticle" className="mx-4 my-6" />

      {/* Top Winners */}
      {topUsers.length > 0 && (
        <div className="px-5 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">🏆 {t.winners}</h2>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5">
            <div className="space-y-3">
              {topUsers.map((user, idx) => (
                <div key={user._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-500'}`}>
                    {idx + 1}
                  </div>
                  <img src={user.image} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.instagramId || user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">{user.score}</p>
                    <p className="text-xs text-gray-500">{t.points}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/leaderboard">
              <button className="w-full mt-4 text-blue-600 font-semibold text-sm hover:underline">📊 {t.viewAll} →</button>
            </Link>
          </div>
        </div>
      )}

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />

      <style jsx>{`
        @keyframes slideLeft {
          0% { transform: translateX(100%); opacity: 0; }
          10% { transform: translateX(0); opacity: 1; }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        .animate-slide-left { animation: slideLeft 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
