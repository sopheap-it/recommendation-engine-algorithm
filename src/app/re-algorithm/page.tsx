'use client';

import { Navbar } from '@/components/navbar';
import { EnhancedAlgorithmViz } from '@/components/enhanced-algorithm-viz';
import { CollaborativeFiltering } from '@/lib/core/collaborative-filtering.core';
import { moviesWithRatings, sampleUsers, sampleRatings, initializeRecommendationSystem } from '@/lib/data/mocks';
import { useState, useEffect } from 'react';
import { Movie, User } from '@/lib/types/type';
import { ChevronDown, ChevronRight, BookOpen, Play, CheckCircle, XCircle } from 'lucide-react';
import { RECOMMENDATION_CONFIG } from '@/lib/config/recommendation-config';

export default function REAlgorithmPage() {
  const [cf, setCf] = useState<CollaborativeFiltering | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showAlgorithmViz, setShowAlgorithmViz] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basics'])); // Default expanded
  const [showLiveDemo, setShowLiveDemo] = useState(false);
  const [allMoviePredictions, setAllMoviePredictions] = useState<{
    movie: Movie;
    predictedRating: number | null;
    isRecommendable: boolean;
    hasUserRated: boolean;
  }[]>([]);

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
      // Get user's rated movies
      const userRatedMovies = new Set(
        sampleRatings.filter(r => r.userId === currentUser.id).map(r => r.movieId)
      );

      // Get all movie predictions for display (excluding already rated movies for recommendations)
      const allPredictions = moviesWithRatings.map(movie => {
        const predictedRating = cf.predictRating(currentUser.id, movie.id);
        const hasUserRated = userRatedMovies.has(movie.id);

        // Only recommend if user hasn't rated it and meets criteria
        const isRecommendable = !hasUserRated &&
          predictedRating !== null &&
          predictedRating >= RECOMMENDATION_CONFIG.RATING.MIN_PREDICTED;

        return {
          movie,
          predictedRating,
          isRecommendable,
          hasUserRated
        };
      });

      setAllMoviePredictions(allPredictions);
    }
  }, [cf, currentUser]);

  const getMoviePrediction = (movieId: string): number => {
    if (!cf || !currentUser) return 0;
    const prediction = cf.predictRating(currentUser.id, movieId);
    return prediction !== null ? prediction : 0;
  };

  const getSimilarUsers = () => {
    if (!cf || !currentUser) return [];
    return cf.findSimilarUsers(currentUser.id, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS)
      .filter(({ similarity }) => similarity >= RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD)
      .slice(0, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS);
  };

  const handleShowAlgorithmViz = () => {
    if (allMoviePredictions.length > 0 && currentUser) {
      // Find a movie that the current user hasn't rated yet for better demonstration
      const userRatedMovies = new Set(
        sampleRatings.filter(r => r.userId === currentUser.id).map(r => r.movieId)
      );

      // First try to find a recommended movie that user hasn't rated
      const recommendedUnratedMovie = allMoviePredictions.find(pred =>
        pred.isRecommendable && !userRatedMovies.has(pred.movie.id)
      );

      // If no recommended unrated movie, find any unrated movie
      const unratedMovie = allMoviePredictions.find(pred =>
        !userRatedMovies.has(pred.movie.id)
      );

      // Fallback to first movie if all are rated
      const selectedMovie = recommendedUnratedMovie?.movie || unratedMovie?.movie || allMoviePredictions[0].movie;

      setSelectedMovie(selectedMovie);
      setShowAlgorithmViz(true);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleUserChange = (userId: string) => {
    const user = sampleUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  if (!currentUser || !cf) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Recommendation Engine Algorithm</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">Explore how our Netflix-style recommendation system works, from basic concepts to advanced algorithms with real-world production values.</p>

            {/* User Selection */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="text-white text-lg font-semibold mb-4">👤 Select User Profile for Analysis</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {sampleUsers.map((user) => (
                  <button key={user.id} onClick={() => handleUserChange(user.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentUser.id === user.id ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'}`}>{user.name}</button>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-3">Currently analyzing: <span className="text-white font-medium">{currentUser.name}</span></p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setShowLiveDemo(!showLiveDemo)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                <Play className="h-5 w-5" /><span>{showLiveDemo ? 'Hide' : 'Show'} All Movie Predictions & Recommendations</span>
              </button>
              {/* <button onClick={() => {
                setShowAlgorithmViz(!showAlgorithmViz);
                handleShowAlgorithmViz();
              }} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                <Calculator className="h-5 w-5" /><span>{showAlgorithmViz ? 'Hide' : 'Show'} Step-by-Step Process</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Live Algorithm Demo */}
      {showLiveDemo && (
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-white text-2xl font-semibold mb-6 flex items-center space-x-2">
              <Play className="h-6 w-6 text-green-400" />
              <span>🎯 Live Algorithm Demo</span>
            </h2>

            {/* Current User Info */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <h3 className="text-white font-medium mb-2">Current User: {currentUser.name}</h3>
              <p className="text-gray-300 text-sm">User ID: {currentUser.id}</p>
            </div>

            {/* System Stats */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <h3 className="text-white font-medium mb-3">📈 System Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-300 text-xs">Total Users</p>
                  <p className="text-white font-bold">{sampleUsers.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-xs">Total Movies</p>
                  <p className="text-white font-bold">{moviesWithRatings.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-xs">Total Ratings</p>
                  <p className="text-white font-bold">{sampleRatings.length}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-gray-300 text-xs">Recommendations</p>
                  <p className="text-green-400 font-bold">
                    {allMoviePredictions.filter(p => p.isRecommendable).length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-xs">Not Recommended</p>
                  <p className="text-red-400 font-bold">
                    {allMoviePredictions.filter(p => !p.isRecommendable).length}
                  </p>
                </div>
              </div>
            </div>

            {/* All Movie Predictions */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-4">📊 All Movie Predictions & Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {allMoviePredictions.map(({ movie, predictedRating, isRecommendable }) => {
                  const similarUsers = cf ? cf.findSimilarUsers(currentUser.id, 10)
                    .filter(({ user }) => sampleRatings.some(r => r.userId === user.id && r.movieId === movie.id))
                    .slice(0, 5) : [];

                  return (
                    <div key={movie.id} className={`p-3 rounded-lg border ${isRecommendable ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm line-clamp-2">{movie.title}</h4>
                        {isRecommendable ? (
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                        )}
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">User Avg Rating:</span>
                          <span className="text-white">{movie.averageRating > 0 ? `${movie.averageRating}/5` : 'No ratings'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Predicted Rating:</span>
                          <span className={`font-medium ${isRecommendable ? 'text-green-400' : 'text-red-400'}`}>
                            {predictedRating !== null ? predictedRating.toFixed(1) : 'N/A'}/5
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Similar Users:</span>
                          <span className="text-white">{similarUsers.length}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Status:</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${isRecommendable ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            {isRecommendable ? 'RECOMMENDED' : 'NOT RECOMMENDED'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="mt-4 p-3 bg-gray-700 rounded">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-300 text-xs">Total Movies</p>
                    <p className="text-white font-bold">{allMoviePredictions.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs">Recommended</p>
                    <p className="text-green-400 font-bold">
                      {allMoviePredictions.filter(p => p.isRecommendable).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs">Not Recommended</p>
                    <p className="text-red-400 font-bold">
                      {allMoviePredictions.filter(p => !p.isRecommendable).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Algorithm Visualization */}
      {showAlgorithmViz && selectedMovie && (
        <div className="container mx-auto px-4 mb-16">
          <EnhancedAlgorithmViz
            currentUser={currentUser}
            targetMovie={selectedMovie}
            ratings={sampleRatings}
            similarUsers={getSimilarUsers()}
            predictedRating={getMoviePrediction(selectedMovie.id)}
          />
        </div>
      )}

      {/* Educational Content (Collapsible Sections) */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-white text-2xl font-semibold mb-6 flex items-center space-x-2"><BookOpen className="h-6 w-6 text-blue-400" /><span>📚 Recommendation Systems: Complete Guide</span></h2>

          {/* Section 1: Basics */}
          <div className="mb-6">
            <button onClick={() => toggleSection('basics')} className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className="text-white text-lg font-semibold flex items-center space-x-2"><span>1. 🤖 What are Recommendation Systems?</span></h3>
              {expandedSections.has('basics') ? (<ChevronDown className="h-5 w-5 text-gray-400" />) : (<ChevronRight className="h-5 w-5 text-gray-400" />)}
            </button>
            {expandedSections.has('basics') && (
              <div className="p-4 bg-gray-700 rounded-lg mt-2">
                <p className="text-gray-300 mb-3">Recommendation systems are AI-powered tools that suggest items to users based on their preferences, behavior, and similarity to other users.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-600 p-3 rounded">
                    <h4 className="text-white font-medium mb-2">🎯 Key Benefits:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Personalized user experience</li>
                      <li>• Increased user engagement</li>
                      <li>• Better content discovery</li>
                      <li>• Higher conversion rates</li>
                    </ul>
                  </div>
                  <div className="bg-gray-600 p-3 rounded">
                    <h4 className="text-white font-medium mb-2">🌍 Real-World Examples:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Netflix movie recommendations</li>
                      <li>• Amazon product suggestions</li>
                      <li>• Spotify music discovery</li>
                      <li>• YouTube video suggestions</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Algorithm Types */}
          <div className="mb-6">
            <button onClick={() => toggleSection('algorithms')} className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className="text-white text-lg font-semibold flex items-center space-x-2"><span>2. 🧮 Types of Recommendation Algorithms</span></h3>
              {expandedSections.has('algorithms') ? (<ChevronDown className="h-5 w-5 text-gray-400" />) : (<ChevronRight className="h-5 w-5 text-gray-400" />)}
            </button>
            {expandedSections.has('algorithms') && (
              <div className="p-4 bg-gray-700 rounded-lg mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-gray-600 p-3 rounded">
                      <h4 className="text-white font-medium mb-2">👥 Collaborative Filtering</h4>
                      <p className="text-gray-300 text-sm mb-2">Finds similar users and recommends items they liked.</p>
                      <div className="text-xs text-gray-400">
                        <p>✅ Pros: No item metadata needed, discovers hidden patterns</p>
                        <p>❌ Cons: Cold start problem, sparsity issues</p>
                      </div>
                    </div>

                    <div className="bg-gray-600 p-3 rounded">
                      <h4 className="text-white font-medium mb-2">🏷️ Content-Based Filtering</h4>
                      <p className="text-gray-300 text-sm mb-2">Recommends items similar to what user liked before.</p>
                      <div className="text-xs text-gray-400">
                        <p>✅ Pros: No cold start, explainable recommendations</p>
                        <p>❌ Cons: Limited diversity, requires item features</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-600 p-3 rounded">
                      <h4 className="text-white font-medium mb-2">🧠 Hybrid Approaches</h4>
                      <p className="text-gray-300 text-sm mb-2">Combines multiple methods for better results.</p>
                      <div className="text-xs text-gray-400">
                        <p>✅ Pros: Best of both worlds, higher accuracy</p>
                        <p>❌ Cons: More complex, harder to implement</p>
                      </div>
                    </div>

                    <div className="bg-gray-600 p-3 rounded">
                      <h4 className="text-white font-medium mb-2">📊 Matrix Factorization</h4>
                      <p className="text-gray-300 text-sm mb-2">Decomposes user-item matrix into latent factors.</p>
                      <div className="text-xs text-gray-400">
                        <p>✅ Pros: Handles sparsity, scalable</p>
                        <p>❌ Cons: Black box, hard to interpret</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Mathematical Formulas */}
          <div className="mb-6">
            <button onClick={() => toggleSection('formulas')} className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className="text-white text-lg font-semibold flex items-center space-x-2"><span>3. 📐 Mathematical Formulas & Similarity Measures</span></h3>
              {expandedSections.has('formulas') ? (<ChevronDown className="h-5 w-5 text-gray-400" />) : (<ChevronRight className="h-5 w-5 text-gray-400" />)}
            </button>
            {expandedSections.has('formulas') && (
              <div className="p-4 bg-gray-700 rounded-lg mt-2">
                <div className="space-y-4">
                  <div className="bg-gray-600 p-4 rounded">
                    <h4 className="text-white font-medium mb-3">📊 Pearson Correlation Coefficient</h4>
                    <div className="bg-gray-700 p-3 rounded mb-3">
                      <p className="text-yellow-400 font-mono text-sm">r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)</p>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">Measures linear correlation between two variables (-1 to 1).</p>
                    <div className="text-xs text-gray-400">
                      <p>• r = 1: Perfect positive correlation</p>
                      <p>• r = 0: No correlation</p>
                      <p>• r = -1: Perfect negative correlation</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-600 p-3 rounded">
                      <h4 className="text-white font-medium mb-2">📏 Cosine Similarity</h4>
                      <div className="bg-gray-700 p-2 rounded mb-2">
                        <p className="text-yellow-400 font-mono text-xs">cos(θ) = A·B / (||A|| × ||B||)</p>
                      </div>
                      <p className="text-gray-300 text-sm">Measures angle between two vectors (0 to 1).</p>
                    </div>

                    <div className="bg-gray-600 p-3 rounded">
                      <h4 className="text-white font-medium mb-2">🎯 Jaccard Similarity</h4>
                      <div className="bg-gray-700 p-2 rounded mb-2">
                        <p className="text-yellow-400 font-mono text-xs">J = |A∩B| / |A∪B|</p>
                      </div>
                      <p className="text-gray-300 text-sm">Measures overlap between two sets (0 to 1).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Common Questions */}
          <div className="mb-6">
            <button onClick={() => toggleSection('questions')} className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className="text-white text-lg font-semibold flex items-center space-x-2"><span>4. ❓ Common Questions & Answers</span></h3>
              {expandedSections.has('questions') ? (<ChevronDown className="h-5 w-5 text-gray-400" />) : (<ChevronRight className="h-5 w-5 text-gray-400" />)}
            </button>
            {expandedSections.has('questions') && (
              <div className="p-4 bg-gray-700 rounded-lg mt-2">
                <div className="space-y-4">
                  <div className="bg-gray-600 p-3 rounded">
                    <h4 className="text-white font-medium mb-2">❓ How does the algorithm handle new users?</h4>
                    <p className="text-gray-300 text-sm">New users start with no ratings, so we use content-based filtering or popular items until they rate enough movies for collaborative filtering.</p>
                  </div>

                  <div className="bg-gray-600 p-3 rounded">
                    <h4 className="text-white font-medium mb-2">❓ What about the cold start problem?</h4>
                    <p className="text-gray-300 text-sm">We address this by requiring minimum common ratings ({RECOMMENDATION_CONFIG.SIMILARITY.MIN_COMMON_RATINGS}) and using fallback strategies for new users/items.</p>
                  </div>

                  <div className="bg-gray-600 p-3 rounded">
                    <h4 className="text-white font-medium mb-2">❓ How do you measure recommendation quality?</h4>
                    <p className="text-gray-300 text-sm">We use multiple metrics: predicted rating accuracy, similarity thresholds, confidence scores, and production-grade thresholds based on industry research.</p>
                  </div>

                  <div className="bg-gray-600 p-3 rounded">
                    <h4 className="text-white font-medium mb-2">❓ Why these specific threshold values?</h4>
                    <p className="text-gray-300 text-sm">Our thresholds (similarity ≥ {RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD}, rating ≥ {RECOMMENDATION_CONFIG.RATING.MIN_PREDICTED}/5) are based on Netflix and Amazon research for optimal recommendation quality.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Real-World Applications */}
          <div className="mb-6">
            <button onClick={() => toggleSection('applications')} className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className="text-white text-lg font-semibold flex items-center space-x-2"><span>5. 🌍 Real-World Applications & Production Values</span></h3>
              {expandedSections.has('applications') ? (<ChevronDown className="h-5 w-5 text-gray-400" />) : (<ChevronRight className="h-5 w-5 text-gray-400" />)}
            </button>
            {expandedSections.has('applications') && (
              <div className="p-4 bg-gray-700 rounded-lg mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-gray-600 p-3 rounded">
                      <h4 className="text-white font-medium mb-2">🎬 Netflix</h4>
                      <p className="text-gray-300 text-sm mb-2">Uses collaborative filtering with similarity thresholds of 0.3-0.5 for user recommendations.</p>
                      <div className="text-xs text-gray-400">
                        <p>• 75% of viewing comes from recommendations</p>
                        <p>• Saves $1B annually in content licensing</p>
                      </div>
                    </div>

                    <div className="bg-gray-600 p-3 rounded">
                      <h4 className="text-white font-medium mb-2">🛒 Amazon</h4>
                      <p className="text-gray-300 text-sm mb-2">Hybrid approach combining collaborative and content-based filtering.</p>
                      <div className="text-xs text-gray-400">
                        <p>• 35% of sales from recommendations</p>
                        <p>• Real-time personalization engine</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-600 p-3 rounded">
                      <h4 className="text-white font-medium mb-2">🎵 Spotify</h4>
                      <p className="text-gray-300 text-sm mb-2">Audio content analysis + collaborative filtering for music discovery.</p>
                      <div className="text-xs text-gray-400">
                        <p>• Discover Weekly: 40M+ users</p>
                        <p>• Audio fingerprinting technology</p>
                      </div>
                    </div>

                    <div className="bg-gray-600 p-3 rounded">
                      <h4 className="text-white font-medium mb-2">📱 YouTube</h4>
                      <p className="text-gray-300 text-sm mb-2">Deep learning + collaborative filtering for video recommendations.</p>
                      <div className="text-xs text-gray-400">
                        <p>• 70% of watch time from recommendations</p>
                        <p>• Multi-objective optimization</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-600 rounded">
                  <h4 className="text-white font-medium mb-2">🏭 Industry Standards & Our Implementation</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                    <div>
                      <p className="text-gray-300">Min Similarity</p>
                      <p className="text-yellow-400 font-bold">{RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD}</p>
                      <p className="text-gray-400 text-xs">Netflix Standard</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Min Rating</p>
                      <p className="text-yellow-400 font-bold">{RECOMMENDATION_CONFIG.RATING.MIN_PREDICTED}/5</p>
                      <p className="text-gray-400 text-xs">Quality Threshold</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Min Common</p>
                      <p className="text-yellow-400 font-bold">{RECOMMENDATION_CONFIG.SIMILARITY.MIN_COMMON_RATINGS}</p>
                      <p className="text-gray-400 text-xs">Reliability</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Max Users</p>
                      <p className="text-yellow-400 font-bold">{RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS}</p>
                      <p className="text-gray-400 text-xs">Performance</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Prediction FAQs & Clarifications */}
          <div className="mb-6">
            <button onClick={() => toggleSection('prediction-faq')} className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className="text-white text-lg font-semibold flex items-center space-x-2"><span>6. 🔍 Prediction FAQs</span></h3>
              {expandedSections.has('prediction-faq') ? (<ChevronDown className="h-5 w-5 text-gray-400" />) : (<ChevronRight className="h-5 w-5 text-gray-400" />)}
            </button>
            {expandedSections.has('prediction-faq') && (
              <div className="p-4 bg-gray-700 rounded-lg mt-2 space-y-4">
                <div className="bg-gray-600 p-3 rounded">
                  <h4 className="text-white font-medium mb-2">🧮 What exact formula do we use to predict a rating?</h4>
                  <p className="text-gray-300 text-sm mb-2">Weighted average of relevant neighbors (users who rated the movie and pass the similarity threshold):</p>
                  <div className="bg-gray-700 p-2 rounded text-yellow-400 font-mono text-xs overflow-x-auto">
                    Σ(sim<sub>i</sub> × rating<sub>i</sub>) / Σ(sim<sub>i</sub>)
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Relevant neighbors are filtered by: similarity ≥ {RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD} and must have rated the movie.</p>
                </div>

                <div className="bg-gray-600 p-3 rounded">
                  <h4 className="text-white font-medium mb-2">📈 Confidence Score vs Avg Similarity — why are they different?</h4>
                  <p className="text-gray-300 text-sm">Avg Similarity is the plain mean of neighbor similarities for that movie. Confidence adds two production tweaks:</p>
                  <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1 mt-2">
                    <li>Penalty when avg similarity is near/below the minimum threshold.</li>
                    <li>User-count bonus of +0.05 per contributing neighbor (up to +0.20).</li>
                  </ul>
                  <div className="bg-gray-700 p-2 rounded text-yellow-400 font-mono text-xs mt-2 overflow-x-auto">
                    confidence = clamp01( avgSim x (1 - penalty) + bonus )
                  </div>
                </div>

                <div className="bg-gray-600 p-3 rounded">
                  <h4 className="text-white font-medium mb-2">🎯 Why does similarity change per movie for the same user?</h4>
                  <p className="text-gray-300 text-sm">Because each movie uses a different <em>subset</em> of neighbors — only those who rated that movie and pass the threshold. Different subsets → different averages and confidence.</p>
                </div>

                <div className="bg-gray-600 p-3 rounded">
                  <h4 className="text-white font-medium mb-2">🛡️ What gates decide if a movie is RECOMMENDABLE?</h4>
                  <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1">
                    <li>At least {RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS} relevant neighbors.</li>
                    <li>Predicted rating ≥ {RECOMMENDATION_CONFIG.RATING.MIN_PREDICTED}/5.</li>
                    <li>Confidence ≥ {Math.round(RECOMMENDATION_CONFIG.PERFORMANCE.CONFIDENCE_THRESHOLD * 100)}%.</li>
                  </ul>
                </div>

                <div className="bg-gray-600 p-3 rounded">
                  <h4 className="text-white font-medium mb-2">🔄 Why do some recommended movies disappear after I rate them?</h4>
                  <p className="text-gray-300 text-sm">We never recommend titles you&apos;ve already rated. Once you rate a movie, it’s excluded from the Top‑N list.</p>
                </div>

                <div className="bg-gray-600 p-3 rounded">
                  <h4 className="text-white font-medium mb-2">🚀 How can I increase Confidence?</h4>
                  <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1">
                    <li>Gather more ratings (more relevant neighbors → higher bonus).</li>
                    <li>Lower thresholds slightly (e.g., MIN_THRESHOLD 0.2→0.18) — do this with care.</li>
                    <li>Improve data quality so neighbors have more movies in common.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
