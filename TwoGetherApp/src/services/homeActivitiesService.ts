import { HomeActivity, Recipe, Game, Ingredient, NutritionInfo, RecommendationContext } from '../types';

// Mock recipes data
export const recipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Homemade Pizza',
    description: 'Create your own pizza with fresh ingredients',
    cuisine: 'Italian',
    difficulty: 'medium',
    cookTime: 45,
    servings: 2,
    ingredients: [
      { name: 'Pizza dough', amount: '1', unit: 'ball' },
      { name: 'Tomato sauce', amount: '1/2', unit: 'cup' },
      { name: 'Mozzarella cheese', amount: '1', unit: 'cup' },
      { name: 'Fresh basil', amount: '1/4', unit: 'cup' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' }
    ],
    instructions: [
      'Preheat oven to 475°F',
      'Roll out pizza dough on floured surface',
      'Spread tomato sauce evenly',
      'Add mozzarella cheese',
      'Bake for 12-15 minutes until golden',
      'Add fresh basil and drizzle with olive oil'
    ],
    dietaryTags: ['vegetarian'],
    allergens: ['gluten', 'dairy'],
    nutritionInfo: {
      calories: 320,
      protein: 15,
      carbs: 35,
      fat: 12,
      fiber: 2,
      sugar: 4
    }
  },
  {
    id: 'recipe-2',
    name: 'Chocolate Lava Cake',
    description: 'Decadent individual chocolate cakes with molten centers',
    cuisine: 'French',
    difficulty: 'hard',
    cookTime: 30,
    servings: 2,
    ingredients: [
      { name: 'Dark chocolate', amount: '4', unit: 'oz' },
      { name: 'Butter', amount: '4', unit: 'tbsp' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Sugar', amount: '1/4', unit: 'cup' },
      { name: 'Flour', amount: '2', unit: 'tbsp' },
      { name: 'Vanilla extract', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      'Preheat oven to 425°F',
      'Melt chocolate and butter in double boiler',
      'Whisk eggs and sugar until thick',
      'Fold in chocolate mixture and flour',
      'Pour into greased ramekins',
      'Bake 12-14 minutes until edges are firm'
    ],
    dietaryTags: ['vegetarian'],
    allergens: ['eggs', 'dairy', 'gluten']
  },
  {
    id: 'recipe-3',
    name: 'Thai Green Curry',
    description: 'Aromatic and spicy Thai curry with coconut milk',
    cuisine: 'Thai',
    difficulty: 'medium',
    cookTime: 40,
    servings: 2,
    ingredients: [
      { name: 'Chicken breast', amount: '1', unit: 'lb' },
      { name: 'Coconut milk', amount: '1', unit: 'can' },
      { name: 'Green curry paste', amount: '2', unit: 'tbsp' },
      { name: 'Thai basil', amount: '1/4', unit: 'cup' },
      { name: 'Fish sauce', amount: '1', unit: 'tbsp' },
      { name: 'Brown sugar', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Heat coconut milk in pan',
      'Add curry paste and cook 2 minutes',
      'Add chicken and cook until done',
      'Season with fish sauce and sugar',
      'Garnish with Thai basil'
    ],
    dietaryTags: [],
    allergens: ['fish']
  },
  {
    id: 'recipe-4',
    name: 'Vegan Buddha Bowl',
    description: 'Nutritious bowl with quinoa, roasted vegetables, and tahini dressing',
    cuisine: 'Mediterranean',
    difficulty: 'easy',
    cookTime: 35,
    servings: 2,
    ingredients: [
      { name: 'Quinoa', amount: '1', unit: 'cup' },
      { name: 'Sweet potato', amount: '1', unit: 'large' },
      { name: 'Chickpeas', amount: '1', unit: 'can' },
      { name: 'Spinach', amount: '2', unit: 'cups' },
      { name: 'Tahini', amount: '3', unit: 'tbsp' },
      { name: 'Lemon juice', amount: '2', unit: 'tbsp' }
    ],
    instructions: [
      'Cook quinoa according to package directions',
      'Roast cubed sweet potato at 400°F for 25 minutes',
      'Drain and rinse chickpeas',
      'Mix tahini with lemon juice for dressing',
      'Assemble bowls with all ingredients',
      'Drizzle with tahini dressing'
    ],
    dietaryTags: ['vegan', 'gluten-free'],
    allergens: ['sesame']
  }
];

// Mock games data
export const games: Game[] = [
  {
    id: 'game-1',
    name: 'Scrabble',
    type: 'board',
    players: '2-4',
    duration: 60,
    difficulty: 'medium',
    description: 'Classic word-building board game',
    equipment: ['Scrabble board', 'Letter tiles', 'Score pad']
  },
  {
    id: 'game-2',
    name: 'Uno',
    type: 'card',
    players: '2-10',
    duration: 30,
    difficulty: 'easy',
    description: 'Fast-paced card matching game',
    equipment: ['Uno cards']
  },
  {
    id: 'game-3',
    name: 'It Takes Two',
    type: 'video',
    players: '2',
    duration: 120,
    difficulty: 'medium',
    description: 'Cooperative adventure game for couples',
    equipment: ['Gaming console', 'Two controllers'],
    platform: 'PlayStation, Xbox, PC'
  },
  {
    id: 'game-4',
    name: 'Codenames: Duet',
    type: 'board',
    players: '2',
    duration: 45,
    difficulty: 'medium',
    description: 'Cooperative word-based deduction game',
    equipment: ['Game cards', 'Timer']
  },
  {
    id: 'game-5',
    name: 'Overcooked! 2',
    type: 'video',
    players: '2-4',
    duration: 90,
    difficulty: 'medium',
    description: 'Chaotic cooking simulation game',
    equipment: ['Gaming console', 'Controllers'],
    platform: 'PlayStation, Xbox, PC, Nintendo Switch'
  },
  {
    id: 'game-6',
    name: 'Couples Trivia',
    type: 'trivia',
    players: '2',
    duration: 45,
    difficulty: 'easy',
    description: 'Test how well you know each other',
    equipment: ['Trivia cards or app']
  }
];

// Mock DIY activities
export const diyActivities: HomeActivity[] = [
  {
    id: 'diy-1',
    name: 'Photo Memory Wall',
    description: 'Create a beautiful wall display of your favorite memories together',
    category: 'diy',
    duration: 120,
    skillLevel: 'beginner',
    materials: [
      'Photo prints',
      'String lights',
      'Wooden clips',
      'Nails or adhesive hooks',
      'Measuring tape'
    ],
    instructions: [
      'Choose your favorite photos together',
      'Plan the layout on the wall',
      'Install string lights in desired pattern',
      'Attach photos with wooden clips',
      'Add personal touches like notes or decorations'
    ],
    estimatedCost: 25
  },
  {
    id: 'diy-2',
    name: 'Couples Scrapbook',
    description: 'Design a personalized scrapbook of your relationship journey',
    category: 'diy',
    duration: 180,
    skillLevel: 'intermediate',
    materials: [
      'Scrapbook album',
      'Decorative paper',
      'Stickers and embellishments',
      'Glue stick',
      'Colored pens',
      'Photos and mementos'
    ],
    instructions: [
      'Gather photos and mementos chronologically',
      'Plan page layouts for different milestones',
      'Create themed pages (first date, trips, etc.)',
      'Add personal notes and inside jokes',
      'Decorate with stickers and embellishments'
    ],
    estimatedCost: 40
  },
  {
    id: 'diy-3',
    name: 'Herb Garden',
    description: 'Start a small indoor herb garden for cooking together',
    category: 'diy',
    duration: 90,
    skillLevel: 'beginner',
    materials: [
      'Small pots or planters',
      'Potting soil',
      'Herb seeds or seedlings',
      'Plant labels',
      'Watering can'
    ],
    instructions: [
      'Choose herbs you both enjoy cooking with',
      'Fill pots with potting soil',
      'Plant seeds or transplant seedlings',
      'Label each pot',
      'Place in sunny location and water regularly'
    ],
    estimatedCost: 30
  },
  {
    id: 'diy-4',
    name: 'Date Night Jar',
    description: 'Create a jar filled with creative date night ideas',
    category: 'diy',
    duration: 60,
    skillLevel: 'beginner',
    materials: [
      'Glass jar',
      'Decorative paper',
      'Ribbon',
      'Colored pens',
      'Small paper strips'
    ],
    instructions: [
      'Brainstorm date ideas together',
      'Write each idea on a paper strip',
      'Decorate the jar with paper and ribbon',
      'Fill jar with all your date ideas',
      'Draw one whenever you need inspiration'
    ],
    estimatedCost: 15
  }
];

// Recommendation engines
export const getRecipeRecommendations = (
  userPreferences: any,
  partnerPreferences: any,
  context?: RecommendationContext
): Recipe[] => {
  const scoredRecipes = recipes.map(recipe => {
    let score = 0;

    // Difficulty matching based on cooking skill
    const preferredDifficulty = context?.userMood?.energy === 'low' ? 'easy' :
      context?.userMood?.energy === 'high' ? 'hard' : 'medium';

    if (recipe.difficulty === preferredDifficulty) {
      score += 25;
    }

    // Time availability
    if (context?.availableTime) {
      if (recipe.cookTime <= context.availableTime) {
        score += 20;
      } else {
        score -= 10;
      }
    }

    // Dietary restrictions
    const userRestrictions = userPreferences?.dietaryRestrictions || [];
    const partnerRestrictions = partnerPreferences?.dietaryRestrictions || [];
    const allRestrictions = [...userRestrictions, ...partnerRestrictions];

    if (allRestrictions.length > 0) {
      const meetsRestrictions = allRestrictions.every((restriction: string) =>
        recipe.dietaryTags.includes(restriction) ||
        (restriction === 'vegetarian' && recipe.dietaryTags.includes('vegan'))
      );
      if (meetsRestrictions) {
        score += 15;
      } else {
        score -= 20;
      }
    }

    // Allergies
    const userAllergies = userPreferences?.allergies || [];
    const partnerAllergies = partnerPreferences?.allergies || [];
    const allAllergies = [...userAllergies, ...partnerAllergies];

    const hasAllergen = recipe.allergens.some((allergen: string) =>
      allAllergies.includes(allergen)
    );
    if (hasAllergen) {
      score -= 50;
    }

    // Mood-based cuisine preferences
    if (context?.userMood && context?.partnerMood) {
      const moodCuisineMap: { [key: string]: string[] } = {
        'romantic': ['French', 'Italian'],
        'adventurous': ['Thai', 'Indian', 'Mexican'],
        'cozy': ['Italian', 'American'],
        'energetic': ['Thai', 'Mexican']
      };

      const userMoodCuisines = moodCuisineMap[context.userMood.mood] || [];
      const partnerMoodCuisines = moodCuisineMap[context.partnerMood.mood] || [];

      if (userMoodCuisines.includes(recipe.cuisine) || partnerMoodCuisines.includes(recipe.cuisine)) {
        score += 10;
      }
    }

    return { ...recipe, matchScore: Math.min(100, Math.max(0, score)) };
  });

  return scoredRecipes
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 6);
};

export const getGameRecommendations = (
  userPreferences: any,
  partnerPreferences: any,
  context?: RecommendationContext
): Game[] => {
  const scoredGames = games.map(game => {
    let score = 0;

    // Player count (perfect for couples)
    if (game.players === '2' || game.players.includes('2')) {
      score += 30;
    }

    // Duration matching
    if (context?.availableTime) {
      if (game.duration <= context.availableTime) {
        score += 20;
      } else if (game.duration <= context.availableTime + 30) {
        score += 10;
      } else {
        score -= 15;
      }
    }

    // Difficulty based on mood/energy
    const preferredDifficulty = context?.userMood?.energy === 'low' ? 'easy' :
      context?.userMood?.energy === 'high' ? 'hard' : 'medium';

    if (game.difficulty === preferredDifficulty) {
      score += 15;
    }

    // Game type preferences
    const gameTypePreferences = userPreferences?.gameTypes || [];
    const partnerGameTypePreferences = partnerPreferences?.gameTypes || [];

    if (gameTypePreferences.includes(game.type) || partnerGameTypePreferences.includes(game.type)) {
      score += 20;
    }

    // Mood-based game type matching
    if (context?.userMood && context?.partnerMood) {
      const moodGameMap: { [key: string]: string[] } = {
        'energetic': ['video', 'party'],
        'relaxed': ['board', 'card'],
        'competitive': ['board', 'video'],
        'cozy': ['card', 'trivia']
      };

      const userMoodGames = moodGameMap[context.userMood.mood] || [];
      const partnerMoodGames = moodGameMap[context.partnerMood.mood] || [];

      if (userMoodGames.includes(game.type) || partnerMoodGames.includes(game.type)) {
        score += 10;
      }
    }

    return { ...game, matchScore: Math.min(100, Math.max(0, score)) };
  });

  return scoredGames
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 6);
};

