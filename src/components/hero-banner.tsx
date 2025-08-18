'use client';

import { Movie } from '@/lib/types/type';
import { Play, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface HeroBannerProps {
  movie: Movie;
}

export function HeroBanner({ movie }: HeroBannerProps) {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = '/placeholder-backdrop.jpg';
          }}
          width={1920}
          height={1080}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end">
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-5xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            {/* Rating and Year */}
            <div className="flex items-center space-x-4 mb-4 text-white/80">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg">{movie.voteAverage.toFixed(1)}</span>
              </div>
              <span className="text-lg">{new Date(movie.releaseDate).getFullYear()}</span>
              <span className="text-lg">{movie.genres.map(g => g.name).join(', ')}</span>
            </div>

            {/* Overview */}
            <p className="text-white/90 text-lg mb-6 line-clamp-3">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                <Play className="h-5 w-5 mr-2" />
                Play
              </Button>
              <Button size="lg" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                <Info className="h-5 w-5 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
