/**
 * Seasonal Foods Service
 * Provides seasonal food data based on user location and current date
 */

const seasonalFoodsDatabase = {
  northernHemisphere: {
    spring: {
      vegetables: [
        { name: 'Asparagus', peakMonths: [4, 5], carbonFootprint: 'low', savingsVsOffSeason: 45 },
        { name: 'Peas', peakMonths: [4, 5], carbonFootprint: 'low', savingsVsOffSeason: 40 },
        { name: 'Spinach', peakMonths: [3, 4, 5], carbonFootprint: 'low', savingsVsOffSeason: 35 },
        { name: 'Lettuce', peakMonths: [3, 4, 5], carbonFootprint: 'low', savingsVsOffSeason: 30 },
        { name: 'Radishes', peakMonths: [3, 4, 5], carbonFootprint: 'low', savingsVsOffSeason: 35 }
      ],
      fruits: [
        { name: 'Strawberries', peakMonths: [4, 5], carbonFootprint: 'low', savingsVsOffSeason: 50 },
        { name: 'Apricots', peakMonths: [5], carbonFootprint: 'low', savingsVsOffSeason: 45 },
        { name: 'Cherries', peakMonths: [5, 6], carbonFootprint: 'low', savingsVsOffSeason: 55 }
      ]
    },
    summer: {
      vegetables: [
        { name: 'Tomatoes', peakMonths: [7, 8], carbonFootprint: 'low', savingsVsOffSeason: 40 },
        { name: 'Cucumbers', peakMonths: [6, 7, 8], carbonFootprint: 'low', savingsVsOffSeason: 35 },
        { name: 'Zucchini', peakMonths: [6, 7, 8], carbonFootprint: 'low', savingsVsOffSeason: 30 },
        { name: 'Bell Peppers', peakMonths: [7, 8], carbonFootprint: 'low', savingsVsOffSeason: 45 },
        { name: 'Corn', peakMonths: [7, 8], carbonFootprint: 'low', savingsVsOffSeason: 50 },
        { name: 'Green Beans', peakMonths: [6, 7, 8], carbonFootprint: 'low', savingsVsOffSeason: 30 },
        { name: 'Eggplant', peakMonths: [7, 8], carbonFootprint: 'low', savingsVsOffSeason: 35 }
      ],
      fruits: [
        { name: 'Watermelon', peakMonths: [7, 8], carbonFootprint: 'low', savingsVsOffSeason: 60 },
        { name: 'Peaches', peakMonths: [7, 8], carbonFootprint: 'low', savingsVsOffSeason: 40 },
        { name: 'Blueberries', peakMonths: [6, 7], carbonFootprint: 'low', savingsVsOffSeason: 50 },
        { name: 'Raspberries', peakMonths: [6, 7], carbonFootprint: 'low', savingsVsOffSeason: 55 },
        { name: 'Plums', peakMonths: [7, 8], carbonFootprint: 'low', savingsVsOffSeason: 40 }
      ]
    },
    fall: {
      vegetables: [
        { name: 'Pumpkin', peakMonths: [9, 10, 11], carbonFootprint: 'low', savingsVsOffSeason: 70 },
        { name: 'Butternut Squash', peakMonths: [9, 10, 11], carbonFootprint: 'low', savingsVsOffSeason: 60 },
        { name: 'Brussels Sprouts', peakMonths: [10, 11], carbonFootprint: 'low', savingsVsOffSeason: 40 },
        { name: 'Cauliflower', peakMonths: [9, 10, 11], carbonFootprint: 'low', savingsVsOffSeason: 35 },
        { name: 'Broccoli', peakMonths: [9, 10, 11], carbonFootprint: 'low', savingsVsOffSeason: 30 },
        { name: 'Sweet Potatoes', peakMonths: [9, 10, 11], carbonFootprint: 'low', savingsVsOffSeason: 50 }
      ],
      fruits: [
        { name: 'Apples', peakMonths: [9, 10, 11], carbonFootprint: 'low', savingsVsOffSeason: 45 },
        { name: 'Pears', peakMonths: [9, 10], carbonFootprint: 'low', savingsVsOffSeason: 40 },
        { name: 'Grapes', peakMonths: [9, 10], carbonFootprint: 'low', savingsVsOffSeason: 50 },
        { name: 'Cranberries', peakMonths: [10, 11], carbonFootprint: 'low', savingsVsOffSeason: 60 }
      ]
    },
    winter: {
      vegetables: [
        { name: 'Cabbage', peakMonths: [12, 1, 2], carbonFootprint: 'low', savingsVsOffSeason: 40 },
        { name: 'Carrots', peakMonths: [12, 1, 2], carbonFootprint: 'low', savingsVsOffSeason: 30 },
        { name: 'Kale', peakMonths: [12, 1, 2], carbonFootprint: 'low', savingsVsOffSeason: 35 },
        { name: 'Leeks', peakMonths: [12, 1, 2], carbonFootprint: 'low', savingsVsOffSeason: 30 }
      ],
      fruits: [
        { name: 'Oranges', peakMonths: [12, 1, 2], carbonFootprint: 'low', savingsVsOffSeason: 50 },
        { name: 'Grapefruit', peakMonths: [12, 1, 2], carbonFootprint: 'low', savingsVsOffSeason: 45 },
        { name: 'Clementines', peakMonths: [12, 1], carbonFootprint: 'low', savingsVsOffSeason: 40 }
      ]
    }
  },
  southernHemisphere: {
    spring: {
      vegetables: [
        { name: 'Asparagus', peakMonths: [9, 10, 11], carbonFootprint: 'low', savingsVsOffSeason: 45 },
        { name: 'Peas', peakMonths: [10, 11], carbonFootprint: 'low', savingsVsOffSeason: 40 }
      ],
      fruits: [
        { name: 'Strawberries', peakMonths: [10, 11], carbonFootprint: 'low', savingsVsOffSeason: 50 }
      ]
    },
    summer: {
      vegetables: [
        { name: 'Tomatoes', peakMonths: [1, 2], carbonFootprint: 'low', savingsVsOffSeason: 40 },
        { name: 'Corn', peakMonths: [1, 2], carbonFootprint: 'low', savingsVsOffSeason: 50 }
      ],
      fruits: [
        { name: 'Mango', peakMonths: [12, 1, 2], carbonFootprint: 'low', savingsVsOffSeason: 60 },
        { name: 'Watermelon', peakMonths: [1, 2], carbonFootprint: 'low', savingsVsOffSeason: 60 }
      ]
    },
    fall: {
      vegetables: [
        { name: 'Pumpkin', peakMonths: [3, 4, 5], carbonFootprint: 'low', savingsVsOffSeason: 70 }
      ],
      fruits: [
        { name: 'Apples', peakMonths: [3, 4, 5], carbonFootprint: 'low', savingsVsOffSeason: 45 }
      ]
    },
    winter: {
      vegetables: [
        { name: 'Cabbage', peakMonths: [6, 7, 8], carbonFootprint: 'low', savingsVsOffSeason: 40 },
        { name: 'Broccoli', peakMonths: [6, 7, 8], carbonFootprint: 'low', savingsVsOffSeason: 30 }
      ],
      fruits: [
        { name: 'Oranges', peakMonths: [6, 7, 8], carbonFootprint: 'low', savingsVsOffSeason: 50 }
      ]
    }
  }
};

