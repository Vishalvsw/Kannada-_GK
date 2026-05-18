'use client';

import { useDemoAuth } from '@/components/DemoAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useDemoAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/quiz', label: 'Quiz', icon: '❓' },
    { path: '/current-affairs', label: 'Current Affairs', icon: '📰' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  if (user?.role === 'admin' || user?.role === 'super_admin') {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }
  
  if (user) {
    navItems.push({ path: '/profile', label: 'Profile', icon: '👤' });
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">GK ಕ್ವಿಜ್</span>
              <span className="ml-2 text-sm text-gray-600 hidden sm:inline">KAS | PSI | PDO</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <span className="mr-1">{item.icon}</span>{item.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-3 ml-4">
                <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">Sign Out</button>
              </div>
            ) : (
              <Link href="/demo-login" className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg">
                🚀 Demo Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                <span className="mr-2">{item.icon}</span>{item.label}
              </Link>
            ))}
            {!user && (
              <Link href="/demo-login" className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
                🚀 Demo Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
