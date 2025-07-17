import { VirtualDate, SharedWishlist, SynchronizedPlan, RecommendationContext } from '../types';

// Mock virtual date activities
export const virtualDates: VirtualDate[] = [
  {
    id: 'virtual-1',
    title: 'Netflix Party Movie Night',
    description: 'Watch a movie together in sync with chat',
    type: 'movie-sync',
    duration: 120,
    instructions: [
      'Both partners install Netflix Party extension',
      'Choose a movie you both want to watch',
      'One person starts the party and shares the link',
      'Join the party and enjoy synchronized viewing',
      'Use the chat feature to share reactions'
    ],
    requiredApps: ['Netflix', 'Netflix Party Extension'],
    timezoneFlexible: false
  },
  {
    id: 'virtual-2',
    title: 'Online Gaming Session',
    description: 'Play cooperative or competitive games together',
    type: 'game-night',
    duration: 90,
    instructions: [
      'Choose a multiplayer game you both enjoy',
      'Set up voice chat (Discord, game chat, etc.)',
      'Create or join a private game room',
      'Play together and have fun competing or cooperating',
      'Try different games to keep it interesting'
    ],
    requiredApps: ['Steam', 'Discord', 'Game of choice'],
    timezoneFlexible: true
  },
  {
    id: 'virtual-3',
    title: 'Cook the Same Recipe',
    description: 'Prepare the same meal together over video call',
    type: 'cooking-together',
    duration: 60,
    instructions: [
      'Choose a recipe you both want to try',
      'Shop for ingredients beforehand',
      'Set up video call with good kitchen view',
      'Cook together step by step',
      'Enjoy your meal together on camera'
    ],
    requiredApps: ['FaceTime', 'Zoom', 'or Skype'],
    timezoneFlexible: true
  },
  {
    id: 'virtual-4',
    title: 'Virtual Museum Tour',
    description: 'Explore famous museums together online',
    type: 'virtual-tour',
    duration: 45,
    instructions: [
      'Choose a museum with virtual tours',
      'Start a video call',
      'Navigate the tour together',
      'Discuss what you see and learn',
      'Take screenshots of favorite exhibits'
    ],
    requiredApps: ['Video calling app', 'Web browser'],
    timezoneFlexible: true
  },
  {
    id: 'virtual-5',
    title: 'Online Trivia Night',
    description: 'Test your knowledge together in online trivia',
    type: 'game-night',
    duration: 75,
    instructions: [
      'Find an online trivia platform',
      'Create a team or play against each other',
      'Set up voice chat for communication',
      'Answer questions together',
      'Celebrate your wins and laugh at wrong answers'
    ],
    requiredApps: ['Trivia app', 'Voice chat app'],
    timezoneFlexible: false
  },
  {
    id: 'virtual-6',
    title: 'Virtual Coffee Date',
    description: 'Share a coffee or tea together over video call',
    type: 'video-call',
    duration: 30,
    instructions: [
      'Prepare your favorite hot beverage',
      'Find a cozy spot with good lighting',
      'Start a video call',
      'Share about your day and plans',
      'Enjoy the simple pleasure of being together'
    ],
    requiredApps: ['Video calling app'],
    timezoneFlexible: true
  },
  {
    id: 'virtual-7',
    title: 'Online Escape Room',
    description: 'Solve puzzles together in a virtual escape room',
    type: 'game-night',
    duration: 60,
    instructions: [
      'Choose an online escape room platform',
      'Create a private room for two',
      'Set up screen sharing if needed',
      'Work together to solve clues',
      'Communicate and strategize to escape'
    ],
    requiredApps: ['Escape room platform', 'Screen sharing app'],
    timezoneFlexible: true
  },
  {
    id: 'virtual-8',
    title: 'Synchronized Workout',
    description: 'Exercise together with online fitness videos',
    type: 'video-call',
    duration: 45,
    instructions: [
      'Choose a workout video you both like',
      'Set up video call with full body view',
      'Start the workout at the same time',
      'Motivate each other throughout',
      'Cool down and stretch together'
    ],
    requiredApps: ['Video calling app', 'Fitness app/YouTube'],
    timezoneFlexible: true
  },
  {
    id: 'virtual-9',
    title: 'Online Board Game',
    description: 'Play classic board games on digital platforms',
    type: 'game-night',
    duration: 90,
    instructions: [
      'Choose a board game platform (Board Game Arena, etc.)',
      'Create accounts and friend each other',
      'Start a private game',
      'Set up voice chat for better interaction',
      'Play your favorite board games digitally'
    ],
    requiredApps: ['Board game platform', 'Voice chat app'],
    timezoneFlexible: true
  },
  {
    id: 'virtual-10',
    title: 'Virtual Stargazing',
    description: 'Explore the night sky together using astronomy apps',
    type: 'virtual-tour',
    duration: 60,
    instructions: [
      'Download a stargazing app',
      'Find a time when you can both see the sky',
      'Start a video call',
      'Point your phones at the same area of sky',
      'Identify constellations and planets together'
    ],
    requiredApps: ['Stargazing app', 'Video calling app'],
    timezoneFlexible: false
  }
];

