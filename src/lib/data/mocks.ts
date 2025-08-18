import { Movie, User, Rating, Genre } from '@/lib/types/type';

// Sample genres
export const genres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

// Sample movies (popular movies with real data)
export const sampleMovies: Movie[] = [
  {
    id: '1',
    title: 'The Shawshank Redemption',
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    posterPath: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdropPath: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    releaseDate: '1994-09-23',
    genreIds: [18, 80],
    genres: [genres[6], genres[4]], // Drama, Crime
    averageRating: 0, // Will be calculated from ratings
    ratingCount: 0, // Will be calculated from ratings
    popularity: 100,
    voteAverage: 9.3, // TMDB rating (out of 10)
    voteCount: 2500000
  },
  {
    id: '2',
    title: 'The Godfather',
    overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    posterPath: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdropPath: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    releaseDate: '1972-03-24',
    genreIds: [18, 80],
    genres: [genres[6], genres[4]], // Drama, Crime
    averageRating: 0, // Will be calculated from ratings
    ratingCount: 0, // Will be calculated from ratings
    popularity: 95,
    voteAverage: 9.2, // TMDB rating (out of 10)
    voteCount: 1800000
  },
  {
    id: '3',
    title: 'The Dark Knight',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropPath: '/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    releaseDate: '2008-07-18',
    genreIds: [28, 18, 80],
    genres: [genres[0], genres[6], genres[4]], // Action, Drama, Crime
    averageRating: 0, // Will be calculated from ratings
    ratingCount: 0, // Will be calculated from ratings
    popularity: 98,
    voteAverage: 9.0, // TMDB rating (out of 10)
    voteCount: 2200000
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    posterPath: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdropPath: '/suaEOtk1N1sgg2QM528GluxMcE.jpg',
    releaseDate: '1994-10-14',
    genreIds: [80, 53],
    genres: [genres[4], genres[16]], // Crime, Thriller
    averageRating: 0, // Will be calculated from ratings
    ratingCount: 0, // Will be calculated from ratings
    popularity: 92,
    voteAverage: 8.9, // TMDB rating (out of 10)
    voteCount: 1900000
  },
  {
    id: '5',
    title: 'Fight Club',
    overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
    posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdropPath: '/52AfXWuXCHn3UjD17rBruA9f5qb.jpg',
    releaseDate: '1999-10-15',
    genreIds: [18],
    genres: [genres[6]], // Drama
    averageRating: 0, // Will be calculated from ratings
    ratingCount: 0, // Will be calculated from ratings
    popularity: 88,
    voteAverage: 8.8, // TMDB rating (out of 10)
    voteCount: 2100000
  },
  {
    id: '6',
    title: 'Inception',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdropPath: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    releaseDate: '2010-07-16',
    genreIds: [28, 878, 53],
    genres: [genres[0], genres[14], genres[16]], // Action, Sci-Fi, Thriller
    averageRating: 0, // Will be calculated from ratings
    ratingCount: 0, // Will be calculated from ratings
    popularity: 90,
    voteAverage: 8.8, // TMDB rating (out of 10)
    voteCount: 2000000
  },
  {
    id: '7',
    title: 'The Matrix',
    overview: 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.',
    posterPath: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdropPath: '/ncF4HivY2W6SQW5dEP3N3b4XqQh.jpg',
    releaseDate: '1999-03-31',
    genreIds: [28, 878],
    genres: [genres[0], genres[14]], // Action, Sci-Fi
    averageRating: 0, // Will be calculated from ratings
    ratingCount: 0, // Will be calculated from ratings
    popularity: 85,
    voteAverage: 8.7, // TMDB rating (out of 10)
    voteCount: 1800000
  },
  {
    id: '8',
    title: 'Goodfellas',
    overview: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.',
    posterPath: '/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    backdropPath: '/sw7mordbZxgITU877yTp65udqZ4.jpg',
    releaseDate: '1990-09-19',
    genreIds: [18, 80],
    genres: [genres[6], genres[4]], // Drama, Crime
    averageRating: 0, // Will be calculated from ratings
    ratingCount: 0, // Will be calculated from ratings
    popularity: 82,
    voteAverage: 8.7, // TMDB rating (out of 10)
    voteCount: 1100000
  },
  {
    id: '9',
    title: 'The Silence of the Lambs',
    overview: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
    posterPath: '/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg',
    backdropPath: '/mfwq2nMBzArGQLLoKdXgxfzyR8G.jpg',
    releaseDate: '1991-02-14',
    genreIds: [80, 53, 27],
    genres: [genres[4], genres[16], genres[10]], // Crime, Thriller, Horror
    averageRating: 0, // Will be calculated from ratings
    ratingCount: 0, // Will be calculated from ratings
    popularity: 78,
    voteAverage: 8.6, // TMDB rating (out of 10)
    voteCount: 1400000
  },
  {
    id: '10',
    title: 'Interstellar',
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    posterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropPath: '/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg',
    releaseDate: '2014-11-07',
    genreIds: [12, 18, 878],
    genres: [genres[1], genres[6], genres[14]], // Adventure, Drama, Sci-Fi
    averageRating: 0, // Will be calculated from ratings
    ratingCount: 0, // Will be calculated from ratings
    popularity: 75,
    voteAverage: 8.6, // TMDB rating (out of 10)
    voteCount: 1600000
  },
  {
    id: '11',
    title: 'Avengers: Endgame',
    overview: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.',
    posterPath: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdropPath: '/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
    releaseDate: '2019-04-26',
    genreIds: [28, 12, 878],
    genres: [genres[0], genres[1], genres[14]], // Action, Adventure, Sci-Fi
    averageRating: 0,
    ratingCount: 0,
    popularity: 99,
    voteAverage: 8.4,
    voteCount: 2200000
  },
  {
    id: '12',
    title: 'Parasite',
    overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    posterPath: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdropPath: '/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg',
    releaseDate: '2019-05-30',
    genreIds: [18, 53],
    genres: [genres[6], genres[16]], // Drama, Thriller
    averageRating: 0,
    ratingCount: 0,
    popularity: 85,
    voteAverage: 8.6,
    voteCount: 700000
  },
  {
    id: '13',
    title: 'Spirited Away',
    overview: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    posterPath: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdropPath: '/mnpRKVSXBX6jb56nabvmGKA0Wig.jpg',
    releaseDate: '2001-07-20',
    genreIds: [16, 14],
    genres: [genres[2], genres[8]], // Animation, Fantasy
    averageRating: 0,
    ratingCount: 0,
    popularity: 80,
    voteAverage: 8.6,
    voteCount: 800000
  },
  {
    id: '14',
    title: 'The Lord of the Rings: The Return of the King',
    overview: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
    posterPath: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    backdropPath: '/8BPZO0Bf8TeAy8znF43z8soK3ys.jpg',
    releaseDate: '2003-12-17',
    genreIds: [12, 14],
    genres: [genres[1], genres[8]], // Adventure, Fantasy
    averageRating: 0,
    ratingCount: 0,
    popularity: 96,
    voteAverage: 8.9,
    voteCount: 1900000
  },
  {
    id: '15',
    title: 'Forrest Gump',
    overview: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events.',
    posterPath: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    backdropPath: '/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg',
    releaseDate: '1994-07-06',
    genreIds: [18, 10749],
    genres: [genres[6], genres[13]], // Drama, Romance
    averageRating: 0,
    ratingCount: 0,
    popularity: 87,
    voteAverage: 8.8,
    voteCount: 2200000
  },
  {
    id: '16',
    title: 'The Social Network',
    overview: 'The story of the founding of Facebook and the resulting lawsuits.',
    posterPath: '/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg',
    backdropPath: '/8wBKXZNod4frLZjAKSDuAcQ2dEU.jpg',
    releaseDate: '2010-10-01',
    genreIds: [18],
    genres: [genres[6]], // Drama
    averageRating: 0,
    ratingCount: 0,
    popularity: 70,
    voteAverage: 7.7,
    voteCount: 700000
  }
];