// Get hemisphere based on region/country
function getHemisphere(region) {
  const northernRegions = ['US', 'CA', 'MX', 'EU', 'UK', 'ES', 'FR', 'DE', 'IT', 'CN', 'JP', 'KR', 'IN', 'SA'];
  const southernRegions = ['AU', 'NZ', 'BR', 'AR', 'ZA'];

  if (northernRegions.includes(region)) {
    return 'northernHemisphere';
  } else if (southernRegions.includes(region)) {
    return 'southernHemisphere';
  }

  return 'northernHemisphere'; // default
}

// Get season based on month and hemisphere
function getSeason(month, hemisphere) {
  if (hemisphere === 'northernHemisphere') {
    if ([3, 4, 5].includes(month)) return 'spring';
    if ([6, 7, 8].includes(month)) return 'summer';
    if ([9, 10, 11].includes(month)) return 'fall';
    if ([12, 1, 2].includes(month)) return 'winter';
  } else {
    // Seasons reversed in southern hemisphere
    if ([9, 10, 11].includes(month)) return 'spring';
    if ([12, 1, 2].includes(month)) return 'summer';
    if ([3, 4, 5].includes(month)) return 'fall';
    if ([6, 7, 8].includes(month)) return 'winter';
  }
  return 'spring';
}

