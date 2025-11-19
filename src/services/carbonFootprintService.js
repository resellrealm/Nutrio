/**
 * Carbon Footprint Calculator Service
 * Calculates environmental impact of food choices
 */

// CO2 emissions in kg per kg of food
const carbonFootprintData = {
  proteins: {
    'beef': 27.0,
    'lamb': 39.2,
    'pork': 12.1,
    'chicken': 6.9,
    'turkey': 10.9,
    'fish': 5.0,
    'shrimp': 12.0,
    'eggs': 4.8,
    'tofu': 2.0,
    'lentils': 0.9,
    'beans': 2.0,
    'chickpeas': 1.6
  },

  dairy: {
    'milk': 1.9,
    'cheese': 13.5,
    'yogurt': 2.2,
    'butter': 12.0,
    'cream': 6.5
  },

  vegetables: {
    'tomatoes': 0.7,
    'lettuce': 0.3,
    'potatoes': 0.3,
    'carrots': 0.4,
    'onions': 0.3,
    'broccoli': 0.4,
    'spinach': 0.3,
    'bell peppers': 0.7,
    'mushrooms': 1.4,
    'avocado': 1.3,
    'cucumber': 0.3,
    'zucchini': 0.3
  },

  fruits: {
    'apples': 0.3,
    'bananas': 0.7,
    'oranges': 0.4,
    'berries': 1.1,
    'grapes': 1.0,
    'watermelon': 0.3,
    'strawberries': 1.0,
    'pineapple': 0.7
  },

  grains: {
    'rice': 4.0,
    'bread': 1.1,
    'pasta': 1.3,
    'oats': 2.5,
    'quinoa': 1.6
  },

  transportation: {
    'local': 1.0,
    'regional': 1.2,
    'national': 1.5,
    'imported': 2.5
  }
};

// Calculate carbon footprint for a single food item
export const calculateFoodFootprint = (food) => {
  const category = identifyFoodCategory(food.name);
  const baseFootprint = getCarbonFootprint(food.name, category);

  if (!baseFootprint) {
    return 0;
  }

  // Convert quantity to kg
  const quantityKg = convertToKg(food.quantity || 1, food.unit || 'serving');

  // Adjust for transportation
  const transportMultiplier = food.isLocal
    ? carbonFootprintData.transportation.local
    : carbonFootprintData.transportation.national;

  return baseFootprint * quantityKg * transportMultiplier;
};

// Calculate carbon footprint for entire meal
export const calculateMealCarbonFootprint = (meal) => {
  if (!meal.foods || meal.foods.length === 0) {
    return {
      totalFootprint: 0,
      breakdown: [],
      rating: getRating(0),
      comparison: 'No data available'
    };
  }

  let totalFootprint = 0;
  const breakdown = [];

  meal.foods.forEach(food => {
    const footprint = calculateFoodFootprint(food);

    if (footprint > 0) {
      totalFootprint += footprint;
      breakdown.push({
        food: food.name,
        quantity: `${food.quantity} ${food.unit}`,
        footprint: footprint.toFixed(2),
        percentage: 0 // Will calculate after total is known
      });
    }
  });

  // Calculate percentages
  breakdown.forEach(item => {
    item.percentage = totalFootprint > 0
      ? ((item.footprint / totalFootprint) * 100).toFixed(1)
      : 0;
  });

  return {
    totalFootprint: totalFootprint.toFixed(2),
    breakdown,
    rating: getRating(totalFootprint),
    comparison: getComparison(totalFootprint)
  };
};

// Calculate monthly environmental impact
export const calculateMonthlyImpact = (meals) => {
  let totalFootprint = 0;
  const dailyFootprints = {};

  meals.forEach(meal => {
    const mealFootprint = calculateMealCarbonFootprint(meal);
    const footprint = parseFloat(mealFootprint.totalFootprint);
    totalFootprint += footprint;

    // Group by day
    const day = new Date(meal.date).toISOString().split('T')[0];
    if (!dailyFootprints[day]) {
      dailyFootprints[day] = 0;
    }
    dailyFootprints[day] += footprint;
  });

  const daysWithData = Object.keys(dailyFootprints).length;
  const avgDailyFootprint = daysWithData > 0 ? totalFootprint / daysWithData : 0;

  // Calculate equivalents
  const carMilesEquivalent = (totalFootprint / 0.404).toFixed(0); // avg car emits 0.404 kg CO2 per mile
  const treesNeeded = (totalFootprint / 21).toFixed(1); // 1 tree absorbs ~21 kg CO2 per year

  return {
    totalFootprint: totalFootprint.toFixed(2),
    avgDailyFootprint: avgDailyFootprint.toFixed(2),
    dailyBreakdown: dailyFootprints,
    equivalents: {
      carMiles: carMilesEquivalent,
      treesNeededToOffset: treesNeeded
    },
    improvements: generateImprovementSuggestions(meals)
  };
};