// Mock shared wishlist items
export const sharedWishlistItems: SharedWishlist[] = [
  {
    id: 'wish-1',
    title: 'Visit Paris Together',
    description: 'Romantic trip to the City of Light',
    category: 'travel',
    priority: 'high',
    estimatedCost: 3000,
    addedBy: 'user1',
    completed: false,
    notes: 'Want to see the Eiffel Tower and try authentic French cuisine'
  },
  {
    id: 'wish-2',
    title: 'Learn to Salsa Dance',
    description: 'Take salsa dancing lessons together',
    category: 'activity',
    priority: 'medium',
    estimatedCost: 200,
    addedBy: 'user2',
    completed: false,
    notes: 'Found a great studio downtown'
  },
  {
    id: 'wish-3',
    title: 'Try Sushi Making Class',
    description: 'Learn to make sushi from a professional chef',
    category: 'activity',
    priority: 'medium',
    estimatedCost: 150,
    addedBy: 'user1',
    completed: false
  },
  {
    id: 'wish-4',
    title: 'Weekend Cabin Getaway',
    description: 'Cozy weekend in a mountain cabin',
    category: 'travel',
    priority: 'high',
    estimatedCost: 400,
    addedBy: 'user2',
    completed: false,
    notes: 'Perfect for disconnecting and relaxing'
  },
  {
    id: 'wish-5',
    title: 'Concert Tickets',
    description: 'See favorite band live in concert',
    category: 'activity',
    priority: 'high',
    estimatedCost: 200,
    addedBy: 'user1',
    completed: false,
    notes: 'They announced tour dates!'
  }
];

// Mock synchronized plans
export const synchronizedPlans: SynchronizedPlan[] = [
  {
    id: 'sync-1',
    title: 'Movie Night',
    description: 'Watch new romantic comedy together',
    scheduledDate: new Date('2024-01-20'),
    scheduledTime: '20:00',
    timezone1: 'America/New_York',
    timezone2: 'America/Los_Angeles',
    convertedTime1: '8:00 PM EST',
    convertedTime2: '5:00 PM PST',
    type: 'virtual',
    participants: ['user1', 'user2'],
    reminders: [
      {
        id: 'rem-1',
        message: 'Movie night starting in 30 minutes!',
        timeOffset: 30,
        sent: false
      }
    ],
    status: 'planned'
  },
  {
    id: 'sync-2',
    title: 'Virtual Coffee Date',
    description: 'Morning coffee together',
    scheduledDate: new Date('2024-01-21'),
    scheduledTime: '09:00',
    timezone1: 'America/New_York',
    timezone2: 'America/Los_Angeles',
    convertedTime1: '9:00 AM EST',
    convertedTime2: '6:00 AM PST',
    type: 'virtual',
    participants: ['user1', 'user2'],
    reminders: [
      {
        id: 'rem-2',
        message: 'Coffee date in 15 minutes!',
        timeOffset: 15,
        sent: false
      }
    ],
    status: 'confirmed'
  }
];

// Recommendation engine for virtual dates
export const getVirtualDateRecommendations = (
  userPreferences: any,
  partnerPreferences: any,
  context?: RecommendationContext
): VirtualDate[] => {
  const scoredDates = virtualDates.map(date => {
    let score = 0;

    // Duration matching
    if (context?.availableTime) {
      if (date.duration <= context.availableTime) {
        score += 25;
      } else if (date.duration <= context.availableTime + 30) {
        score += 10;
      } else {
        score -= 15;
      }
    }

    // Activity type preferences
    const userActivityTypes = userPreferences?.virtualActivityTypes || [];
    const partnerActivityTypes = partnerPreferences?.virtualActivityTypes || [];

    if (userActivityTypes.includes(date.type) || partnerActivityTypes.includes(date.type)) {
      score += 20;
    }

    // Timezone flexibility
    const differentTimezones = userPreferences?.timezone !== partnerPreferences?.timezone;
    if (differentTimezones && date.timezoneFlexible) {
      score += 15;
    } else if (differentTimezones && !date.timezoneFlexible) {
      score -= 10;
    }

    // Mood-based matching
    if (context?.userMood && context?.partnerMood) {
      const moodActivityMap: { [key: string]: string[] } = {
        'romantic': ['movie-sync', 'video-call', 'cooking-together'],
        'energetic': ['game-night', 'video-call'],
        'relaxed': ['video-call', 'virtual-tour', 'movie-sync'],
        'adventurous': ['game-night', 'virtual-tour'],
        'cozy': ['movie-sync', 'cooking-together', 'video-call']
      };

      const userMoodActivities = moodActivityMap[context.userMood.mood] || [];
      const partnerMoodActivities = moodActivityMap[context.partnerMood.mood] || [];

      if (userMoodActivities.includes(date.type) || partnerMoodActivities.includes(date.type)) {
        score += 15;
      }
    }

    // Time of day matching
    if (context?.timeOfDay) {
      const timeActivityMap: { [key: string]: string[] } = {
        'morning': ['video-call', 'cooking-together'],
        'afternoon': ['virtual-tour', 'game-night'],
        'evening': ['movie-sync', 'game-night', 'video-call'],
        'night': ['movie-sync', 'virtual-tour']
      };

      const timeActivities = timeActivityMap[context.timeOfDay] || [];
      if (timeActivities.includes(date.type)) {
        score += 10;
      }
    }

    return { ...date, matchScore: Math.min(100, Math.max(0, score)) };
  });

  return scoredDates
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 8);
};