// Get current season name for display
export const getCurrentSeasonName = (region) => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const hemisphere = getHemisphere(region);
  const season = getSeason(month, hemisphere);

  return season.charAt(0).toUpperCase() + season.slice(1);
};

// Get seasonal foods for user's location
export const getSeasonalFoods = (region, date = new Date()) => {
  const month = date.getMonth() + 1;
  const hemisphere = getHemisphere(region);
  const season = getSeason(month, hemisphere);

  const seasonalData = seasonalFoodsDatabase[hemisphere][season];

  return {
    vegetables: seasonalData.vegetables || [],
    fruits: seasonalData.fruits || [],
    season,
    month
  };
};

// Check if ingredient is currently in season
export const isInSeason = (ingredientName, region, date = new Date()) => {
  const seasonalFoods = getSeasonalFoods(region, date);
  const month = date.getMonth() + 1;

  const allFoods = [
    ...seasonalFoods.vegetables,
    ...seasonalFoods.fruits
  ];

  const food = allFoods.find(f =>
    f.name.toLowerCase() === ingredientName.toLowerCase() ||
    ingredientName.toLowerCase().includes(f.name.toLowerCase())
  );

  if (food && food.peakMonths.includes(month)) {
    return {
      inSeason: true,
      savings: food.savingsVsOffSeason,
      carbonFootprint: food.carbonFootprint
    };
  }

  return { inSeason: false, savings: 0 };
};

// Get seasonal recipe score
export const calculateSeasonalityScore = (recipe, region) => {
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    return { score: 0, seasonalIngredients: [], totalIngredients: 0 };
  }

  const seasonalFoods = getSeasonalFoods(region);
  const allSeasonalFoods = [
    ...seasonalFoods.vegetables,
    ...seasonalFoods.fruits
  ];

  const seasonalIngredients = recipe.ingredients.filter(ing => {
    return allSeasonalFoods.some(seasonal =>
      seasonal.name.toLowerCase() === ing.name?.toLowerCase() ||
      ing.name?.toLowerCase().includes(seasonal.name.toLowerCase())
    );
  });

  const score = (seasonalIngredients.length / recipe.ingredients.length) * 100;

  return {
    score: Math.round(score),
    seasonalIngredients: seasonalIngredients.map(i => i.name),
    totalIngredients: recipe.ingredients.length,
    badge: score >= 70 ? '🌱 Highly Seasonal' : score >= 40 ? '🍃 Seasonal' : null
  };
};

// Calculate estimated savings from seasonal ingredients
export const calculateSeasonalSavings = (ingredients, region) => {
  let totalSavings = 0;
  const savingsDetails = [];

  ingredients.forEach(ingredient => {
    const seasonalInfo = isInSeason(ingredient.name, region);

    if (seasonalInfo.inSeason && seasonalInfo.savings > 0) {
      const avgPrice = ingredient.avgPrice || 5; // default price
      const savings = avgPrice * (seasonalInfo.savings / 100);

      totalSavings += savings;
      savingsDetails.push({
        ingredient: ingredient.name,
        savingsPercent: seasonalInfo.savings,
        savingsAmount: savings.toFixed(2)
      });
    }
  });

  return {
    totalSavings: totalSavings.toFixed(2),
    details: savingsDetails
  };
};
