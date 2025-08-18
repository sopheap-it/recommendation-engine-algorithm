'use client';

import { Movie } from '@/lib/types/type';
import { MovieCard } from './movie-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  showPredictedRatings?: boolean;
  onRateMovie?: (movieId: string, rating: number) => void;
  onMoreInfo?: (movie: Movie) => void;
}

export function MovieRow({ title, movies, showPredictedRatings = false, onRateMovie, onMoreInfo }: MovieRowProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = rowRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      rowRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>

      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Movie Row */}
        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
          onScroll={checkScrollButtons}
          onLoad={checkScrollButtons}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-[200px]">
              <MovieCard
                movie={movie}
                showRating={showPredictedRatings}
                onRate={(rating) => onRateMovie?.(movie.id, rating)}
                onMoreInfo={() => onMoreInfo?.(movie)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
