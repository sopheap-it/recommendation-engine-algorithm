'use client';

import { useState } from 'react';
import { User, Movie, Rating } from '@/lib/types/type';
import { Calculator, Users, TrendingUp, Star, ArrowRight } from 'lucide-react';

interface AlgorithmVisualizationProps {
  currentUser: User;
  targetMovie: Movie;
  users: User[];
  ratings: Rating[];
  similarUsers: { user: User; similarity: number }[];
  predictedRating: number;
}

export function AlgorithmVisualization({
  currentUser,
  targetMovie,
  users,
  ratings,
  similarUsers,
  predictedRating
}: AlgorithmVisualizationProps) {
  const [activeStep, setActiveStep] = useState(1);

  const currentUserRatings = ratings.filter(r => r.userId === currentUser.id);
  const movieRatings = ratings.filter(r => r.movieId === targetMovie.id);

  const relevantSimilarUsers = similarUsers.filter(({ user }) =>
    movieRatings.some(r => r.userId === user.id)
  );

  const steps = [
    {
      id: 1,
      title: "User Rating Analysis",
      description: "Analyze current user's rating patterns",
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3">Current User: {currentUser.name}</h4>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">Total ratings: {currentUserRatings.length}</p>
              <p className="text-gray-300 text-sm">Average rating: {
                currentUserRatings.length > 0
                  ? (currentUserRatings.reduce((sum, r) => sum + r.rating, 0) / currentUserRatings.length).toFixed(1)
                  : '0.0'
              }/5</p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3">Rated Movies</h4>
            <div className="space-y-2">
              {currentUserRatings.slice(0, 5).map((rating) => {
                const movie = users.find(u => u.id === rating.movieId);
                return (
                  <div key={rating.id} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{movie?.name || 'Unknown'}</span>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${star <= rating.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-white text-sm">{rating.rating}/5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Similarity Calculation",
      description: "Calculate Pearson correlation with other users",
      icon: Calculator,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3">Similar Users Found</h4>
            <div className="space-y-3">
              {relevantSimilarUsers.slice(0, 5).map(({ user, similarity }) => {
                const userRating = movieRatings.find(r => r.userId === user.id);
                return (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{user.name}</p>
                        <p className="text-gray-400 text-xs">Similarity: {(similarity * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    {userRating && (
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${star <= userRating.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-400'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-white text-sm">{userRating.rating}/5</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3">Pearson Correlation Formula</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)</p>
              <p>Where:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>x, y = ratings from two users</li>
                <li>x̄, ȳ = mean ratings for each user</li>
                <li>r = correlation coefficient (-1 to 1)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Weighted Average Prediction",
      description: "Calculate final predicted rating",
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-lg">
            <h4 className="text-white font-semibold mb-4">Final Prediction</h4>
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold text-white">{predictedRating.toFixed(1)}</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${star <= predictedRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                      }`}
                  />
                ))}
              </div>
              <span className="text-white/80">predicted rating</span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3">Calculation Details</h4>
            <div className="space-y-3">
              {relevantSimilarUsers.slice(0, 3).map(({ user, similarity }) => {
                const userRating = movieRatings.find(r => r.userId === user.id);
                if (!userRating) return null;

                const weightedRating = similarity * userRating.rating;
                return (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium text-sm">{user.name}</span>
                      <span className="text-gray-400 text-xs">({(similarity * 100).toFixed(1)}% similar)</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">
                        {userRating.rating} × {similarity.toFixed(3)} = {weightedRating.toFixed(3)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-gray-700 rounded">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Weighted Sum:</span>
                <span className="text-white">
                  {relevantSimilarUsers
                    .map(({ user, similarity }) => {
                      const userRating = movieRatings.find(r => r.userId === user.id);
                      return userRating ? similarity * userRating.rating : 0;
                    })
                    .reduce((sum, val) => sum + val, 0)
                    .toFixed(3)
                  }
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white font-medium">Similarity Sum:</span>
                <span className="text-white">
                  {relevantSimilarUsers
                    .reduce((sum, { similarity }) => sum + similarity, 0)
                    .toFixed(3)
                  }
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 text-yellow-400 font-bold">
                <span>Final Prediction:</span>
                <span>{predictedRating.toFixed(1)}/5</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="h-6 w-6 text-red-600" />
        <h2 className="text-xl font-semibold text-white">Algorithm Visualization</h2>
      </div>

      {/* Step Navigation */}
      <div className="flex space-x-2 mb-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeStep === step.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="space-y-4">
        {steps.find(step => step.id === activeStep)?.content}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
          disabled={activeStep === 1}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => setActiveStep(Math.min(3, activeStep + 1))}
          disabled={activeStep === 3}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
        >
          <span>Next</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
