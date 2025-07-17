// Core types
export interface User {
  id: string;
  name: string;
  email: string;
  partnerId?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  movies: MoviePreferences;
  dining: DiningPreferences;
  activities: ActivityPreferences;
  general: GeneralPreferences;
}

// Movie Module Types
export interface MoviePreferences {
  favoriteGenres: string[];
  dislikedGenres: string[];
  preferredRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'any';
  preferredDuration: 'short' | 'medium' | 'long' | 'any'; // <90min, 90-150min, >150min
  streamingServices: StreamingService[];
  snackPreferences: SnackPreferences;
}

export interface StreamingService {
  id: string;
  name: string;
  isSubscribed: boolean;
  logo?: string;
}

export interface SnackPreferences {
  sweet: boolean;
  salty: boolean;
  spicy: boolean;
  healthy: boolean;
  allergies: string[];
}

export interface Movie {
  id: string;
  title: string;
  genres: string[];
  rating: string;
  duration: number; // in minutes
  description: string;
  poster?: string;
  trailer?: string;
  releaseYear: number;
  imdbRating?: number;
  streamingAvailability: StreamingAvailability[];
  recommendedSnacks: Snack[];
  matchScore?: number; // 0-100 based on both partners' preferences
}

export interface StreamingAvailability {
  service: StreamingService;
  type: 'free' | 'subscription' | 'rent' | 'buy';
  price?: number;
  url?: string;
}

export interface Snack {
  id: string;
  name: string;
  category: 'sweet' | 'salty' | 'spicy' | 'healthy';
  description?: string;
  allergens: string[];
  image?: string;
  recipe?: string;
}

// Dining Module Types
export interface DiningPreferences {
  cuisineTypes: string[];
  dislikedCuisines: string[];
  priceRange: 'budget' | 'moderate' | 'upscale' | 'fine-dining';
  atmospherePreference: 'casual' | 'romantic' | 'lively' | 'quiet';
  dietaryRestrictions: DietaryRestriction[];
  allergies: string[];
  maxDistance: number; // in miles
}

export interface DietaryRestriction {
  type: 'vegetarian' | 'vegan' | 'gluten-free' | 'keto' | 'halal' | 'kosher' | 'other';
  strict: boolean;
  notes?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  priceRange: 'budget' | 'moderate' | 'upscale' | 'fine-dining';
  atmosphere: string[];
  rating: number;
  reviewCount: number;
  location: Location;
  distance?: number;
  photos: string[];
  menu: MenuItem[];
  availableReservations: ReservationSlot[];
  dietaryAccommodations: string[];
  matchScore?: number;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
  allergens: string[];
  image?: string;
  matchesPreferences?: boolean;
}

export interface ReservationSlot {
  id: string;
  date: Date;
  time: string;
  partySize: number;
  available: boolean;
  price?: number; // for premium slots
}

// Activity Module Types
export interface ActivityPreferences {
  outdoorActivities: string[];
  indoorActivities: string[];
  energyLevel: 'low' | 'medium' | 'high' | 'any';
  weatherPreference: 'any' | 'sunny' | 'cloudy' | 'indoor-only';
  physicalActivity: 'none' | 'light' | 'moderate' | 'intense';
  socialLevel: 'intimate' | 'small-group' | 'large-group' | 'any';
  budget: 'free' | 'low' | 'medium' | 'high';
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: 'outdoor' | 'indoor' | 'cultural' | 'adventure' | 'learning' | 'entertainment';
  energyLevel: 'low' | 'medium' | 'high';
  duration: number; // in minutes
  cost: number;
  location?: Location;
  weatherDependent: boolean;
  physicalActivity: 'none' | 'light' | 'moderate' | 'intense';
  socialLevel: 'intimate' | 'small-group' | 'large-group';
  equipment?: string[];
  seasonality?: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
  matchScore?: number;
}

