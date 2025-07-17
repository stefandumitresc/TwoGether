import { Restaurant, MenuItem, ReservationSlot, DiningPreferences, Location, RecommendationContext } from '../types';

// Mock restaurant data
export const restaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Bella Vista Italian',
    cuisineType: 'Italian',
    priceRange: 'moderate',
    atmosphere: ['romantic', 'quiet'],
    rating: 4.5,
    reviewCount: 234,
    location: {
      address: '123 Main St',
      city: 'Downtown',
      state: 'CA',
      zipCode: '90210',
      latitude: 34.0522,
      longitude: -118.2437
    },
    photos: ['bella-vista-1.jpg', 'bella-vista-2.jpg'],
    menu: [
      {
        id: 'menu-1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, basil',
        price: 18,
        category: 'Pizza',
        dietaryTags: ['vegetarian'],
        allergens: ['gluten', 'dairy']
      },
      {
        id: 'menu-2',
        name: 'Chicken Parmigiana',
        description: 'Breaded chicken breast with marinara and mozzarella',
        price: 24,
        category: 'Main Course',
        dietaryTags: [],
        allergens: ['gluten', 'dairy']
      },
      {
        id: 'menu-3',
        name: 'Caesar Salad',
        description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
        price: 14,
        category: 'Salad',
        dietaryTags: ['vegetarian'],
        allergens: ['dairy', 'gluten']
      }
    ],
    availableReservations: [
      {
        id: 'res-1',
        date: new Date('2024-01-15'),
        time: '7:00 PM',
        partySize: 2,
        available: true
      },
      {
        id: 'res-2',
        date: new Date('2024-01-15'),
        time: '8:00 PM',
        partySize: 2,
        available: true
      }
    ],
    dietaryAccommodations: ['vegetarian', 'gluten-free options']
  },
  {
    id: 'rest-2',
    name: 'Sakura Sushi',
    cuisineType: 'Japanese',
    priceRange: 'upscale',
    atmosphere: ['quiet', 'romantic'],
    rating: 4.7,
    reviewCount: 189,
    location: {
      address: '456 Oak Ave',
      city: 'Midtown',
      state: 'CA',
      zipCode: '90211',
      latitude: 34.0622,
      longitude: -118.2537
    },
    photos: ['sakura-1.jpg', 'sakura-2.jpg'],
    menu: [
      {
        id: 'menu-4',
        name: 'Omakase Tasting Menu',
        description: "Chef's choice of 8 pieces of sushi",
        price: 85,
        category: 'Tasting Menu',
        dietaryTags: [],
        allergens: ['fish', 'shellfish']
      },
      {
        id: 'menu-5',
        name: 'Vegetable Tempura',
        description: 'Assorted vegetables in light tempura batter',
        price: 16,
        category: 'Appetizer',
        dietaryTags: ['vegetarian'],
        allergens: ['gluten']
      }
    ],
    availableReservations: [
      {
        id: 'res-3',
        date: new Date('2024-01-16'),
        time: '6:30 PM',
        partySize: 2,
        available: true
      }
    ],
    dietaryAccommodations: ['vegetarian options']
  },
  {
    id: 'rest-3',
    name: 'The Green Garden',
    cuisineType: 'Vegetarian',
    priceRange: 'moderate',
    atmosphere: ['casual', 'lively'],
    rating: 4.3,
    reviewCount: 156,
    location: {
      address: '789 Pine St',
      city: 'Eastside',
      state: 'CA',
      zipCode: '90212',
      latitude: 34.0722,
      longitude: -118.2637
    },
    photos: ['green-garden-1.jpg'],
    menu: [
      {
        id: 'menu-6',
        name: 'Quinoa Buddha Bowl',
        description: 'Quinoa, roasted vegetables, tahini dressing',
        price: 16,
        category: 'Bowl',
        dietaryTags: ['vegan', 'gluten-free'],
        allergens: ['sesame']
      },
      {
        id: 'menu-7',
        name: 'Impossible Burger',
        description: 'Plant-based patty with vegan cheese and fries',
        price: 18,
        category: 'Burger',
        dietaryTags: ['vegan'],
        allergens: ['gluten']
      }
    ],
    availableReservations: [
      {
        id: 'res-4',
        date: new Date('2024-01-15'),
        time: '7:30 PM',
        partySize: 2,
        available: true
      }
    ],
    dietaryAccommodations: ['vegetarian', 'vegan', 'gluten-free']
  },
  {
    id: 'rest-4',
    name: 'Spice Route',
    cuisineType: 'Indian',
    priceRange: 'budget',
    atmosphere: ['casual', 'lively'],
    rating: 4.2,
    reviewCount: 298,
    location: {
      address: '321 Curry Lane',
      city: 'Westside',
      state: 'CA',
      zipCode: '90213',
      latitude: 34.0422,
      longitude: -118.2837
    },
    photos: ['spice-route-1.jpg', 'spice-route-2.jpg'],
    menu: [
      {
        id: 'menu-8',
        name: 'Chicken Tikka Masala',
        description: 'Tender chicken in creamy tomato curry',
        price: 15,
        category: 'Curry',
        dietaryTags: [],
        allergens: ['dairy']
      },
      {
        id: 'menu-9',
        name: 'Vegetable Biryani',
        description: 'Basmati rice with mixed vegetables and spices',
        price: 13,
        category: 'Rice',
        dietaryTags: ['vegetarian', 'vegan'],
        allergens: []
      }
    ],
    availableReservations: [
      {
        id: 'res-5',
        date: new Date('2024-01-15'),
        time: '6:00 PM',
        partySize: 2,
        available: true
      }
    ],
    dietaryAccommodations: ['vegetarian', 'vegan', 'halal']
  },
  {
    id: 'rest-5',
    name: 'Coastal Breeze',
    cuisineType: 'Seafood',
    priceRange: 'upscale',
    atmosphere: ['romantic', 'quiet'],
    rating: 4.6,
    reviewCount: 167,
    location: {
      address: '555 Ocean View Dr',
      city: 'Beachside',
      state: 'CA',
      zipCode: '90214',
      latitude: 34.0322,
      longitude: -118.2937
    },
    photos: ['coastal-breeze-1.jpg', 'coastal-breeze-2.jpg'],
    menu: [
      {
        id: 'menu-10',
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with lemon herb butter',
        price: 28,
        category: 'Seafood',
        dietaryTags: [],
        allergens: ['fish']
      },
      {
        id: 'menu-11',
        name: 'Lobster Thermidor',
        description: 'Classic French lobster preparation',
        price: 45,
        category: 'Seafood',
        dietaryTags: [],
        allergens: ['shellfish', 'dairy']
      }
    ],
    availableReservations: [
      {
        id: 'res-6',
        date: new Date('2024-01-16'),
        time: '8:00 PM',
        partySize: 2,
        available: true
      }
    ],
    dietaryAccommodations: ['gluten-free options']
  },
  {
    id: 'rest-6',
    name: 'Taco Libre',
    cuisineType: 'Mexican',
    priceRange: 'budget',
    atmosphere: ['casual', 'lively'],
    rating: 4.1,
    reviewCount: 412,
    location: {
      address: '777 Fiesta Blvd',
      city: 'Southside',
      state: 'CA',
      zipCode: '90215',
      latitude: 34.0122,
      longitude: -118.3037
    },
    photos: ['taco-libre-1.jpg'],
    menu: [
      {
        id: 'menu-12',
        name: 'Fish Tacos',
        description: 'Grilled fish with cabbage slaw and lime crema',
        price: 12,
        category: 'Tacos',
        dietaryTags: [],
        allergens: ['fish', 'dairy']
      },
      {
        id: 'menu-13',
        name: 'Vegetarian Quesadilla',
        description: 'Cheese, peppers, onions, served with guacamole',
        price: 10,
        category: 'Quesadilla',
        dietaryTags: ['vegetarian'],
        allergens: ['dairy', 'gluten']
      }
    ],
    availableReservations: [
      {
        id: 'res-7',
        date: new Date('2024-01-15'),
        time: '7:00 PM',
        partySize: 2,
        available: true
      }
    ],
    dietaryAccommodations: ['vegetarian', 'gluten-free options']
  }
];

