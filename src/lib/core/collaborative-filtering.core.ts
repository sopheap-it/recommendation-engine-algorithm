import { User, Movie, Rating, Recommendation } from '@/lib/types/type';
import { RECOMMENDATION_CONFIG } from '@/lib/config/recommendation-config';

export class CollaborativeFiltering {
  private users: User[] = [];
  private movies: Movie[] = [];
  private ratings: Rating[] = [];
  private similarityMatrix: number[][] = [];
  private similarityMethod: 'pearson' | 'cosine' | 'jaccard' | 'euclidean' = 'pearson';

  constructor(similarityMethod: 'pearson' | 'cosine' | 'jaccard' | 'euclidean' = 'pearson') {
    this.similarityMethod = similarityMethod;
  }

  addUser(user: User): void {
    this.users.push(user);
    this.clearCache();
  }

  addMovie(movie: Movie): void {
    this.movies.push(movie);
    this.clearCache();
  }

  addRating(rating: Rating): void {
    this.ratings.push(rating);
    this.clearCache();
  }

  private clearCache(): void {
    this.similarityMatrix = [];
  }

  private getUserRatingVector(userId: string): number[] {
    const vector = new Array(this.movies.length).fill(0);
    const userRatings = this.ratings.filter(r => r.userId === userId);

    userRatings.forEach(rating => {
      const movieIndex = this.movies.findIndex(m => m.id === rating.movieId);
      if (movieIndex !== -1) {
        vector[movieIndex] = rating.rating;
      }
    });

    return vector;
  }

  private pearsonCorrelation(user1Vector: number[], user2Vector: number[]): number {
    // Find common rated movies
    const commonRatings: { rating1: number; rating2: number }[] = [];

    for (let i = 0; i < user1Vector.length; i++) {
      if (user1Vector[i] > 0 && user2Vector[i] > 0) {
        commonRatings.push({
          rating1: user1Vector[i],
          rating2: user2Vector[i]
        });
      }
    }

    // Require minimum common ratings for reliable similarity
    if (commonRatings.length < RECOMMENDATION_CONFIG.SIMILARITY.MIN_COMMON_RATINGS) return 0;

    const n = commonRatings.length;
    const sum1 = commonRatings.reduce((sum, r) => sum + r.rating1, 0);
    const sum2 = commonRatings.reduce((sum, r) => sum + r.rating2, 0);
    const sum1Sq = commonRatings.reduce((sum, r) => sum + r.rating1 * r.rating1, 0);
    const sum2Sq = commonRatings.reduce((sum, r) => sum + r.rating2 * r.rating2, 0);
    const pSum = commonRatings.reduce((sum, r) => sum + r.rating1 * r.rating2, 0);

    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

    if (den === 0) return 0;
    return num / den;
  }

  private cosineSimilarity(user1Vector: number[], user2Vector: number[]): number {
    const commonRatings: { rating1: number; rating2: number }[] = [];

    for (let i = 0; i < user1Vector.length; i++) {
      if (user1Vector[i] > 0 && user2Vector[i] > 0) {
        commonRatings.push({
          rating1: user1Vector[i],
          rating2: user2Vector[i]
        });
      }
    }

    if (commonRatings.length < RECOMMENDATION_CONFIG.SIMILARITY.MIN_COMMON_RATINGS) return 0;

    const dotProduct = commonRatings.reduce((sum, r) => sum + r.rating1 * r.rating2, 0);
    const norm1 = Math.sqrt(commonRatings.reduce((sum, r) => sum + r.rating1 * r.rating1, 0));
    const norm2 = Math.sqrt(commonRatings.reduce((sum, r) => sum + r.rating2 * r.rating2, 0));

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (norm1 * norm2);
  }

  private calculateSimilarity(user1Vector: number[], user2Vector: number[]): number {
    switch (this.similarityMethod) {
      case 'pearson':
        return this.pearsonCorrelation(user1Vector, user2Vector);
      case 'cosine':
        return this.cosineSimilarity(user1Vector, user2Vector);
      default:
        return this.pearsonCorrelation(user1Vector, user2Vector);
    }
  }

