'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">{t.appName}</h3>
            <p className="text-sm text-gray-400">Prepare for KAS, PSI, PDO, FDA, SDA exams with interactive quizzes.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">{t.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition">{t.privacyPolicy}</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition">{t.termsConditions}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">{t.contactUs}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">{t.followUs}</h3>
            <div className="flex gap-4"><a href="#" className="text-2xl hover:text-blue-400 transition">📸</a><a href="#" className="text-2xl hover:text-blue-400 transition">👍</a><a href="#" className="text-2xl hover:text-blue-400 transition">❤️</a></div>
            <p className="text-sm text-gray-400 mt-4">© 2024 {t.appName}. {t.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
