'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLogin from '@/components/GoogleLogin';
import { useLanguage } from '@/contexts/LanguageContext';

// Your Google Client ID
const GOOGLE_CLIENT_ID = '631788793965-cnah9hm9s0vq7qis7em75jui1net5ebp.apps.googleusercontent.com';

function LoginContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const [instagramId, setInstagramId] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/');
    }
  }, [router]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleInstagramLogin = async (e) => {
    e.preventDefault();
    
    if (!instagramId) {
      setError('Please enter your Instagram ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const cleanId = instagramId.replace('@', '');
    
    const userData = {
      id: Date.now().toString(),
      name: name || cleanId,
      email: `${cleanId}@instagram.user`,
      instagramId: cleanId,
      instagramUsername: cleanId,
      profileImage: `https://ui-avatars.com/api/?name=${cleanId}&background=3B82F6&color=fff&size=100`,
      role: 'user',
      score: 0,
      totalQuizzesTaken: 0,
      loginMethod: 'instagram'
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', 'user-token-' + Date.now());
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.find(u => u.instagramId === cleanId);
    if (!userExists) {
      existingUsers.push(userData);
      localStorage.setItem('users', JSON.stringify(existingUsers));
    }
    
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3 animate-bounce">🎯</div>
            <h1 className="text-2xl font-bold text-gray-800">{t.appName}</h1>
            <p className="text-gray-600 text-sm mt-2">{t.startPreparation}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <div className="mb-6">
            <GoogleLogin />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t.or}</span>
            </div>
          </div>

          {/* Instagram Login */}
          <form onSubmit={handleInstagramLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.instagramId}</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">@</span>
                <input
                  type="text"
                  value={instagramId}
                  onChange={(e) => setInstagramId(e.target.value.replace('@', ''))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="username"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{t.enterInstagram}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.displayName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t.yourName}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? t.loading : t.loginWithInstagram}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/admin-login" className="text-gray-500 text-sm hover:text-gray-700">
              {t.adminLogin} →
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500 mb-2">{t.quickDemoIds}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => { setInstagramId('kannada_exam_pro'); setName('Kannada Exam Pro User'); }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-200 transition">@kannada_exam_pro</button>
              <button onClick={() => { setInstagramId('kas_aspirant'); setName('KAS Aspirant'); }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-200 transition">@kas_aspirant</button>
              <button onClick={() => { setInstagramId('psi_preparation'); setName('PSI Student'); }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-200 transition">@psi_preparation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}