// Timezone conversion utilities
export const convertTimeToTimezone = (time: string, fromTimezone: string, toTimezone: string): string => {
  // This is a simplified implementation
  // In a real app, you'd use a proper timezone library like moment-timezone or date-fns-tz

  const timezoneOffsets: { [key: string]: number } = {
    'America/New_York': -5,
    'America/Los_Angeles': -8,
    'Europe/London': 0,
    'Asia/Tokyo': 9,
    'Australia/Sydney': 11
  };

  const [hours, minutes] = time.split(':').map(Number);
  const fromOffset = timezoneOffsets[fromTimezone] || 0;
  const toOffset = timezoneOffsets[toTimezone] || 0;

  const offsetDiff = toOffset - fromOffset;
  const newHours = (hours + offsetDiff + 24) % 24;

  const period = newHours >= 12 ? 'PM' : 'AM';
  const displayHours = newHours === 0 ? 12 : newHours > 12 ? newHours - 12 : newHours;

  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Shared wishlist functions
export const addToSharedWishlist = (item: Omit<SharedWishlist, 'id' | 'completed' | 'completedDate'>): SharedWishlist => {
  const newItem: SharedWishlist = {
    ...item,
    id: `wish-${Date.now()}`,
    completed: false
  };

  sharedWishlistItems.push(newItem);
  return newItem;
};

export const getSharedWishlist = (): SharedWishlist[] => {
  return sharedWishlistItems.sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

export const completeWishlistItem = (id: string): boolean => {
  const item = sharedWishlistItems.find(item => item.id === id);
  if (item) {
    item.completed = true;
    item.completedDate = new Date();
    return true;
  }
  return false;
};

export const removeFromWishlist = (id: string): boolean => {
  const index = sharedWishlistItems.findIndex(item => item.id === id);
  if (index !== -1) {
    sharedWishlistItems.splice(index, 1);
    return true;
  }
  return false;
};

// Synchronized planning functions
export const createSynchronizedPlan = (
  plan: Omit<SynchronizedPlan, 'id' | 'convertedTime1' | 'convertedTime2' | 'reminders' | 'status'>
): SynchronizedPlan => {
  const convertedTime1 = convertTimeToTimezone(plan.scheduledTime, plan.timezone1, plan.timezone1);
  const convertedTime2 = convertTimeToTimezone(plan.scheduledTime, plan.timezone1, plan.timezone2);

  const newPlan: SynchronizedPlan = {
    ...plan,
    id: `sync-${Date.now()}`,
    convertedTime1,
    convertedTime2,
    reminders: [
      {
        id: `rem-${Date.now()}`,
        message: `${plan.title} starting in 30 minutes!`,
        timeOffset: 30,
        sent: false
      }
    ],
    status: 'planned'
  };

  synchronizedPlans.push(newPlan);
  return newPlan;
};

export const getSynchronizedPlans = (): SynchronizedPlan[] => {
  return synchronizedPlans.sort((a, b) =>
    a.scheduledDate.getTime() - b.scheduledDate.getTime()
  );
};

export const updatePlanStatus = (id: string, status: SynchronizedPlan['status']): boolean => {
  const plan = synchronizedPlans.find(p => p.id === id);
  if (plan) {
    plan.status = status;
    return true;
  }
  return false;
};

// Search functions
export const searchVirtualDates = (query: string): VirtualDate[] => {
  const lowercaseQuery = query.toLowerCase();
  return virtualDates.filter(date =>
    date.title.toLowerCase().includes(lowercaseQuery) ||
    date.description.toLowerCase().includes(lowercaseQuery) ||
    date.type.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchSharedWishlist = (query: string): SharedWishlist[] => {
  const lowercaseQuery = query.toLowerCase();
  return sharedWishlistItems.filter(item =>
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.description?.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Get by ID functions
export const getVirtualDateById = (id: string): VirtualDate | undefined => {
  return virtualDates.find(date => date.id === id);
};

export const getWishlistItemById = (id: string): SharedWishlist | undefined => {
  return sharedWishlistItems.find(item => item.id === id);
};

export const getSynchronizedPlanById = (id: string): SynchronizedPlan | undefined => {
  return synchronizedPlans.find(plan => plan.id === id);
}; 