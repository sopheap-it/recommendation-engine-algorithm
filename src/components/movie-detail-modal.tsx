'use client';

import { useState } from 'react';
import { X, Star, Users, TrendingUp, Calculator, CheckCircle, XCircle } from 'lucide-react';
import { EnhancedAlgorithmViz } from './enhanced-algorithm-viz';
import { Movie, Rating, User } from '@/lib/types/type';
import { CollaborativeFiltering } from '@/lib/core/collaborative-filtering.core';
import { RECOMMENDATION_CONFIG, ConfigHelpers } from '@/lib/config/recommendation-config';
import Image from 'next/image';

interface MovieDetailModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  ratings: Rating[];
  currentUserId: string;
  predictedRating?: number;
  similarUsers?: { user: User; similarity: number }[];
  algorithmSteps?: {
    step: string;
    description: string;
    data: unknown;
  }[];
  cf?: CollaborativeFiltering; // Add the collaborative filtering instance
}

export function MovieDetailModal({
  movie,
  isOpen,
  onClose,
  users,
  ratings,
  currentUserId,
  predictedRating,
  similarUsers,
  cf
}: MovieDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'ratings' | 'algorithm'>('overview');

  if (!isOpen) return null;

  const movieRatings = ratings.filter(r => r.movieId === movie.id);
  const currentUser = users.find(u => u.id === currentUserId);
  const currentUserRating = movieRatings.find(r => r.userId === currentUserId);

  const getRatingUsers = () => {
    return movieRatings.map(rating => {
      const user = users.find(u => u.id === rating.userId);
      return { user, rating };
    }).filter(item => item.user);
  };

  const averageRating = movieRatings.length > 0
    ? movieRatings.reduce((sum, r) => sum + r.rating, 0) / movieRatings.length
    : 0;

  // Calculate confidence score (same formula as engine)
  const confidenceScore = (() => {
    if (!similarUsers || similarUsers.length === 0) return 0;
    const avgSim = similarUsers.reduce((sum, { similarity }) => sum + similarity, 0) / similarUsers.length;
    const penalty = Math.max(0, (RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD - avgSim) / RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD);
    let conf = avgSim * (1 - penalty);
    const bonus = Math.min(0.2, similarUsers.length * 0.05);
    conf = Math.min(1, conf + bonus);
    return Math.max(0, conf);
  })();

  const getRecommendationQuality = (movieId: string) => {
    if (!cf || !currentUser) return null;
    return cf.getRecommendationQualityMetrics(currentUser.id, movieId);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
            alt={movie.title}
            className="w-full h-64 object-cover rounded-t-lg"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = '/placeholder-backdrop.jpg';
            }}
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              <span>•</span>
              <span>{movie.genres.map(g => g.name).join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'overview'
              ? 'text-white border-b-2 border-red-600'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'ratings'
              ? 'text-white border-b-2 border-red-600'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            User Ratings ({movieRatings.length})
          </button>
          <button
            onClick={() => setActiveTab('algorithm')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'algorithm'
              ? 'text-white border-b-2 border-red-600'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Algorithm Flow
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-2">Synopsis</h3>
                <p className="text-gray-300 leading-relaxed">{movie.overview.replace(/'/g, "&apos;")}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">Movie Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Release Date:</span>
                      <span className="text-white">{new Date(movie.releaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">TMDB Rating:</span>
                      <span className="text-white">{movie.voteAverage.toFixed(1)}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">User Average:</span>
                      <span className="text-white">{ConfigHelpers.formatRating(averageRating)} ({movieRatings.length} ratings)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Predicted Rating:</span>
                      <span className="text-white">{predictedRating ? ConfigHelpers.formatRating(predictedRating) : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">User Ratings</h3>
                {currentUserRating ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Your rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= currentUserRating.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">You haven&apos;t rated this movie yet</span>
                )}
              </div>

              <div className="space-y-4">
                {getRatingUsers().map(({ user, rating }) => (
                  <div key={user?.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= rating.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-medium">{ConfigHelpers.formatRating(rating.rating)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {movieRatings.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No ratings yet. Be the first to rate this movie!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'algorithm' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-6 w-6 text-red-600" />
                  <h3 className="text-xl font-semibold text-white">Collaborative Filtering Algorithm</h3>
                </div>
              </div>

              {predictedRating && currentUser && similarUsers ? (
                <div className="space-y-6">
                  {/* Prediction Result */}
                  <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Prediction Result</h4>
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold text-white">{predictedRating.toFixed(RECOMMENDATION_CONFIG.UI.RATING_DECIMALS)}</div>
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
                      <span className="text-white/80">predicted rating for {currentUser.name}</span>
                    </div>

                    {/* Confidence Score */}
                    {/* <div className="mt-4 pt-4 border-t border-red-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Confidence Score:</span>
                        <span className="text-white font-semibold">{ConfigHelpers.formatConfidence(confidenceScore)}</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-red-500/30 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${confidenceScore * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-white/60 mt-1">
                          <span>Low</span>
                          <span>Medium</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  {/* Recommendation Quality Metrics */}
                  {cf && (
                    <div className="bg-gray-800 p-6 rounded-lg mb-6">
                      <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                        <Calculator className="h-5 w-5 text-blue-400" />
                        <span>Recommendation Quality Analysis</span>
                      </h4>

                      {(() => {
                        const quality = getRecommendationQuality(movie.id);
                        if (!quality) {
                          return (
                            <div className="text-gray-400 text-center py-4">
                              Unable to analyze recommendation quality
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <p className="text-gray-300 text-xs">Similar Users</p>
                                <p className={`text-lg font-bold ${quality.hasSimilarUsers ? 'text-green-400' : 'text-red-400'}`}>
                                  {quality.similarUsersCount}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-300 text-xs">Avg Similarity</p>
                                <p className="text-white font-bold">
                                  {ConfigHelpers.formatSimilarity(quality.averageSimilarity)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-300 text-xs">Min Similarity</p>
                                <p className="text-white font-bold">
                                  {ConfigHelpers.formatSimilarity(quality.minSimilarity)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-300 text-xs">Max Similarity</p>
                                <p className="text-white font-bold">
                                  {ConfigHelpers.formatSimilarity(quality.maxSimilarity)}
                                </p>
                              </div>
                            </div>

                            <div className={`p-3 rounded-lg ${quality.canRecommend ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
                              <div className="flex items-center space-x-2">
                                {quality.canRecommend ? (
                                  <CheckCircle className="h-5 w-5 text-green-400" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-400" />
                                )}
                                <span className={`font-medium ${quality.canRecommend ? 'text-green-400' : 'text-red-400'}`}>
                                  {quality.canRecommend ? 'RECOMMENDABLE' : 'NOT RECOMMENDABLE'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 mt-2">
                                {quality.canRecommend
                                  ? `This movie can be recommended based on ${quality.similarUsersCount} similar users with strong similarity scores.`
                                  : `This movie cannot be recommended because there are insufficient similar users (${quality.similarUsersCount}/${RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS} required) or similarity scores are too low.`
                                }
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}



                  {/* Enhanced Algorithm Visualization */}
                  <EnhancedAlgorithmViz
                    currentUser={currentUser}
                    targetMovie={movie}
                    ratings={ratings}
                    similarUsers={similarUsers}
                    predictedRating={predictedRating}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No prediction available. Rate some movies first to get personalized recommendations!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
