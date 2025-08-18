'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { HeroBanner } from '@/components/hero-banner';
import { MovieRow } from '@/components/movie-row';
import { MovieDetailModal } from '@/components/movie-detail-modal';
import { Movie, User } from '@/lib/types/type';
import { CollaborativeFiltering } from '@/lib/core/collaborative-filtering.core';
import { moviesWithRatings, sampleRatings, sampleUsers, initializeRecommendationSystem } from '@/lib/data/mocks';
import { RECOMMENDATION_CONFIG, ConfigHelpers } from '@/lib/config/recommendation-config';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [cf, setCf] = useState<CollaborativeFiltering | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const initSystem = async () => {
      const cf = await initializeRecommendationSystem();
      setCf(cf);
      setCurrentUser(sampleUsers[0]);
    };

    initSystem();
  }, []);

  useEffect(() => {
    if (cf && currentUser) {
      // Use getRecommendations method which properly excludes already rated movies
      const recommendations = cf.getRecommendations(currentUser.id, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_RECOMMENDATIONS);
      const recommendedMovies = recommendations.map(rec => rec.movie);

      setRecommendations(recommendedMovies);
    }
  }, [cf, currentUser]);

  const handleRateMovie = (movieId: string, rating: number) => {
    if (cf && currentUser) {
      // Add the rating
      cf.addRating({
        id: Date.now().toString(),
        userId: currentUser.id,
        movieId,
        rating,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Recalculate recommendations using getRecommendations
      const recommendations = cf.getRecommendations(currentUser.id, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_RECOMMENDATIONS);
      const recommendedMovies = recommendations.map(rec => rec.movie);
      setRecommendations(recommendedMovies);
    }
  };

  const handleUserChange = (userId: string) => {
    const user = sampleUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const getMoviePrediction = (movieId: string): number => {
    if (!cf || !currentUser) return 0;
    const prediction = cf.predictRating(currentUser.id, movieId);
    return prediction !== null ? prediction : 0;
  };

  const getSimilarUsersForMovie = (movieId: string) => {
    if (!cf || !currentUser) return [];
    return cf
      .findSimilarUsers(currentUser.id, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS)
      .filter(({ user, similarity }) =>
        ConfigHelpers.isSimilarityValid(similarity) &&
        sampleRatings.some((r) => r.userId === user.id && r.movieId === movieId)
      )
      .slice(0, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS);
  };

  const handleMoreInfo = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  // Check if current user can receive recommendations
  const userRecommendationStatus = cf && currentUser ? cf.canUserReceiveRecommendations(currentUser.id) : null;

  if (!currentUser || !cf) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Group movies by genre for different rows
  const actionMovies = moviesWithRatings.filter(movie =>
    movie.genres.some(genre => genre.name === 'Action')
  );
  const dramaMovies = moviesWithRatings.filter(movie =>
    movie.genres.some(genre => genre.name === 'Drama')
  );
  const sciFiMovies = moviesWithRatings.filter(movie =>
    movie.genres.some(genre => genre.name === 'Science Fiction')
  );

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Banner */}
      <div className="pt-16">
        <HeroBanner movie={moviesWithRatings[0]} />
      </div>

      {/* User Selection */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-white text-lg font-semibold mb-4">👤 Select User Profile</h3>
          <div className="flex flex-wrap gap-3">
            {sampleUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserChange(user.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentUser.id === user.id
                  ? 'bg-red-600 text-white shadow-lg scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                  }`}
              >
                {user.name}
              </button>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Currently viewing as: <span className="text-white font-medium">{currentUser.name}</span>
          </p>
        </div>
      </div>

      {/* Recommendation Status */}
      {/* {userRecommendationStatus && (
        <div className="container mx-auto px-4 mb-8">
          <div className={`rounded-lg p-6 ${userRecommendationStatus.canReceive ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
            <div className="flex items-center space-x-3 mb-3">
              {userRecommendationStatus.canReceive ? (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              ) : (
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✗</span>
                </div>
              )}
              <h3 className={`text-lg font-semibold ${userRecommendationStatus.canReceive ? 'text-green-400' : 'text-red-400'}`}>
                Recommendation Status
              </h3>
            </div>
            <p className={`text-sm ${userRecommendationStatus.canReceive ? 'text-green-300' : 'text-red-300'}`}>
              {userRecommendationStatus.reason}
            </p>
            <div className="mt-3 text-xs text-gray-400">
              <p>• Similar users found: {userRecommendationStatus.similarUsersCount}</p>
              <p>• Minimum required: {RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS} users with ≥{ConfigHelpers.formatSimilarity(RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD)} similarity</p>
              <p>• Minimum common ratings: {RECOMMENDATION_CONFIG.SIMILARITY.MIN_COMMON_RATINGS} movies</p>
            </div>
          </div>
        </div>
      )} */}

      {/* Movie Rows */}
      <div className="container mx-auto px-4 space-y-8 pb-16">
        {/* Recommendations Row */}
        {recommendations.length > 0 && userRecommendationStatus?.canReceive && (
          <MovieRow
            title="Recommended for You"
            movies={recommendations}
            showPredictedRatings={true}
            onRateMovie={handleRateMovie}
            onMoreInfo={handleMoreInfo}
          />
        )}

        {/* Show message if no recommendations possible */}
        {(!userRecommendationStatus?.canReceive || recommendations.length === 0) && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">No Personalized Recommendations Available</h3>
            <p className="text-gray-400 mb-4">
              {userRecommendationStatus?.reason || "This user doesn't have enough similar users to generate reliable recommendations."}
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Need at least {RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS} users with ≥{ConfigHelpers.formatSimilarity(RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD)} similarity</p>
              <p>• Each user must have rated at least {RECOMMENDATION_CONFIG.SIMILARITY.MIN_COMMON_RATINGS} common movies</p>
            </div>
          </div>
        )}

        {/* Action Movies */}
        <MovieRow
          title="Action Movies"
          movies={actionMovies}
          showPredictedRatings={true}
          onRateMovie={handleRateMovie}
          onMoreInfo={handleMoreInfo}
        />

        {/* Drama Movies */}
        <MovieRow
          title="Drama Movies"
          movies={dramaMovies}
          showPredictedRatings={true}
          onRateMovie={handleRateMovie}
          onMoreInfo={handleMoreInfo}
        />

        {/* Sci-Fi Movies */}
        <MovieRow
          title="Science Fiction"
          movies={sciFiMovies}
          showPredictedRatings={true}
          onRateMovie={handleRateMovie}
          onMoreInfo={handleMoreInfo}
        />

        {/* All Movies */}
        <MovieRow
          title="All Movies"
          movies={moviesWithRatings}
          showPredictedRatings={true}
          onRateMovie={handleRateMovie}
          onMoreInfo={handleMoreInfo}
        />
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          users={sampleUsers}
          ratings={sampleRatings}
          currentUserId={currentUser.id}
          predictedRating={getMoviePrediction(selectedMovie.id)}
          similarUsers={getSimilarUsersForMovie(selectedMovie.id)}
          cf={cf}
        />
      )}
    </div>
  );
}