// Calculate distance between two locations (simplified)
const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Restaurant recommendation engine
export const getRestaurantRecommendations = (
  userPreferences: DiningPreferences,
  partnerPreferences: DiningPreferences,
  userLocation?: Location,
  context?: RecommendationContext
): Restaurant[] => {
  const scoredRestaurants = restaurants.map(restaurant => {
    let score = 0;

    // Cuisine preference matching (30% of score)
    const userCuisineMatch = userPreferences.cuisineTypes.includes(restaurant.cuisineType);
    const partnerCuisineMatch = partnerPreferences.cuisineTypes.includes(restaurant.cuisineType);
    const userCuisineDislike = userPreferences.dislikedCuisines.includes(restaurant.cuisineType);
    const partnerCuisineDislike = partnerPreferences.dislikedCuisines.includes(restaurant.cuisineType);

    if (userCuisineDislike || partnerCuisineDislike) {
      score -= 50; // Heavy penalty for disliked cuisines
    } else if (userCuisineMatch && partnerCuisineMatch) {
      score += 30;
    } else if (userCuisineMatch || partnerCuisineMatch) {
      score += 15;
    }

    // Price range matching (25% of score)
    const priceRangeOrder = ['budget', 'moderate', 'upscale', 'fine-dining'];
    const userPriceIndex = priceRangeOrder.indexOf(userPreferences.priceRange);
    const partnerPriceIndex = priceRangeOrder.indexOf(partnerPreferences.priceRange);
    const restaurantPriceIndex = priceRangeOrder.indexOf(restaurant.priceRange);

    const userPriceDiff = Math.abs(userPriceIndex - restaurantPriceIndex);
    const partnerPriceDiff = Math.abs(partnerPriceIndex - restaurantPriceIndex);
    const avgPriceDiff = (userPriceDiff + partnerPriceDiff) / 2;

    score += Math.max(0, 25 - (avgPriceDiff * 8));

    // Atmosphere matching (20% of score)
    const userAtmosphereMatch = restaurant.atmosphere.includes(userPreferences.atmospherePreference);
    const partnerAtmosphereMatch = restaurant.atmosphere.includes(partnerPreferences.atmospherePreference);

    if (userAtmosphereMatch && partnerAtmosphereMatch) {
      score += 20;
    } else if (userAtmosphereMatch || partnerAtmosphereMatch) {
      score += 10;
    }

    // Dietary restrictions and allergies (15% of score)
    const userRestrictions = userPreferences.dietaryRestrictions.map(r => r.type);
    const partnerRestrictions = partnerPreferences.dietaryRestrictions.map(r => r.type);
    const allRestrictions = [...userRestrictions, ...partnerRestrictions];

    const accommodationMatches = allRestrictions.filter(restriction =>
      restaurant.dietaryAccommodations.some(acc => acc.includes(restriction))
    ).length;

    score += (accommodationMatches / Math.max(1, allRestrictions.length)) * 15;

    // Distance (10% of score)
    if (userLocation) {
      const distance = calculateDistance(userLocation, restaurant.location);
      const maxDistance = Math.max(userPreferences.maxDistance, partnerPreferences.maxDistance);

      if (distance <= maxDistance) {
        score += Math.max(0, 10 - (distance / maxDistance) * 10);
      }

      restaurant.distance = distance;
    }

    // Rating bonus
    score += restaurant.rating * 2;

    // Mood-based adjustments
    if (context?.userMood && context?.partnerMood) {
      const moodAtmosphereMap: { [key: string]: string[] } = {
        'romantic': ['romantic', 'quiet'],
        'happy': ['lively', 'casual'],
        'relaxed': ['quiet', 'casual'],
        'energetic': ['lively'],
        'cozy': ['quiet', 'romantic']
      };

      const userMoodAtmospheres = moodAtmosphereMap[context.userMood.mood] || [];
      const partnerMoodAtmospheres = moodAtmosphereMap[context.partnerMood.mood] || [];

      const moodMatches = restaurant.atmosphere.filter(atmosphere =>
        userMoodAtmospheres.includes(atmosphere) || partnerMoodAtmospheres.includes(atmosphere)
      ).length;

      score += moodMatches * 5;
    }

    return { ...restaurant, matchScore: Math.min(100, Math.max(0, score)) };
  });

  return scoredRestaurants
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 10);
};