  private buildSimilarityMatrix(): void {
    if (this.similarityMatrix.length > 0) return;

    const n = this.users.length;
    this.similarityMatrix = Array(n).fill(null).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const user1Vector = this.getUserRatingVector(this.users[i].id);
        const user2Vector = this.getUserRatingVector(this.users[j].id);
        const similarity = this.calculateSimilarity(user1Vector, user2Vector);

        this.similarityMatrix[i][j] = similarity;
        this.similarityMatrix[j][i] = similarity;
      }
      this.similarityMatrix[i][i] = 1.0;
    }
  }

  findSimilarUsers(userId: string, k: number = RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS): { user: User; similarity: number }[] {
    this.buildSimilarityMatrix();

    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return [];

    const similarities = this.similarityMatrix[userIndex]
      .map((similarity, index) => ({ user: this.users[index], similarity }))
      .filter(item =>
        item.user.id !== userId &&
        item.similarity >= RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD && // Only include users above similarity threshold
        item.similarity > 0
      )
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k);

    return similarities;
  }

  predictRating(userId: string, movieId: string): number | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;

    // If user already rated, return that rating
    const existingRating = this.ratings.find(r => r.userId === userId && r.movieId === movieId);
    if (existingRating) return existingRating.rating;

    // Get similar users with sufficient similarity threshold
    const similarUsers = this.findSimilarUsers(userId, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS);

    let weightedSum = 0;
    let similaritySum = 0;
    let contributors = 0;

    for (const { user: similarUser, similarity } of similarUsers) {
      const rating = this.ratings.find(r => r.userId === similarUser.id && r.movieId === movieId);
      if (rating && rating.rating > 0 && similarity >= RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD) {
        weightedSum += similarity * rating.rating;
        similaritySum += similarity;
        contributors += 1;
      }
    }

    // ONLY return prediction if we have sufficient contributing neighbors with strong similarity
    if (contributors >= RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS && similaritySum > 0) {
      const predictedRating = weightedSum / similaritySum;

      // Only recommend if predicted rating meets minimum threshold
      if (predictedRating >= RECOMMENDATION_CONFIG.RATING.MIN_PREDICTED) {
        return Math.max(0, Math.min(RECOMMENDATION_CONFIG.RATING.SCALE, predictedRating));
      }
    }

    // No prediction possible - return null
    return null;
  }

  getRecommendations(userId: string, nRecommendations: number = RECOMMENDATION_CONFIG.PERFORMANCE.MAX_RECOMMENDATIONS): Recommendation[] {
    const user = this.users.find(u => u.id === userId);
    if (!user) return [];

    // Get user's rated movies to exclude them from recommendations
    const userRatedMovies = new Set(
      this.ratings
        .filter(r => r.userId === userId)
        .map(r => r.movieId)
    );

    // Get predictions for all unrated movies with strict validation
    const predictions: { movie: Movie; predictedRating: number; confidence: number; similarUsersCount: number }[] = [];

    for (const movie of this.movies) {
      // Skip movies the user has already rated
      if (userRatedMovies.has(movie.id)) {
        continue;
      }

      // Get similar users for this specific movie recommendation
      const similarUsers = this.findSimilarUsers(userId, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS);
      const relevantSimilarUsers = similarUsers.filter(({ user: similarUser, similarity }) => {
        const rating = this.ratings.find(r => r.userId === similarUser.id && r.movieId === movie.id);
        return rating && rating.rating > 0 && similarity >= RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD;
      });

      // Only proceed if we have enough similar users with sufficient similarity
      if (relevantSimilarUsers.length < RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS) {
        continue;
      }

      const predictedRating = this.predictRating(userId, movie.id);

      // Only include movies where we can make a valid prediction
      if (predictedRating !== null && predictedRating >= RECOMMENDATION_CONFIG.RATING.MIN_PREDICTED) {
        const confidence = this.calculateConfidence(userId, movie.id, relevantSimilarUsers);

        // Only include if confidence meets configured threshold
        if (confidence >= RECOMMENDATION_CONFIG.PERFORMANCE.CONFIDENCE_THRESHOLD) {
          predictions.push({
            movie,
            predictedRating,
            confidence,
            similarUsersCount: relevantSimilarUsers.length
          });
        }
      }
    }

    // Sort by confidence first, then by predicted rating (highest first)
    const sortedPredictions = predictions
      .sort((a, b) => {
        // Primary sort by confidence (highest first)
        if (Math.abs(b.confidence - a.confidence) > 0.01) {
          return b.confidence - a.confidence;
        }
        // Secondary sort by predicted rating (highest first)
        return b.predictedRating - a.predictedRating;
      })
      .slice(0, nRecommendations);

    // Convert to Recommendation format
    return sortedPredictions.map(({ movie, predictedRating, confidence, similarUsersCount }) => ({
      movie,
      predictedRating,
      confidence,
      reason: this.generateRecommendationReason(userId, movie.id, predictedRating, similarUsersCount)
    }));
  }

  private calculateConfidence(userId: string, movieId: string, relevantSimilarUsers: { user: User; similarity: number }[]): number {
    // Only calculate confidence if we have sufficient similar users
    if (relevantSimilarUsers.length < RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS) {
      return 0;
    }

    // Calculate confidence based on similarity scores and number of contributors
    const avgSimilarity = relevantSimilarUsers.reduce((sum, { similarity }) => sum + similarity, 0) / relevantSimilarUsers.length;
    const similarityPenalty = Math.max(0, (RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD - avgSimilarity) / RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD);

    // Confidence decreases if average similarity is close to threshold
    let confidence = avgSimilarity * (1 - similarityPenalty);

    // Boost confidence if we have more similar users
    const userCountBonus = Math.min(0.2, relevantSimilarUsers.length * 0.05);
    confidence = Math.min(1.0, confidence + userCountBonus);

    return Math.max(0, confidence);
  }

  private generateRecommendationReason(userId: string, movieId: string, predictedRating: number, similarUsersCount: number): string {
    const similarUsers = this.findSimilarUsers(userId, 10);
    const relevantSimilarUsers = similarUsers.filter(({ user }) => {
      const rating = this.ratings.find(r => r.userId === user.id && r.movieId === movieId);
      return rating && rating.rating > 0;
    });

    if (relevantSimilarUsers.length < RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS) {
      return "Insufficient similar users for reliable recommendation";
    }

    const topSimilarUser = relevantSimilarUsers[0];
    const similarityPercent = (topSimilarUser.similarity * 100).toFixed(RECOMMENDATION_CONFIG.UI.SIMILARITY_DECIMALS);

    return `Based on ${similarUsersCount} similar users (${topSimilarUser.user.name} is ${similarityPercent}% similar)`;
  }

  // Method to validate if a user can receive recommendations
  canUserReceiveRecommendations(userId: string): { canReceive: boolean; reason: string; similarUsersCount: number } {
    const similarUsers = this.findSimilarUsers(userId, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS);
    const validSimilarUsers = similarUsers.filter(({ similarity }) => similarity >= RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD);

    if (validSimilarUsers.length < RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS) {
      return {
        canReceive: false,
        reason: `User needs at least ${RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS} similar users (found ${validSimilarUsers.length})`,
        similarUsersCount: validSimilarUsers.length
      };
    }

    return {
      canReceive: true,
      reason: `User has ${validSimilarUsers.length} similar users with sufficient similarity`,
      similarUsersCount: validSimilarUsers.length
    };
  }

  // Method to get recommendation quality metrics
  getRecommendationQualityMetrics(userId: string, movieId: string): {
    hasSimilarUsers: boolean;
    similarUsersCount: number;
    averageSimilarity: number;
    minSimilarity: number;
    maxSimilarity: number;
    canRecommend: boolean;
  } {
    const similarUsers = this.findSimilarUsers(userId, RECOMMENDATION_CONFIG.PERFORMANCE.MAX_SIMILAR_USERS);
    const relevantSimilarUsers = similarUsers.filter(({ user, similarity }) => {
      const rating = this.ratings.find(r => r.userId === user.id && r.movieId === movieId);
      return rating && rating.rating > 0 && similarity >= RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD;
    });

    if (relevantSimilarUsers.length === 0) {
      return {
        hasSimilarUsers: false,
        similarUsersCount: 0,
        averageSimilarity: 0,
        minSimilarity: 0,
        maxSimilarity: 0,
        canRecommend: false
      };
    }

    const similarities = relevantSimilarUsers.map(({ similarity }) => similarity);
    const averageSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
    const minSimilarity = Math.min(...similarities);
    const maxSimilarity = Math.max(...similarities);
    const confidence = this.calculateConfidence(userId, movieId, relevantSimilarUsers);

    return {
      hasSimilarUsers: true,
      similarUsersCount: relevantSimilarUsers.length,
      averageSimilarity,
      minSimilarity,
      maxSimilarity,
      canRecommend:
        relevantSimilarUsers.length >= RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS &&
        confidence >= RECOMMENDATION_CONFIG.PERFORMANCE.CONFIDENCE_THRESHOLD
    };
  }

  getSystemStats() {
    const totalRatings = this.ratings.length;
    const avgRatingsPerUser = this.users.length > 0 ? totalRatings / this.users.length : 0;

    return {
      numUsers: this.users.length,
      numMovies: this.movies.length,
      totalRatings,
      avgRatingsPerUser,
      similarityMethod: this.similarityMethod,
      config: RECOMMENDATION_CONFIG
    };
  }
}
