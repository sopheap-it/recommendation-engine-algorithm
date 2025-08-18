/**
 * Global configuration for the recommendation engine
 * This ensures consistency across all components and follows production standards
 */

export const RECOMMENDATION_CONFIG = {
  // Core similarity thresholds
  SIMILARITY: {
    MIN_THRESHOLD: 0.2,        // 20% minimum similarity for user contribution
    MIN_COMMON_RATINGS: 2,     // Minimum common ratings between users
    MIN_SIMILAR_USERS: 2,      // Minimum similar users needed for recommendations
  },

  // Rating thresholds
  RATING: {
    MIN_PREDICTED: 3.0,        // Minimum predicted rating to recommend (1-5 scale)
    SCALE: 5,                  // Rating scale (1-5)
  },

  // Performance and quality settings
  PERFORMANCE: {
    MAX_SIMILAR_USERS: 50,     // Maximum similar users to consider
    MAX_RECOMMENDATIONS: 16,   // Maximum recommendations to generate
    CONFIDENCE_THRESHOLD: 0.4, // Minimum confidence for recommendations
  },

  // UI and display settings
  UI: {
    SIMILARITY_DECIMALS: 1,    // Decimal places for similarity display
    RATING_DECIMALS: 1,        // Decimal places for rating display
    CONFIDENCE_DECIMALS: 1,    // Decimal places for confidence display
  }
} as const;

// Type-safe access to configuration values
export type RecommendationConfig = typeof RECOMMENDATION_CONFIG;

// Helper functions for common calculations
export const ConfigHelpers = {
  /**
   * Format similarity as percentage
   */
  formatSimilarity: (similarity: number): string => {
    return `${(similarity * 100).toFixed(RECOMMENDATION_CONFIG.UI.SIMILARITY_DECIMALS)}%`;
  },

  /**
   * Format rating with proper scale
   */
  formatRating: (rating: number): string => {
    return `${rating.toFixed(RECOMMENDATION_CONFIG.UI.RATING_DECIMALS)}/${RECOMMENDATION_CONFIG.RATING.SCALE}`;
  },

  /**
   * Format confidence as percentage
   */
  formatConfidence: (confidence: number): string => {
    return `${(confidence * 100).toFixed(RECOMMENDATION_CONFIG.UI.CONFIDENCE_DECIMALS)}%`;
  },

  /**
   * Check if a similarity score meets minimum threshold
   */
  isSimilarityValid: (similarity: number): boolean => {
    return similarity >= RECOMMENDATION_CONFIG.SIMILARITY.MIN_THRESHOLD;
  },

  /**
   * Check if a predicted rating meets minimum threshold
   */
  isRatingValid: (rating: number): boolean => {
    return rating >= RECOMMENDATION_CONFIG.RATING.MIN_PREDICTED;
  },

  /**
   * Check if user has enough similar users for recommendations
   */
  hasEnoughSimilarUsers: (similarUserCount: number): boolean => {
    return similarUserCount >= RECOMMENDATION_CONFIG.SIMILARITY.MIN_SIMILAR_USERS;
  }
};

// Export individual sections for specific use cases
export const { SIMILARITY, RATING, PERFORMANCE, UI } = RECOMMENDATION_CONFIG;
