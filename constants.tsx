
import React from 'react';
import { CarouselSlide } from './types';

export const SLIDES: CarouselSlide[] = [
  {
    id: 0,
    title: "Post it. Sell it. Done.",
    description: "Declutter your dorm and make extra cash. List anything from sneakers to notebooks in seconds.",
    imageUrl: "https://images.unsplash.com/photo-1523240715630-38890737a9f1?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: 1,
    title: "Campus-Verified Deals",
    description: "Shop with confidence from fellow students. No shipping fees, just easy meetups at the union.",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=2000&auto=format&fit=crop",
    icon: 'location'
  },
  {
    id: 2,
    title: "Second Life for Your Gear",
    description: "Join thousands of students giving their items a second home. Sustainable, simple, and local.",
    imageUrl: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=2000&auto=format&fit=crop"
  }
];

export const Logo = () => (
  <div className="flex items-center gap-2">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#00687F" fillOpacity="0.15"/>
      <circle cx="12" cy="12" r="9" stroke="#00687F" strokeWidth="2.5"/>
      <path d="M8 12L16 12" stroke="#00687F" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 8L12 16" stroke="#00687F" strokeWidth="2.5" strokeLinecap="round" transform="rotate(45 12 12)"/>
    </svg>
    <span className="text-2xl font-bold tracking-tighter text-gray-900">Sellit</span>
  </div>
);
