'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="text-red-600 text-2xl font-bold">
              <Link href="/">MOVIEFLIX</Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 text-white">
              <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
              <Link href="/tv-shows" className="hover:text-gray-300 transition-colors">TV Shows</Link>
              <Link href="/movies" className="hover:text-gray-300 transition-colors">Movies</Link>
              <Link href="/new-and-popular" className="hover:text-gray-300 transition-colors">New & Popular</Link>
              <Link href="/my-list" className="hover:text-gray-300 transition-colors">My List</Link>
              <Link href="/re-algorithm" className="hover:text-gray-300 transition-colors">RE Algorithm</Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
