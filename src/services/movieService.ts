import { Movie, StreamingService, Snack, MoviePreferences, RecommendationContext } from '../types';

// Mock streaming services
export const streamingServices: StreamingService[] = [
  { id: 'netflix', name: 'Netflix', isSubscribed: true, logo: 'netflix-logo.png' },
  { id: 'hulu', name: 'Hulu', isSubscribed: true, logo: 'hulu-logo.png' },
  { id: 'disney', name: 'Disney+', isSubscribed: false, logo: 'disney-logo.png' },
  { id: 'amazon', name: 'Amazon Prime', isSubscribed: true, logo: 'amazon-logo.png' },
  { id: 'hbo', name: 'HBO Max', isSubscribed: false, logo: 'hbo-logo.png' },
  { id: 'apple', name: 'Apple TV+', isSubscribed: false, logo: 'apple-logo.png' }
];

// Mock snacks data
export const snacks: Snack[] = [
  {
    id: 'popcorn-classic',
    name: 'Classic Buttered Popcorn',
    category: 'salty',
    description: 'Traditional movie theater popcorn with butter',
    allergens: ['dairy'],
    recipe: 'Pop kernels, add butter and salt'
  },
  {
    id: 'chocolate-covered-strawberries',
    name: 'Chocolate Covered Strawberries',
    category: 'sweet',
    description: 'Fresh strawberries dipped in dark chocolate',
    allergens: ['dairy'],
    recipe: 'Dip fresh strawberries in melted chocolate'
  },
  {
    id: 'spicy-nachos',
    name: 'Spicy Nachos',
    category: 'spicy',
    description: 'Tortilla chips with jalapeños and cheese',
    allergens: ['dairy', 'gluten'],
    recipe: 'Layer chips with cheese and jalapeños, bake until melted'
  },
  {
    id: 'fruit-bowl',
    name: 'Mixed Fruit Bowl',
    category: 'healthy',
    description: 'Fresh seasonal fruits',
    allergens: [],
    recipe: 'Cut and mix your favorite seasonal fruits'
  },
  {
    id: 'trail-mix',
    name: 'Homemade Trail Mix',
    category: 'healthy',
    description: 'Nuts, dried fruits, and dark chocolate chips',
    allergens: ['nuts'],
    recipe: 'Mix almonds, cashews, dried cranberries, and dark chocolate chips'
  },
  {
    id: 'cheese-crackers',
    name: 'Cheese and Crackers',
    category: 'salty',
    description: 'Assorted cheeses with artisanal crackers',
    allergens: ['dairy', 'gluten'],
    recipe: 'Arrange various cheeses with crackers on a board'
  }
];