// Generate improvement suggestions
function generateImprovementSuggestions(meals) {
  const suggestions = [];

  // Count high-impact foods
  const beefMeals = meals.filter(m =>
    m.foods?.some(f => f.name?.toLowerCase().includes('beef'))
  ).length;

  const localMeals = meals.filter(m =>
    m.foods?.every(f => f.isLocal)
  ).length;

  const plantBasedMeals = meals.filter(m =>
    m.foods?.every(f => {
      const name = f.name?.toLowerCase() || '';
      return !['beef', 'lamb', 'pork', 'chicken', 'fish'].some(meat => name.includes(meat));
    })
  ).length;

  // Generate suggestions
  if (beefMeals > 4) {
    suggestions.push({
      priority: 'high',
      title: 'Reduce Beef Consumption',
      description: `You ate beef ${beefMeals} times this month. Beef has the highest carbon footprint. Try substituting with chicken, fish, or plant-based proteins.`,
      potentialSavings: `${(beefMeals * 20).toFixed(0)} kg CO2e per month`
    });
  }

  if (localMeals < meals.length * 0.3) {
    suggestions.push({
      priority: 'medium',
      title: 'Choose Local Produce',
      description: 'Local produce has lower transportation emissions. Choose seasonal, locally-grown ingredients when possible.',
      potentialSavings: '30-40% reduction in produce footprint'
    });
  }

  if (plantBasedMeals < meals.length * 0.4) {
    suggestions.push({
      priority: 'medium',
      title: 'Try More Plant-Based Meals',
      description: 'Plant-based meals have significantly lower carbon footprints. Try having 2-3 vegetarian days per week.',
      potentialSavings: `${((meals.length - plantBasedMeals) * 0.4 * 5).toFixed(0)} kg CO2e per month`
    });
  }

  return suggestions;
}

// Identify food category
function identifyFoodCategory(foodName) {
  const name = foodName?.toLowerCase() || '';

  // Check proteins
  if (Object.keys(carbonFootprintData.proteins).some(p => name.includes(p))) {
    return 'proteins';
  }

  // Check dairy
  if (Object.keys(carbonFootprintData.dairy).some(d => name.includes(d))) {
    return 'dairy';
  }

  // Check vegetables
  if (Object.keys(carbonFootprintData.vegetables).some(v => name.includes(v))) {
    return 'vegetables';
  }

  // Check fruits
  if (Object.keys(carbonFootprintData.fruits).some(f => name.includes(f))) {
    return 'fruits';
  }

  // Check grains
  if (Object.keys(carbonFootprintData.grains).some(g => name.includes(g))) {
    return 'grains';
  }

  return 'vegetables'; // default
}

// Get carbon footprint value
function getCarbonFootprint(foodName, category) {
  const name = foodName?.toLowerCase() || '';

  if (carbonFootprintData[category]) {
    // Exact match
    if (carbonFootprintData[category][name]) {
      return carbonFootprintData[category][name];
    }

    // Fuzzy match
    for (const [key, value] of Object.entries(carbonFootprintData[category])) {
      if (key.includes(name) || name.includes(key)) {
        return value;
      }
    }
  }

  // Default values by category
  const defaults = {
    proteins: 8.0,
    dairy: 4.0,
    vegetables: 0.5,
    fruits: 0.6,
    grains: 1.5
  };

  return defaults[category] || 2.0;
}

// Convert quantity to kg
function convertToKg(quantity, unit) {
  const conversions = {
    'g': 0.001,
    'kg': 1,
    'lb': 0.453592,
    'oz': 0.0283495,
    'serving': 0.15, // approximate
    'cup': 0.2, // approximate
    'piece': 0.15 // approximate
  };

  return quantity * (conversions[unit?.toLowerCase()] || 0.15);
}

// Get rating based on footprint
function getRating(footprint) {
  if (footprint < 2) return { level: 'excellent', color: '#4CAF50', emoji: '🌱' };
  if (footprint < 4) return { level: 'good', color: '#8BC34A', emoji: '🍃' };
  if (footprint < 6) return { level: 'moderate', color: '#FF9800', emoji: '⚠️' };
  if (footprint < 10) return { level: 'high', color: '#F44336', emoji: '🔥' };
  return { level: 'very high', color: '#B71C1C', emoji: '🚨' };
}

// Get comparison to average
function getComparison(footprint) {
  const avgMealFootprint = 2.5;
  const diff = ((footprint - avgMealFootprint) / avgMealFootprint) * 100;

  if (diff < -30) {
    return `This meal has ${Math.abs(Math.round(diff))}% lower carbon footprint than average! 🎉`;
  } else if (diff < 0) {
    return `This meal is ${Math.abs(Math.round(diff))}% better than average.`;
  } else if (diff < 30) {
    return `This meal is ${Math.round(diff)}% above average.`;
  } else {
    return `This meal has a ${Math.round(diff)}% higher carbon footprint than average.`;
  }
}