// Sample users (based on your assignment data)
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Sokna',
    email: 'sokna@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Segech',
    email: 'segech@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Bong Sak',
    email: 'bongsak@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Manith',
    email: 'manith@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: 'Sokmean',
    email: 'sokmean@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    name: 'Rika',
    email: 'rika@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '7',
    name: 'Sopheap',
    email: 'sopheap@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '8',
    name: 'Kunthea',
    email: 'kunthea@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '9',
    name: 'Thearith',
    email: 'thearith@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '10',
    name: 'Linna',
    email: 'linna@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '11',
    name: 'Kimheng',
    email: 'kimheng@example.com',
    ratings: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Sample ratings (expanded with more realistic data)
export const sampleRatings: Rating[] = [
  // Sokna's ratings
  { id: '1', userId: '1', movieId: '1', rating: 1.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', userId: '1', movieId: '2', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', userId: '1', movieId: '3', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', userId: '1', movieId: '5', rating: 1.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', userId: '1', movieId: '6', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },

  // Segech's ratings
  { id: '6', userId: '2', movieId: '1', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '7', userId: '2', movieId: '2', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '8', userId: '2', movieId: '4', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '9', userId: '2', movieId: '5', rating: 1.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '10', userId: '2', movieId: '6', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },

  // Bong Sak's ratings
  { id: '11', userId: '3', movieId: '1', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '12', userId: '3', movieId: '3', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '13', userId: '3', movieId: '4', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '14', userId: '3', movieId: '5', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '15', userId: '3', movieId: '6', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },

  // Manith's ratings
  { id: '16', userId: '4', movieId: '1', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '17', userId: '4', movieId: '2', rating: 1.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '18', userId: '4', movieId: '3', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '19', userId: '4', movieId: '4', rating: 1.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '20', userId: '4', movieId: '6', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },

  // Sokmean's ratings
  { id: '21', userId: '5', movieId: '1', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '22', userId: '5', movieId: '2', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '23', userId: '5', movieId: '4', rating: 1.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '24', userId: '5', movieId: '5', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '25', userId: '5', movieId: '6', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },

  // Rika's ratings
  { id: '26', userId: '6', movieId: '1', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '27', userId: '6', movieId: '2', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '28', userId: '6', movieId: '3', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '29', userId: '6', movieId: '5', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '30', userId: '6', movieId: '6', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },

  // Sopheap's ratings
  { id: '31', userId: '7', movieId: '1', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '32', userId: '7', movieId: '2', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '33', userId: '7', movieId: '3', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '34', userId: '7', movieId: '4', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '35', userId: '7', movieId: '5', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '36', userId: '7', movieId: '6', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },

  // Kunthea's ratings
  { id: '37', userId: '8', movieId: '1', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '38', userId: '8', movieId: '2', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '39', userId: '8', movieId: '3', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '40', userId: '8', movieId: '4', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '41', userId: '8', movieId: '5', rating: 1.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '42', userId: '8', movieId: '6', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },

  // Thearith's ratings
  { id: '43', userId: '9', movieId: '1', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '44', userId: '9', movieId: '2', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '45', userId: '9', movieId: '3', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '46', userId: '9', movieId: '4', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '47', userId: '9', movieId: '5', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '48', userId: '9', movieId: '6', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },

  // Linna's ratings
  { id: '49', userId: '10', movieId: '1', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '50', userId: '10', movieId: '2', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '51', userId: '10', movieId: '3', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '52', userId: '10', movieId: '4', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '53', userId: '10', movieId: '5', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '54', userId: '10', movieId: '6', rating: 1.0, createdAt: new Date(), updatedAt: new Date() },

  // Kimheng's ratings
  { id: '55', userId: '11', movieId: '1', rating: 1.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '56', userId: '11', movieId: '2', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '57', userId: '11', movieId: '3', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '58', userId: '11', movieId: '4', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '59', userId: '11', movieId: '5', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '60', userId: '11', movieId: '6', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },

  // Additional ratings for movies 7-10 (to enable recommendations)
  { id: '61', userId: '1', movieId: '7', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '62', userId: '2', movieId: '7', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '63', userId: '3', movieId: '7', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '64', userId: '4', movieId: '7', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '65', userId: '6', movieId: '7', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },

  { id: '66', userId: '1', movieId: '8', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '67', userId: '2', movieId: '8', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '68', userId: '3', movieId: '8', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '69', userId: '4', movieId: '8', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '70', userId: '6', movieId: '8', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },

  { id: '71', userId: '1', movieId: '9', rating: 2.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '72', userId: '2', movieId: '9', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '73', userId: '3', movieId: '9', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '74', userId: '4', movieId: '9', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '75', userId: '6', movieId: '9', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },

  { id: '76', userId: '1', movieId: '10', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '77', userId: '2', movieId: '10', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '78', userId: '3', movieId: '10', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '79', userId: '4', movieId: '10', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '80', userId: '6', movieId: '10', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },

  // Additional ratings for new movies (11-16)
  { id: '81', userId: '1', movieId: '11', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '82', userId: '2', movieId: '11', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '83', userId: '3', movieId: '11', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '84', userId: '4', movieId: '11', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '85', userId: '5', movieId: '11', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '86', userId: '6', movieId: '11', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },

  { id: '87', userId: '7', movieId: '12', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '88', userId: '8', movieId: '12', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '89', userId: '9', movieId: '12', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '90', userId: '10', movieId: '12', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '91', userId: '11', movieId: '12', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },

  { id: '92', userId: '1', movieId: '13', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '93', userId: '2', movieId: '13', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '94', userId: '3', movieId: '13', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '95', userId: '4', movieId: '13', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '96', userId: '5', movieId: '13', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },

  { id: '97', userId: '6', movieId: '14', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '98', userId: '7', movieId: '14', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '99', userId: '8', movieId: '14', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '100', userId: '9', movieId: '14', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '101', userId: '10', movieId: '14', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },

  { id: '102', userId: '1', movieId: '15', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '103', userId: '2', movieId: '15', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '104', userId: '3', movieId: '15', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '105', userId: '4', movieId: '15', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '106', userId: '5', movieId: '15', rating: 5.0, createdAt: new Date(), updatedAt: new Date() },

  { id: '107', userId: '6', movieId: '16', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '108', userId: '7', movieId: '16', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '109', userId: '8', movieId: '16', rating: 3.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '110', userId: '9', movieId: '16', rating: 4.0, createdAt: new Date(), updatedAt: new Date() },
  { id: '111', userId: '10', movieId: '16', rating: 4.0, createdAt: new Date(), updatedAt: new Date() }
];

// Calculate average ratings for movies based on user ratings
export function calculateMovieAverageRatings(movies: Movie[], ratings: Rating[]): Movie[] {
  return movies.map(movie => {
    const movieRatings = ratings.filter(r => r.movieId === movie.id);
    const averageRating = movieRatings.length > 0
      ? movieRatings.reduce((sum, r) => sum + r.rating, 0) / movieRatings.length
      : 0;

    const res = {
      ...movie,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingCount: movieRatings.length
    };

    return res;
  });
}

// Get movies with calculated average ratings
export const moviesWithRatings = calculateMovieAverageRatings(sampleMovies, sampleRatings);

// Initialize the recommendation system with sample data
export async function initializeRecommendationSystem() {
  const { CollaborativeFiltering } = await import('@/lib/core/collaborative-filtering.core');
  const cf = new CollaborativeFiltering();

  // Add users
  sampleUsers.forEach(user => cf.addUser(user));

  // Add movies with calculated ratings
  moviesWithRatings.forEach(movie => cf.addMovie(movie));

  // Add ratings
  sampleRatings.forEach(rating => cf.addRating(rating));

  return cf;
}
