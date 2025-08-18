'use client';

import { useState } from 'react';
import { Movie } from '@/lib/types/type';
import { Star, Play, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface MovieCardProps {
  movie: Movie;
  onRate?: (rating: number) => void;
  showRating?: boolean;
  predictedRating?: number;
  onMoreInfo?: () => void;
}

export function MovieCard({ movie, onRate, showRating = false, predictedRating, onMoreInfo }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleRate = (rating: number) => {
    onRate?.(rating);
  };

  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreInfo?.();
  };

  // Format rating display - show user average rating if available, otherwise show TMDB rating
  const displayRating = movie.averageRating > 0 ? movie.averageRating : (movie.voteAverage / 2);

  return (
    <div
      className="relative cursor-pointer transition-transform duration-300 hover:scale-105 isolate"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster Container - Fixed Height */}
      <div className="relative overflow-hidden rounded-md h-[300px]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = '/placeholder-movie.jpg';
          }}
          width={500}
          height={750}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Content - Only Action Buttons */}
        {isHovered && (
          <div className="absolute inset-0 flex flex-col justify-between p-4 text-white z-10">
            {/* Top Section - Action Buttons */}
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30">
                  <Play className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30"
                onClick={handleMoreInfo}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            {/* Bottom Section - Only Genres */}
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre.id}
                  className="text-xs px-2 py-1 bg-white/20 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Movie Info (always visible) - Fixed height */}
      <div className="mt-2 space-y-1 h-[60px]">
        <h3 className="font-medium text-sm line-clamp-1">{movie.title}</h3>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>{new Date(movie.releaseDate).getFullYear()}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{displayRating.toFixed(1)}/5</span>
            {movie.ratingCount > 0 && (
              <span className="text-gray-400">({movie.ratingCount} ratings)</span>
            )}
          </div>
        </div>

        {/* Predicted Rating (if shown) */}
        {showRating && predictedRating && (
          <div className="flex items-center space-x-1 mt-1">
            <span className="text-xs text-gray-400">Predicted:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 cursor-pointer transition-colors ${star <= predictedRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate(star);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
