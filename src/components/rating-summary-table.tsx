'use client';

import { User, Movie, Rating } from '@/lib/types/type';

interface RatingSummaryTableProps {
  users: User[];
  movies: Movie[];
  ratings: Rating[];
  currentUserId?: string;
}

export function RatingSummaryTable({ users, movies, ratings, currentUserId }: RatingSummaryTableProps) {
  // Get the first 8 movies for display (to show more data)
  const displayMovies = movies.slice(0, 8);

  // Get the first 8 users for display
  const displayUsers = users.slice(0, 8);

  const getUserRating = (userId: string, movieId: string): number | null => {
    const rating = ratings.find(r => r.userId === userId && r.movieId === movieId);
    return rating ? rating.rating : null;
  };

  const isCurrentUser = (userId: string) => userId === currentUserId;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-white font-semibold mb-4 text-lg">📊 User Ratings Summary Table</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header Row */}
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-gray-600 px-4 py-3 text-left font-medium">User</th>
              {displayMovies.map(movie => (
                <th key={movie.id} className="border border-gray-600 px-3 py-3 text-center font-medium text-sm">
                  {movie.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Data Rows */}
          <tbody>
            {displayUsers.map((user, userIndex) => (
              <tr
                key={user.id}
                className={`${userIndex % 3 === 0 ? 'bg-gray-700' :
                  userIndex % 3 === 1 ? 'bg-yellow-900/30' :
                    'bg-gray-600'
                  } ${isCurrentUser(user.id) ? 'ring-2 ring-blue-400' : ''}`}
              >
                <td className="border border-gray-600 px-4 py-3 font-medium text-white">
                  {user.name}
                  {isCurrentUser(user.id) && (
                    <span className="ml-2 text-blue-400 text-xs">(Current)</span>
                  )}
                </td>

                {displayMovies.map(movie => {
                  const rating = getUserRating(user.id, movie.id);
                  return (
                    <td key={movie.id} className="border border-gray-600 px-3 py-3 text-center">
                      {rating !== null ? (
                        <span className="text-white font-medium">{rating}</span>
                      ) : (
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">?</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-gray-300">Header</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
          <span className="text-gray-300">Row 1, 4</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-900/30 rounded"></div>
          <span className="text-gray-300">Row 2, 5</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-600 rounded"></div>
          <span className="text-gray-300">Row 3, 6</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">?</span>
          <span className="text-gray-300">Missing Rating</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-400 rounded ring-2 ring-blue-400"></div>
          <span className="text-gray-300">Current User</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <p className="text-gray-300 text-xs">Total Users</p>
          <p className="text-white font-bold">{displayUsers.length}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <p className="text-gray-300 text-xs">Total Movies</p>
          <p className="text-white font-bold">{displayMovies.length}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <p className="text-gray-300 text-xs">Total Ratings</p>
          <p className="text-white font-bold">{ratings.length}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <p className="text-gray-300 text-xs">Missing Ratings</p>
          <p className="text-white font-bold">
            {(displayUsers.length * displayMovies.length) - ratings.length}
          </p>
        </div>
      </div>
    </div>
  );
}
