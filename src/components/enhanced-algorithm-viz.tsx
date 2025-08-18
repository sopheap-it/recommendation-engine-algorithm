'use client';

import { useState } from 'react';
import { User, Movie, Rating } from '@/lib/types/type';
import { Calculator, Users, TrendingUp, Star, ArrowRight, ChevronDown, ChevronRight, CheckCircle, XCircle, Target, Zap, BarChart3, Eye, EyeOff } from 'lucide-react';
import { RECOMMENDATION_CONFIG, ConfigHelpers } from '@/lib/config/recommendation-config';

interface EnhancedAlgorithmVizProps {
  currentUser: User;
  targetMovie: Movie;
  ratings: Rating[];
  similarUsers: { user: User; similarity: number }[];
  predictedRating: number;
}

export function EnhancedAlgorithmViz({
  currentUser,
  targetMovie,
  ratings,
  similarUsers,
  predictedRating
}: EnhancedAlgorithmVizProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1]));
  const [showMathDetails, setShowMathDetails] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<string | null>(null);

  const currentUserRatings = ratings.filter(r => r.userId === currentUser.id);
  const movieRatings = ratings.filter(r => r.movieId === targetMovie.id);

  const relevantSimilarUsers = similarUsers
    .filter(({ user, similarity }) =>
      ConfigHelpers.isSimilarityValid(similarity) &&
      movieRatings.some(r => r.userId === user.id)
    )
    .slice(0, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS);

  const isRecommendable = ConfigHelpers.isRatingValid(predictedRating);

  // Calculate detailed similarity for demonstration
  const calculateDetailedSimilarity = (user1: User, user2: User) => {
    const user1Ratings = ratings.filter(r => r.userId === user1.id);
    const user2Ratings = ratings.filter(r => r.userId === user2.id);

    // Find common movies
    const commonMovies = user1Ratings.filter(r1 =>
      user2Ratings.some(r2 => r2.movieId === r1.movieId)
    );

    if (commonMovies.length < RECOMMENDATION_CONFIG.SIMILARITY.MIN_COMMON_RATINGS) {
      return { similarity: 0, details: null };
    }

    // Calculate Pearson correlation
    const user1CommonRatings = commonMovies.map(r1 => {
      const r2 = user2Ratings.find(r => r.movieId === r1.movieId);
      return { user1: r1.rating, user2: r2!.rating };
    });

    const user1Mean = user1CommonRatings.reduce((sum, r) => sum + r.user1, 0) / user1CommonRatings.length;
    const user2Mean = user1CommonRatings.reduce((sum, r) => sum + r.user2, 0) / user1CommonRatings.length;

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

    const similarity = denominator1 === 0 || denominator2 === 0 ? 0 : numerator / Math.sqrt(denominator1 * denominator2);

    return {
      similarity,
      details: {
        commonMovies: user1CommonRatings,
        user1Mean,
        user2Mean,
        numerator,
        denominator1,
        denominator2
      }
    };
  };

  const toggleStep = (stepNumber: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepNumber)) {
      newExpanded.delete(stepNumber);
    } else {
      newExpanded.add(stepNumber);
    }
    setExpandedSteps(newExpanded);
  };

  const steps = [
    {
      id: 1,
      title: "User Profile Analysis",
      description: "Analyze current user's rating patterns and preferences",
      icon: <Users className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Current User: {currentUser.name}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Total Ratings:</span>
                <span className="text-white ml-2">{currentUserRatings.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Average Rating:</span>
                <span className="text-white ml-2">
                  {currentUserRatings.length > 0
                    ? ConfigHelpers.formatRating(currentUserRatings.reduce((sum, r) => sum + r.rating, 0) / currentUserRatings.length)
                    : 'No ratings'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Similar User Discovery",
      description: "Find users with similar taste preferences using Pearson correlation",
      icon: <Calculator className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Similarity Thresholds</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Minimum Similarity:</span>
                <span className="text-white ml-2">{ConfigHelpers.formatSimilarity(RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD)}</span>
              </div>
              <div>
                <span className="text-gray-400">Min Common Ratings:</span>
                <span className="text-white ml-2">{RECOMMENDATION_CONFIG.SIMILARITY.MIN_COMMON_RATINGS}</span>
              </div>
            </div>
          </div>

          {/* Pearson Correlation Formula */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
              <Target className="h-4 w-4 text-yellow-400" />
              <span>Pearson Correlation Formula</span>
            </h4>
            <div className="bg-gray-800 p-3 rounded mb-3">
              <p className="text-yellow-400 font-mono text-sm text-center">
                r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)
              </p>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              This formula measures how similar two users&apos; rating patterns are.
              Values range from -1 (opposite tastes) to +1 (identical tastes).
            </p>

            <button
              onClick={() => setShowMathDetails(!showMathDetails)}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
            >
              <ChevronRight className={`h-3 w-3 transition-transform ${showMathDetails ? 'rotate-90' : ''}`} />
              <span>{showMathDetails ? 'Hide' : 'Show'} Step-by-Step Math</span>
            </button>

            {showMathDetails && (
              <div className="mt-3 space-y-3">
                <div className="bg-gray-800 p-3 rounded">
                  <h5 className="text-white font-medium mb-2">Step 1: Calculate Means</h5>
                  <p className="text-gray-300 text-xs">
                    x̄ = average rating of User 1, ȳ = average rating of User 2
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <h5 className="text-white font-medium mb-2">Step 2: Calculate Differences</h5>
                  <p className="text-gray-300 text-xs">
                    (x - x̄) = how much each rating differs from User 1&apos;s average
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <h5 className="text-white font-medium mb-2">Step 3: Multiply Differences</h5>
                  <p className="text-gray-300 text-xs">
                    (x - x̄)(y - ȳ) = product of differences for each movie
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <h5 className="text-white font-medium mb-2">Step 4: Sum and Normalize</h5>
                  <p className="text-gray-300 text-xs">
                    Divide by the square root of the sum of squared differences
                  </p>
                </div>
              </div>
            )}
          </div>

          {relevantSimilarUsers.length > 0 ? (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Top Similar Users</h4>
              <div className="space-y-3">
                {relevantSimilarUsers.slice(0, 3).map(({ user, similarity }) => {
                  const detailedSimilarity = calculateDetailedSimilarity(currentUser, user);
                  const isShowingDetails = selectedUserForDetails === user.id;

                  return (
                    <div key={user.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{user.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-blue-400 font-bold">{ConfigHelpers.formatSimilarity(similarity)}</span>
                          <button
                            onClick={() => setSelectedUserForDetails(isShowingDetails ? null : user.id)}
                            className="flex items-center space-x-1 text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                          >
                            {isShowingDetails ? (
                              <>
                                <EyeOff className="h-3 w-3" />
                                <span>Hide Details</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3" />
                                <span>View Details</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>



                      {/* Detailed Similarity Calculation */}
                      {isShowingDetails && detailedSimilarity.details && (
                        <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
                          <h6 className="text-white font-medium mb-3 text-sm">Detailed Similarity Calculation</h6>

                          {/* Formula */}
                          <div className="bg-gray-700 p-2 rounded mb-3">
                            <p className="text-yellow-400 font-mono text-xs text-center">
                              r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)
                            </p>
                          </div>

                          {/* Step-by-Step Calculation */}
                          <div className="space-y-3 text-xs">
                            {/* Step 1: Common Movies */}
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-gray-400">Common Movies:</span>
                              <span className="text-white">{detailedSimilarity.details.commonMovies.length}</span>
                            </div>

                            {/* Step 2: Means */}
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-gray-400">{currentUser.name} Mean (x̄):</span>
                              <span className="text-white">{detailedSimilarity.details.user1Mean.toFixed(2)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-gray-400">{user.name} Mean (ȳ):</span>
                              <span className="text-white">{detailedSimilarity.details.user2Mean.toFixed(2)}</span>
                            </div>

                            {/* Step 3: Calculation Components */}
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-gray-400">Numerator Σ(x-x̄)(y-ȳ):</span>
                              <span className="text-white">{detailedSimilarity.details.numerator.toFixed(2)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-gray-400">Denominator 1 Σ(x-x̄)²:</span>
                              <span className="text-white">{detailedSimilarity.details.denominator1.toFixed(2)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-gray-400">Denominator 2 Σ(y-ȳ)²:</span>
                              <span className="text-white">{detailedSimilarity.details.denominator2.toFixed(2)}</span>
                            </div>

                            {/* Step 4: Final Calculation */}
                            <div className="mt-3 pt-2 border-t border-gray-600">
                              <div className="text-center space-y-1">
                                <p className="text-yellow-400 font-mono">
                                  r = {detailedSimilarity.details.numerator.toFixed(2)} / √({detailedSimilarity.details.denominator1.toFixed(2)} × {detailedSimilarity.details.denominator2.toFixed(2)})
                                </p>
                                <p className="text-yellow-400 font-mono">
                                  r = {detailedSimilarity.details.numerator.toFixed(2)} / √({(detailedSimilarity.details.denominator1 * detailedSimilarity.details.denominator2).toFixed(2)})
                                </p>
                                <p className="text-yellow-400 font-mono">
                                  r = {detailedSimilarity.details.numerator.toFixed(2)} / {Math.sqrt(detailedSimilarity.details.denominator1 * detailedSimilarity.details.denominator2).toFixed(2)}
                                </p>
                                <p className="text-blue-400 font-bold text-lg">
                                  r = {similarity.toFixed(4)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {relevantSimilarUsers.length > 3 && (
                  <div className="text-center text-gray-500 text-xs pt-2 border-t border-gray-600">
                    ... and {relevantSimilarUsers.length - 3} more users
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400">No users meet the similarity threshold</p>
              <p className="text-xs text-gray-500 mt-1">
                Need at least {ConfigHelpers.formatSimilarity(RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD)} similarity
              </p>
            </div>
          )}

          <div className="bg-green-900/30 border border-green-500 p-4 rounded-lg">
            <h4 className="text-green-400 font-medium mb-2 flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>How Similarity Works</span>
            </h4>
            <p className="text-green-200 text-sm">
              <strong>0.8-1.0:</strong> Very similar tastes (like best friends)<br />
              <strong>0.5-0.8:</strong> Similar tastes (like good friends)<br />
              <strong>0.2-0.5:</strong> Somewhat similar (like acquaintances)<br />
              <strong>0.0-0.2:</strong> Different tastes (not useful for recommendations)
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Rating Prediction",
      description: "Calculate predicted rating using weighted average of similar users",
      icon: <TrendingUp className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Prediction Formula</h4>
            <div className="bg-gray-800 p-3 rounded mb-3">
              <p className="text-yellow-400 font-mono text-sm text-center">
                Predicted Rating = Σ(similarity × rating) / Σ(similarity)
              </p>
            </div>
            <p className="text-gray-300 text-sm">
              This is a <strong>weighted average</strong> where more similar users have more influence on the prediction.
            </p>
          </div>

          {relevantSimilarUsers.length > 0 ? (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Calculation Details</h4>
              <div className="space-y-3">
                {relevantSimilarUsers.slice(0, 5).map(({ user, similarity }) => {
                  const userRating = movieRatings.find(r => r.userId === user.id);
                  if (!userRating) return null;

                  return (
                    <div key={user.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{user.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">Rating: {ConfigHelpers.formatRating(userRating.rating)}</span>
                        <span className="text-gray-400">×</span>
                        <span className="text-blue-400">{ConfigHelpers.formatSimilarity(similarity)}</span>
                        <span className="text-gray-400">=</span>
                        <span className="text-white font-medium">
                          {(userRating.rating * similarity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-600">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Final Prediction:</span>
                  <span className="text-white font-bold">{ConfigHelpers.formatRating(predictedRating)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-400">Cannot calculate prediction without similar users</p>
            </div>
          )}

          <div className="bg-purple-900/30 border border-purple-500 p-4 rounded-lg">
            <h4 className="text-purple-400 font-medium mb-2 flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Why Weighted Average?</span>
            </h4>
            <p className="text-purple-200 text-sm">
              If your best friend (80% similar) rates a movie 5/5 and an acquaintance (30% similar) rates it 1/5,
              the prediction will be closer to 5/5 because your best friend&apos;s opinion matters more!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Recommendation Decision",
      description: "Evaluate if movie meets recommendation criteria",
      icon: <Star className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Recommendation Criteria</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Min Predicted Rating:</span>
                <span className="text-white ml-2">{ConfigHelpers.formatRating(RECOMMENDATION_CONFIG.RATING.MIN_PREDICTED)}</span>
              </div>
              <div>
                <span className="text-gray-400">Min Similar Users:</span>
                <span className="text-white ml-2">{RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS}</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${isRecommendable ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
            <div className="flex items-center space-x-3 mb-3">
              {isRecommendable ? (
                <CheckCircle className="h-6 w-6 text-green-400" />
              ) : (
                <XCircle className="h-6 w-6 text-red-400" />
              )}
              <h4 className={`text-lg font-semibold ${isRecommendable ? 'text-green-400' : 'text-red-400'}`}>
                {isRecommendable ? 'RECOMMENDED' : 'NOT RECOMMENDED'}
              </h4>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Predicted Rating:</span>
                <span className={`font-medium ${isRecommendable ? 'text-green-400' : 'text-red-400'}`}>
                  {ConfigHelpers.formatRating(predictedRating)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Similar Users:</span>
                <span className="text-white">{relevantSimilarUsers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Meets Rating Threshold:</span>
                <span className={ConfigHelpers.isRatingValid(predictedRating) ? 'text-green-400' : 'text-red-400'}>
                  {ConfigHelpers.isRatingValid(predictedRating) ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Meets User Threshold:</span>
                <span className={ConfigHelpers.hasEnoughSimilarUsers(relevantSimilarUsers.length) ? 'text-green-400' : 'text-red-400'}>
                  {ConfigHelpers.hasEnoughSimilarUsers(relevantSimilarUsers.length) ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-orange-900/30 border border-orange-500 p-4 rounded-lg">
            <h4 className="text-orange-400 font-medium mb-2 flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Quality Control</span>
            </h4>
            <p className="text-orange-200 text-sm">
              We only recommend movies when we&apos;re confident about the prediction.
              This prevents bad recommendations and ensures you get quality suggestions!
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-white text-2xl font-semibold flex items-center space-x-2">
          <Calculator className="h-6 w-6 text-red-600" />
          <span>Step-by-Step Algorithm Process</span>
        </h2>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleStep(step.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              </div>
              {expandedSteps.has(step.id) ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedSteps.has(step.id) && (
              <div className="px-4 pb-4">
                {step.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
          <ArrowRight className="h-5 w-5 text-green-400" />
          <span>Summary</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-400">Similar Users Found</p>
            <p className="text-white font-bold">{relevantSimilarUsers.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Predicted Rating</p>
            <p className="text-white font-bold">{ConfigHelpers.formatRating(predictedRating)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Recommendation</p>
            <p className={`font-bold ${isRecommendable ? 'text-green-400' : 'text-red-400'}`}>
              {isRecommendable ? 'YES' : 'NO'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