export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find(restaurant => restaurant.id === id);
};

export const searchRestaurants = (query: string): Restaurant[] => {
  const lowercaseQuery = query.toLowerCase();
  return restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(lowercaseQuery) ||
    restaurant.cuisineType.toLowerCase().includes(lowercaseQuery) ||
    restaurant.menu.some(item =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const getMenuRecommendations = (
  restaurant: Restaurant,
  userPreferences: DiningPreferences,
  partnerPreferences: DiningPreferences
): MenuItem[] => {
  const userAllergies = userPreferences.allergies;
  const partnerAllergies = partnerPreferences.allergies;
  const allAllergies = [...userAllergies, ...partnerAllergies];

  const userRestrictions = userPreferences.dietaryRestrictions.map(r => r.type);
  const partnerRestrictions = partnerPreferences.dietaryRestrictions.map(r => r.type);
  const allRestrictions = [...userRestrictions, ...partnerRestrictions];

  return restaurant.menu.map(item => {
    let matchesPreferences = true;

    // Check allergies
    const hasAllergen = item.allergens.some(allergen => allAllergies.includes(allergen));
    if (hasAllergen) {
      matchesPreferences = false;
    }

    // Check dietary restrictions
    if (allRestrictions.length > 0) {
      const meetsRestrictions = allRestrictions.every(restriction =>
        item.dietaryTags.includes(restriction) ||
        (restriction === 'vegetarian' && item.dietaryTags.includes('vegan'))
      );
      if (!meetsRestrictions) {
        matchesPreferences = false;
      }
    }

    return { ...item, matchesPreferences };
  }).sort((a, b) => {
    if (a.matchesPreferences && !b.matchesPreferences) return -1;
    if (!a.matchesPreferences && b.matchesPreferences) return 1;
    return 0;
  });
};

export const getAvailableReservations = (
  restaurantId: string,
  date: Date,
  partySize: number
): ReservationSlot[] => {
  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) return [];

  return restaurant.availableReservations.filter(slot =>
    slot.date.toDateString() === date.toDateString() &&
    slot.partySize >= partySize &&
    slot.available
  );
};

export const makeReservation = (
  restaurantId: string,
  reservationId: string,
  partySize: number
): boolean => {
  const restaurant = restaurants.find(r => r.id === restaurantId);
  if (!restaurant) return false;

  const reservation = restaurant.availableReservations.find(r => r.id === reservationId);
  if (!reservation || !reservation.available) return false;

  reservation.available = false;
  reservation.partySize = partySize;

  return true;
}; 