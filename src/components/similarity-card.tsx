'use client';

import { User, Rating } from '@/lib/types/type';
import { Users, TrendingUp } from 'lucide-react';

interface SimilarityCardProps {
  user1: User;
  user2: User;
  ratings: Rating[];
  similarity: number;
  showMath?: boolean;
}

export function SimilarityCard({
  user1,
  user2,
  ratings,
  similarity,
  showMath = false
}: SimilarityCardProps) {
  // Get ratings for both users
  const user1Ratings = ratings.filter(r => r.userId === user1.id);
  const user2Ratings = ratings.filter(r => r.userId === user2.id);

  // Find common movies
  const commonMovies = user1Ratings.filter(r1 =>
    user2Ratings.some(r2 => r2.movieId === r1.movieId)
  );

  if (commonMovies.length === 0) {
    return (
      <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg">
        <p className="text-red-200 text-sm">
          No common movies between {user1.name} and {user2.name}
        </p>
      </div>
    );
  }

  // Calculate basic metrics
  const user1CommonRatings = commonMovies.map(r1 => {
    const r2 = user2Ratings.find(r => r.movieId === r1.movieId);
    return { user1: r1.rating, user2: r2!.rating };
  });

  const user1Mean = user1CommonRatings.reduce((sum, r) => sum + r.user1, 0) / user1CommonRatings.length;
  const user2Mean = user1CommonRatings.reduce((sum, r) => sum + r.user2, 0) / user1CommonRatings.length;

  // Calculate Pearson correlation components
  let numerator = 0;
  let denominator1 = 0;
  let denominator2 = 0;

  user1CommonRatings.forEach(({ user1, user2 }) => {
    const diff1 = user1 - user1Mean;
    const diff2 = user2 - user2Mean;
    numerator += diff1 * diff2;
    denominator1 += diff1 * diff1;
    denominator2 += diff2 * diff2;
  });

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold">Similarity Analysis</h4>
            <p className="text-gray-400 text-sm">
              {user1.name} vs {user2.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">
            {(similarity * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">Similarity Score</div>
        </div>
      </div>

      {/* Basic Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-gray-400 text-xs">Common Movies</p>
          <p className="text-white font-bold">{commonMovies.length}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">Correlation</p>
          <p className="text-blue-400 font-bold">{similarity.toFixed(3)}</p>
        </div>
      </div>

      {/* Mathematical Details */}
      {showMath && (
        <div className="space-y-3">
          {/* Formula */}
          <div className="bg-gray-700 p-3 rounded">
            <h6 className="text-white font-medium mb-2 text-sm">Pearson Correlation Formula</h6>
            <div className="bg-gray-800 p-2 rounded mb-2">
              <p className="text-yellow-400 font-mono text-xs text-center">
                r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)
              </p>
            </div>
          </div>

          {/* Means */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">{user1.name} Mean:</span>
              <span className="text-white ml-2">{user1Mean.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-400">{user2.name} Mean:</span>
              <span className="text-white ml-2">{user2Mean.toFixed(2)}</span>
            </div>
          </div>

          {/* Calculation Components */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Numerator Σ(x-x̄)(y-ȳ):</span>
              <span className="text-white">{numerator.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Denominator 1 Σ(x-x̄)²:</span>
              <span className="text-white">{denominator1.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Denominator 2 Σ(y-ȳ)²:</span>
              <span className="text-white">{denominator2.toFixed(2)}</span>
            </div>
          </div>

          {/* Final Calculation */}
          <div className="bg-gray-700 p-3 rounded">
            <h6 className="text-white font-medium mb-2 text-sm">Final Calculation</h6>
            <div className="text-center">
              <p className="text-yellow-400 font-mono text-xs">
                r = {numerator.toFixed(2)} / √({(denominator1 * denominator2).toFixed(2)})
              </p>
              <p className="text-yellow-400 font-mono text-xs mt-1">
                r = {numerator.toFixed(2)} / {Math.sqrt(denominator1 * denominator2).toFixed(2)}
              </p>
              <p className="text-blue-400 font-bold text-lg mt-2">
                r = {similarity.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Similarity Interpretation */}
      <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg">
        <h6 className="text-blue-400 font-medium mb-2 flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>Interpretation</span>
        </h6>
        <div className="text-blue-200 text-xs">
          {similarity >= 0.8 && <div><strong>Very Similar:</strong> Like best friends</div>}
          {similarity >= 0.5 && similarity < 0.8 && <div><strong>Similar:</strong> Like good friends</div>}
          {similarity >= 0.2 && similarity < 0.5 && <div><strong>Somewhat Similar:</strong> Like acquaintances</div>}
          {similarity < 0.2 && <div><strong>Different:</strong> Not useful for recommendations</div>}
        </div>
      </div>
    </div>
  );
}
