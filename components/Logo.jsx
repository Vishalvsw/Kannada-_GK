'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ size = 'md', showText = true, variant = 'full' }) {
  const sizes = {
    xs: { width: 32, height: 32, text: 'text-sm', imgClass: 'w-8 h-8' },
    sm: { width: 40, height: 40, text: 'text-base', imgClass: 'w-10 h-10' },
    md: { width: 48, height: 48, text: 'text-xl', imgClass: 'w-12 h-12' },
    lg: { width: 56, height: 56, text: 'text-2xl', imgClass: 'w-14 h-14' },
    xl: { width: 64, height: 64, text: 'text-3xl', imgClass: 'w-16 h-16' },
    '2xl': { width: 80, height: 80, text: 'text-4xl', imgClass: 'w-20 h-20' },
  };

  const currentSize = sizes[size] || sizes.md;

  // Logo variants with text
  const variants = {
    full: {
      text: 'Kannada Exam Pro',
      subtext: 'KAS | PSI | PDO'
    },
    simple: {
      text: 'Exam Pro',
      subtext: ''
    },
    kannada: {
      text: 'ಕನ್ನಡ ಎಕ್ಸಾಂ ಪ್ರೋ',
      subtext: 'Kannada Exam Pro'
    },
    short: {
      text: 'KEP',
      subtext: ''
    }
  };

  const selectedVariant = variants[variant] || variants.full;

  return (
    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
      {/* Logo Image */}
      <div className={`relative ${currentSize.imgClass} flex-shrink-0`}>
        <img
          src="/images/logo.png"
          alt="Kannada Exam Pro Logo"
          width={currentSize.width}
          height={currentSize.height}
          className="rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback if logo image doesn't exist
            e.target.src = 'https://ui-avatars.com/api/?name=KEP&background=3B82F6&color=fff&size=80';
          }}
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-gray-800 ${currentSize.text} tracking-tight leading-tight`}>
            {selectedVariant.text}
          </span>
          {selectedVariant.subtext && (
            <span className="text-xs text-gray-500 tracking-wide">
              {selectedVariant.subtext}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
