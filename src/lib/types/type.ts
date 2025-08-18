export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  ratings: Rating[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Movie {
  id: string;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  genreIds: number[];
  genres: Genre[];
  averageRating: number;
  ratingCount: number;
  popularity: number;
  voteAverage: number;
  voteCount: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Rating {
  id: string;
  userId: string;
  movieId: string;
  rating: number; // 1-5 scale
  createdAt: Date;
  updatedAt: Date;
}

export interface Recommendation {
  movie: Movie;
  predictedRating: number;
  confidence: number;
  reason: string;
}

export interface SimilarUser {
  user: User;
  similarityScore: number;
  commonMovies: number;
}

export interface UserProfile {
  user: User;
  totalRatings: number;
  averageRating: number;
  favoriteGenres: string[];
  recentlyRated: Rating[];
  similarUsers: SimilarUser[];
}

export interface SystemStats {
  totalUsers: number;
  totalMovies: number;
  totalRatings: number;
  averageRating: number;
  mostPopularGenres: string[];
}