export const getDIYRecommendations = (
  userPreferences: any,
  partnerPreferences: any,
  context?: RecommendationContext
): HomeActivity[] => {
  const scoredActivities = diyActivities.map(activity => {
    let score = 0;

    // Skill level matching
    const userSkillLevel = userPreferences?.diySkillLevel || 'beginner';
    const partnerSkillLevel = partnerPreferences?.diySkillLevel || 'beginner';

    const skillLevels = ['beginner', 'intermediate', 'advanced'];
    const avgSkillIndex = (skillLevels.indexOf(userSkillLevel) + skillLevels.indexOf(partnerSkillLevel)) / 2;
    const avgSkillLevel = skillLevels[Math.floor(avgSkillIndex)];

    if (activity.skillLevel === avgSkillLevel) {
      score += 25;
    }

    // Time availability
    if (context?.availableTime) {
      if (activity.duration <= context.availableTime) {
        score += 20;
      } else {
        score -= 10;
      }
    }

    // Budget considerations
    if (context?.budget) {
      if (activity.estimatedCost <= context.budget) {
        score += 15;
      } else {
        score -= 20;
      }
    }

    // Mood-based activity matching
    if (context?.userMood && context?.partnerMood) {
      const moodActivityMap: { [key: string]: string[] } = {
        'creative': ['diy'],
        'romantic': ['diy'],
        'cozy': ['diy'],
        'productive': ['diy']
      };

      const userMoodActivities = moodActivityMap[context.userMood.mood] || [];
      const partnerMoodActivities = moodActivityMap[context.partnerMood.mood] || [];

      if (userMoodActivities.includes(activity.category) || partnerMoodActivities.includes(activity.category)) {
        score += 10;
      }
    }

    return { ...activity, matchScore: Math.min(100, Math.max(0, score)) };
  });

  return scoredActivities
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 4);
};

// Search functions
export const searchRecipes = (query: string): Recipe[] => {
  const lowercaseQuery = query.toLowerCase();
  return recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.cuisine.toLowerCase().includes(lowercaseQuery) ||
    recipe.ingredients.some(ingredient =>
      ingredient.name.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const searchGames = (query: string): Game[] => {
  const lowercaseQuery = query.toLowerCase();
  return games.filter(game =>
    game.name.toLowerCase().includes(lowercaseQuery) ||
    game.description.toLowerCase().includes(lowercaseQuery) ||
    game.type.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchDIYActivities = (query: string): HomeActivity[] => {
  const lowercaseQuery = query.toLowerCase();
  return diyActivities.filter(activity =>
    activity.name.toLowerCase().includes(lowercaseQuery) ||
    activity.description.toLowerCase().includes(lowercaseQuery) ||
    activity.materials.some(material =>
      material.toLowerCase().includes(lowercaseQuery)
    )
  );
};

// Get by ID functions
export const getRecipeById = (id: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.id === id);
};

export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};

export const getDIYActivityById = (id: string): HomeActivity | undefined => {
  return diyActivities.find(activity => activity.id === id);
}; 