// Mock movies data
export const movies: Movie[] = [
  {
    id: 'movie-1',
    title: 'The Princess Bride',
    genres: ['Adventure', 'Comedy', 'Romance'],
    rating: 'PG',
    duration: 98,
    description: 'A classic fairy tale adventure with romance, comedy, and unforgettable characters.',
    releaseYear: 1987,
    imdbRating: 8.0,
    streamingAvailability: [
      { service: streamingServices[0], type: 'subscription' },
      { service: streamingServices[3], type: 'rent', price: 3.99 }
    ],
    recommendedSnacks: [snacks[0], snacks[1]]
  },
  {
    id: 'movie-2',
    title: 'Inception',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    rating: 'PG-13',
    duration: 148,
    description: 'A mind-bending thriller about dreams within dreams.',
    releaseYear: 2010,
    imdbRating: 8.8,
    streamingAvailability: [
      { service: streamingServices[1], type: 'subscription' },
      { service: streamingServices[4], type: 'subscription' }
    ],
    recommendedSnacks: [snacks[0], snacks[4]]
  },
  {
    id: 'movie-3',
    title: 'The Grand Budapest Hotel',
    genres: ['Comedy', 'Drama'],
    rating: 'R',
    duration: 99,
    description: 'A whimsical tale of a legendary concierge and his protégé.',
    releaseYear: 2014,
    imdbRating: 8.1,
    streamingAvailability: [
      { service: streamingServices[2], type: 'subscription' },
      { service: streamingServices[3], type: 'rent', price: 2.99 }
    ],
    recommendedSnacks: [snacks[1], snacks[5]]
  },
  {
    id: 'movie-4',
    title: 'Spirited Away',
    genres: ['Animation', 'Adventure', 'Family'],
    rating: 'PG',
    duration: 125,
    description: 'A young girl enters a world ruled by gods and witches.',
    releaseYear: 2001,
    imdbRating: 9.3,
    streamingAvailability: [
      { service: streamingServices[4], type: 'subscription' }
    ],
    recommendedSnacks: [snacks[3], snacks[4]]
  },
  {
    id: 'movie-5',
    title: 'Mad Max: Fury Road',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 'R',
    duration: 120,
    description: 'A post-apocalyptic action film with stunning visuals.',
    releaseYear: 2015,
    imdbRating: 8.1,
    streamingAvailability: [
      { service: streamingServices[0], type: 'subscription' },
      { service: streamingServices[1], type: 'rent', price: 4.99 }
    ],
    recommendedSnacks: [snacks[2], snacks[0]]
  },
  {
    id: 'movie-6',
    title: 'Her',
    genres: ['Drama', 'Romance', 'Sci-Fi'],
    rating: 'R',
    duration: 126,
    description: 'A man develops a relationship with an AI operating system.',
    releaseYear: 2013,
    imdbRating: 8.0,
    streamingAvailability: [
      { service: streamingServices[3], type: 'subscription' },
      { service: streamingServices[5], type: 'subscription' }
    ],
    recommendedSnacks: [snacks[1], snacks[3]]
  },
  {
    id: 'movie-7',
    title: 'The Menu',
    genres: ['Comedy', 'Horror', 'Thriller'],
    rating: 'R',
    duration: 107,
    description: 'A couple travels to a remote island to eat at an exclusive restaurant.',
    releaseYear: 2022,
    imdbRating: 7.2,
    streamingAvailability: [
      { service: streamingServices[4], type: 'subscription' },
      { service: streamingServices[2], type: 'rent', price: 5.99 }
    ],
    recommendedSnacks: [snacks[5], snacks[2]]
  },
  {
    id: 'movie-8',
    title: 'Everything Everywhere All at Once',
    genres: ['Action', 'Comedy', 'Drama'],
    rating: 'R',
    duration: 139,
    description: 'A multiverse adventure about family, love, and everything in between.',
    releaseYear: 2022,
    imdbRating: 7.8,
    streamingAvailability: [
      { service: streamingServices[0], type: 'subscription' },
      { service: streamingServices[3], type: 'rent', price: 6.99 }
    ],
    recommendedSnacks: [snacks[4], snacks[0]]
  }
];

