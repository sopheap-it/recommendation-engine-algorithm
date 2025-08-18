'use client';

import { useState } from 'react';
import { User, Rating } from '@/lib/types/type';
import { Calculator, Target, TrendingUp, Users, ChevronDown, ChevronRight } from 'lucide-react';

interface DetailedSimilarityCalcProps {
  user1: User;
  user2: User;
  ratings: Rating[];
  similarity: number;
}

export function DetailedSimilarityCalc({
  user1,
  user2,
  ratings,
  similarity
}: DetailedSimilarityCalcProps) {
  const [showCalculation, setShowCalculation] = useState(false);
  const [showStepDetails, setShowStepDetails] = useState(false);

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

  // Calculate detailed similarity step by step
  const user1CommonRatings = commonMovies.map(r1 => {
    const r2 = user2Ratings.find(r => r.movieId === r1.movieId);
    return {
      movieId: r1.movieId,
      user1: r1.rating,
      user2: r2!.rating
    };
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

  const calculatedSimilarity = denominator1 === 0 || denominator2 === 0
    ? 0
    : numerator / Math.sqrt(denominator1 * denominator2);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold">Similarity Calculation</h4>
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

      {/* Formula Display */}
      <div className="bg-gray-700 p-4 rounded-lg mb-4">
        <h5 className="text-white font-medium mb-3 flex items-center space-x-2">
          <Target className="h-4 w-4 text-yellow-400" />
          <span>Pearson Correlation Formula</span>
        </h5>
        <div className="bg-gray-800 p-3 rounded mb-3">
          <p className="text-yellow-400 font-mono text-sm text-center">
            r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)
          </p>
        </div>
        <p className="text-gray-300 text-xs">
          Where x = {user1.name}&apos;s ratings, y = {user2.name}&apos;s ratings, x̄ = mean of x, ȳ = mean of y
        </p>
      </div>

      {/* Step-by-Step Calculation */}
      <div className="space-y-3">
        <button
          onClick={() => setShowCalculation(!showCalculation)}
          className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Calculator className="h-4 w-4 text-green-400" />
            <span className="text-white font-medium">Show Step-by-Step Calculation</span>
          </div>
          {showCalculation ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {showCalculation && (
          <div className="space-y-4">
            {/* Step 1: Common Movies */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <h6 className="text-white font-medium mb-2">Step 1: Find Common Movies</h6>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Movies:</span>
                  <span className="text-white ml-2">{user1CommonRatings.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Movies Analyzed:</span>
                  <span className="text-white ml-2">{user1CommonRatings.length}</span>
                </div>
              </div>
            </div>

            {/* Step 2: Calculate Means */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <h6 className="text-white font-medium mb-2">Step 2: Calculate Mean Ratings</h6>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">{user1.name} Mean (x̄):</span>
                  <span className="text-white ml-2">{user1Mean.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400">{user2.name} Mean (ȳ):</span>
                  <span className="text-white ml-2">{user2Mean.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Step 3: Detailed Calculations */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <h6 className="text-white font-medium mb-2">Step 3: Calculate Differences & Products</h6>

              <button
                onClick={() => setShowStepDetails(!showStepDetails)}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1 mb-3"
              >
                <ChevronRight className={`h-3 w-3 transition-transform ${showStepDetails ? 'rotate-90' : ''}`} />
                <span>{showStepDetails ? 'Hide' : 'Show'} Detailed Math</span>
              </button>

              {showStepDetails && (
                <div className="space-y-3">
                  <div className="bg-gray-800 p-3 rounded">
                    <h6 className="text-white font-medium mb-2 text-sm">Movie-by-Movie Calculation:</h6>
                    <div className="space-y-2 text-xs">
                      {user1CommonRatings.slice(0, 5).map((rating, idx) => {
                        const diff1 = rating.user1 - user1Mean;
                        const diff2 = rating.user2 - user2Mean;
                        const product = diff1 * diff2;

                        return (
                          <div key={idx} className="grid grid-cols-6 gap-2 text-center">
                            <span className="text-gray-400">Movie {idx + 1}</span>
                            <span className="text-gray-300">{rating.user1}</span>
                            <span className="text-gray-300">{rating.user2}</span>
                            <span className="text-blue-400">{diff1.toFixed(2)}</span>
                            <span className="text-blue-400">{diff2.toFixed(2)}</span>
                            <span className="text-yellow-400">{product.toFixed(2)}</span>
                          </div>
                        );
                      })}
                      {user1CommonRatings.length > 5 && (
                        <div className="text-center text-gray-500 text-xs">
                          ... and {user1CommonRatings.length - 5} more movies
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                <div>
                  <span className="text-gray-400">Numerator Σ(x-x̄)(y-ȳ):</span>
                  <span className="text-white ml-2 block">{numerator.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Denominator 1 Σ(x-x̄)²:</span>
                  <span className="text-white ml-2 block">{denominator1.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Denominator 2 Σ(y-ȳ)²:</span>
                  <span className="text-white ml-2 block">{denominator2.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Step 4: Final Calculation */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <h6 className="text-white font-medium mb-2">Step 4: Final Calculation</h6>
              <div className="bg-gray-800 p-3 rounded mb-3">
                <p className="text-yellow-400 font-mono text-sm text-center">
                  r = {numerator.toFixed(2)} / √({denominator1.toFixed(2)} × {denominator2.toFixed(2)})
                </p>
                <p className="text-yellow-400 font-mono text-sm text-center mt-2">
                  r = {numerator.toFixed(2)} / √({(denominator1 * denominator2).toFixed(2)})
                </p>
                <p className="text-yellow-400 font-mono text-sm text-center mt-2">
                  r = {numerator.toFixed(2)} / {Math.sqrt(denominator1 * denominator2).toFixed(2)}
                </p>
                <p className="text-yellow-400 font-mono text-sm text-center mt-2">
                  r = {calculatedSimilarity.toFixed(4)}
                </p>
              </div>

              <div className="text-center">
                <span className="text-gray-400 text-sm">Final Similarity:</span>
                <span className="text-blue-400 font-bold text-lg ml-2">
                  {(calculatedSimilarity * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Similarity Interpretation */}
      <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg">
        <h6 className="text-blue-400 font-medium mb-2 flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>Similarity Interpretation</span>
        </h6>
        <div className="text-blue-200 text-xs space-y-1">
          <div><strong>0.8-1.0:</strong> Very similar tastes (like best friends)</div>
          <div><strong>0.5-0.8:</strong> Similar tastes (like good friends)</div>
          <div><strong>0.2-0.5:</strong> Somewhat similar (like acquaintances)</div>
          <div><strong>0.0-0.2:</strong> Different tastes (not useful for recommendations)</div>
        </div>
      </div>
    </div>
  );
}