// Stay at Home Module Types
export interface HomeActivity {
  id: string;
  name: string;
  description: string;
  category: 'cooking' | 'games' | 'diy' | 'movies' | 'learning' | 'relaxation';
  duration: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  materials: string[];
  instructions?: string[];
  estimatedCost: number;
  image?: string;
  matchScore?: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  dietaryTags: string[];
  allergens: string[];
  image?: string;
  nutritionInfo?: NutritionInfo;
  matchScore?: number;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  optional?: boolean;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface Game {
  id: string;
  name: string;
  type: 'board' | 'card' | 'video' | 'party' | 'trivia';
  players: string; // e.g., "2-4", "2+", "2"
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  equipment: string[];
  platform?: string; // for video games
  ageRating?: string;
  image?: string;
  matchScore?: number;
}

// Relationship Features Types
export interface Mood {
  id: string;
  userId: string;
  mood: 'happy' | 'romantic' | 'adventurous' | 'relaxed' | 'energetic' | 'cozy' | 'spontaneous';
  energy: 'low' | 'medium' | 'high';
  timestamp: Date;
  notes?: string;
}

export interface Surprise {
  id: string;
  title: string;
  description: string;
  category: 'activity' | 'gift' | 'experience' | 'gesture';
  effort: 'low' | 'medium' | 'high';
  cost: 'free' | 'low' | 'medium' | 'high';
  personalizedFor: string; // partner's user ID
  basedOnPreferences: string[];
  instructions?: string[];
  executed: boolean;
  executedDate?: Date;
}

export interface DateReview {
  id: string;
  dateId: string;
  userId: string;
  rating: number; // 1-5
  enjoyment: number; // 1-5
  wouldRepeat: boolean;
  highlights: string[];
  improvements: string[];
  photos: string[];
  notes?: string;
  timestamp: Date;
}

export interface Memory {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'photo' | 'video' | 'note' | 'milestone';
  content: string; // URL for media, text for notes
  tags: string[];
  associatedDateId?: string;
  createdBy: string;
  isShared: boolean;
  timestamp: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'anniversary' | 'first-date' | 'birthday' | 'custom';
  isRecurring: boolean;
  reminderDays: number[]; // days before to remind
  celebrated: boolean;
  memories: Memory[];
}

// Long Distance Features Types
export interface VirtualDate {
  id: string;
  title: string;
  description: string;
  type: 'movie-sync' | 'game-night' | 'cooking-together' | 'virtual-tour' | 'video-call';
  duration: number;
  instructions: string[];
  requiredApps: string[];
  timezoneFlexible: boolean;
  matchScore?: number;
}

export interface SharedWishlist {
  id: string;
  title: string;
  description?: string;
  category: 'activity' | 'restaurant' | 'movie' | 'travel' | 'gift';
  priority: 'low' | 'medium' | 'high';
  estimatedCost?: number;
  location?: Location;
  addedBy: string;
  completed: boolean;
  completedDate?: Date;
  notes?: string;
}

export interface SynchronizedPlan {
  id: string;
  title: string;
  description: string;
  scheduledDate: Date;
  scheduledTime: string;
  timezone1: string;
  timezone2: string;
  convertedTime1: string;
  convertedTime2: string;
  type: 'virtual' | 'in-person' | 'simultaneous';
  participants: string[];
  reminders: Reminder[];
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Reminder {
  id: string;
  message: string;
  timeOffset: number; // minutes before event
  sent: boolean;
  sentAt?: Date;
}

// General Types
export interface GeneralPreferences {
  timeZone: string;
  language: string;
  currency: string;
  units: 'metric' | 'imperial';
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

export interface NotificationPreferences {
  dateReminders: boolean;
  partnerActivity: boolean;
  newRecommendations: boolean;
  milestones: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface PrivacySettings {
  shareLocation: boolean;
  shareActivity: boolean;
  sharePhotos: boolean;
  allowSuggestions: boolean;
  dataCollection: boolean;
}

export interface DateEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  location?: string;
  type: 'planned' | 'suggested' | 'completed';
  plannedBy: string;
  partnerId?: string;
  category?: string;
  relatedContent?: {
    movieId?: string;
    restaurantId?: string;
    activityId?: string;
    recipeId?: string;
  };
  reminders: Reminder[];
  reviews: DateReview[];
  memories: Memory[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and Filter Types
export interface SearchFilters {
  category?: string;
  priceRange?: string;
  duration?: string;
  location?: string;
  rating?: number;
  availability?: string;
  mood?: string;
  energy?: string;
}

export interface RecommendationContext {
  userMood?: Mood;
  partnerMood?: Mood;
  weather?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  budget?: number;
  availableTime?: number;
  location?: Location;
  previousActivities?: string[];
  specialOccasion?: string;
} 