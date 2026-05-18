'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const logos = [
  { name: 'Karnataka Civil', image: '/logos/defence.jpg', alt: 'Karnataka Civil' },
  { name: 'Karnataka Police', image: '/logos/police.png', alt: 'Karnataka Police' },
  { name: 'Defence Corps', image: '/logos/defence.jpg', alt: 'Defence Corps' },
  { name: 'Home Affairs', image: '/logos/defence.jpg', alt: 'Ministry of Home Affairs' },
  { name: 'Govt of India', image: '/logos/defence.jpg', alt: 'Government of India' },
];

export default function SlidingLogos() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentLogo = logos[currentIndex];

  return (
    <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 animate-slide-left">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
        <img 
          src={currentLogo.image} 
          alt={currentLogo.alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://ui-avatars.com/api/?name=' + currentLogo.name + '&background=3B82F6&color=fff';
          }}
        />
      </div>
      <span className="font-semibold text-sm">{currentLogo.name}</span>
      <span className="w-2 h-2 rounded-full bg-white/50"></span>
      <span className="text-xs opacity-75">Next: {logos[(currentIndex + 1) % logos.length].name}</span>
    </div>
  );
}