// Recommendation engine
export const getMovieRecommendations = (
  userPreferences: MoviePreferences,
  partnerPreferences: MoviePreferences,
  context?: RecommendationContext
): Movie[] => {
  const scoredMovies = movies.map(movie => {
    let score = 0;

    // Genre matching (40% of score)
    const userGenreMatches = movie.genres.filter(genre =>
      userPreferences.favoriteGenres.includes(genre)
    ).length;
    const partnerGenreMatches = movie.genres.filter(genre =>
      partnerPreferences.favoriteGenres.includes(genre)
    ).length;
    const genreScore = (userGenreMatches + partnerGenreMatches) / movie.genres.length;
    score += genreScore * 40;

    // Rating preference (20% of score)
    const ratingScore = (userPreferences.preferredRating === 'any' ||
      userPreferences.preferredRating === movie.rating) &&
      (partnerPreferences.preferredRating === 'any' ||
        partnerPreferences.preferredRating === movie.rating) ? 20 : 0;
    score += ratingScore;

    // Duration preference (20% of score)
    const getDurationCategory = (duration: number) => {
      if (duration < 90) return 'short';
      if (duration <= 150) return 'medium';
      return 'long';
    };

    const movieDuration = getDurationCategory(movie.duration);
    const durationScore = (userPreferences.preferredDuration === 'any' ||
      userPreferences.preferredDuration === movieDuration) &&
      (partnerPreferences.preferredDuration === 'any' ||
        partnerPreferences.preferredDuration === movieDuration) ? 20 : 0;
    score += durationScore;

    // Streaming availability (20% of score)
    const userSubscribedServices = userPreferences.streamingServices.filter(s => s.isSubscribed);
    const partnerSubscribedServices = partnerPreferences.streamingServices.filter(s => s.isSubscribed);
    const commonServices = userSubscribedServices.filter(userService =>
      partnerSubscribedServices.some(partnerService => partnerService.id === userService.id)
    );

    const hasCommonStreamingAccess = movie.streamingAvailability.some(availability =>
      commonServices.some(service => service.id === availability.service.id &&
        availability.type === 'subscription')
    );

    if (hasCommonStreamingAccess) {
      score += 20;
    }

    // Mood-based adjustments
    if (context?.userMood && context?.partnerMood) {
      const moodGenreMap: { [key: string]: string[] } = {
        'romantic': ['Romance', 'Drama'],
        'adventurous': ['Adventure', 'Action'],
        'happy': ['Comedy', 'Animation'],
        'relaxed': ['Drama', 'Romance'],
        'energetic': ['Action', 'Thriller'],
        'cozy': ['Romance', 'Comedy']
      };

      const userMoodGenres = moodGenreMap[context.userMood.mood] || [];
      const partnerMoodGenres = moodGenreMap[context.partnerMood.mood] || [];

      const moodMatches = movie.genres.filter(genre =>
        userMoodGenres.includes(genre) || partnerMoodGenres.includes(genre)
      ).length;

      score += moodMatches * 5;
    }

    return { ...movie, matchScore: Math.min(100, Math.max(0, score)) };
  });

  return scoredMovies
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 10);
};

export const getMovieById = (id: string): Movie | undefined => {
  return movies.find(movie => movie.id === id);
};

export const searchMovies = (query: string): Movie[] => {
  const lowercaseQuery = query.toLowerCase();
  return movies.filter(movie =>
    movie.title.toLowerCase().includes(lowercaseQuery) ||
    movie.genres.some(genre => genre.toLowerCase().includes(lowercaseQuery)) ||
    movie.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const getSnackRecommendations = (
  movieGenres: string[],
  userSnackPreferences: any,
  partnerSnackPreferences: any
): Snack[] => {
  // Genre-based snack recommendations
  const genreSnackMap: { [key: string]: string[] } = {
    'Action': ['spicy-nachos', 'popcorn-classic'],
    'Comedy': ['popcorn-classic', 'cheese-crackers'],
    'Romance': ['chocolate-covered-strawberries', 'fruit-bowl'],
    'Horror': ['spicy-nachos', 'trail-mix'],
    'Drama': ['cheese-crackers', 'fruit-bowl'],
    'Animation': ['fruit-bowl', 'trail-mix']
  };

  const recommendedSnackIds = new Set<string>();

  movieGenres.forEach(genre => {
    const genreSnacks = genreSnackMap[genre] || [];
    genreSnacks.forEach(snackId => recommendedSnackIds.add(snackId));
  });

  // Filter based on preferences and allergies
  const filteredSnacks = snacks.filter(snack => {
    if (recommendedSnackIds.size === 0 || recommendedSnackIds.has(snack.id)) {
      // Check allergies
      const userAllergies = userSnackPreferences?.allergies || [];
      const partnerAllergies = partnerSnackPreferences?.allergies || [];
      const allAllergies = [...userAllergies, ...partnerAllergies];

      const hasAllergen = snack.allergens.some(allergen =>
        allAllergies.includes(allergen)
      );

      return !hasAllergen;
    }
    return false;
  });

  return filteredSnacks.slice(0, 4);
}; 