/**
 * Religious Diet Filter Service
 * Filters recipes and ingredients based on religious dietary restrictions
 */

// Filter recipes based on religious dietary preferences
export const filterRecipesForReligion = (recipes, religiousDiet) => {
  if (!religiousDiet || religiousDiet.religion === 'none') {
    return recipes;
  }

  let filteredRecipes = recipes;

  switch (religiousDiet.religion) {
    case 'islamic':
      filteredRecipes = applyHalalFilters(filteredRecipes, religiousDiet.halal);
      break;
    case 'jewish':
      filteredRecipes = applyKosherFilters(filteredRecipes, religiousDiet.kosher);
      break;
    case 'hindu':
      filteredRecipes = applyHinduFilters(filteredRecipes, religiousDiet.hindu);
      break;
    case 'buddhist':
      filteredRecipes = applyBuddhistFilters(filteredRecipes, religiousDiet.buddhist);
      break;
    case 'jain':
      filteredRecipes = applyJainFilters(filteredRecipes, religiousDiet.jain);
      break;
  }

  return filteredRecipes;
};

// HALAL FILTERS
function applyHalalFilters(recipes, halalSettings) {
  const forbiddenIngredients = [
    'pork', 'ham', 'bacon', 'sausage', 'pepperoni',
    'lard', 'gelatin', 'alcohol', 'wine', 'beer', 'rum', 'vodka'
  ];

  return recipes.filter(recipe => {
    // Check for forbidden ingredients
    const hasForbidden = recipe.ingredients?.some(ing =>
      forbiddenIngredients.some(forbidden =>
        ing.name?.toLowerCase().includes(forbidden)
      )
    );

    if (hasForbidden) return false;

    // Check halal certification if required
    if (halalSettings?.certificationRequired === 'strict') {
      return recipe.certifications?.includes('halal');
    }

    // For meat dishes, check if halal certified
    const hasMeat = recipe.ingredients?.some(ing =>
      ['chicken', 'beef', 'lamb', 'turkey', 'meat'].some(meat =>
        ing.name?.toLowerCase().includes(meat)
      )
    );

    if (hasMeat && halalSettings?.certificationRequired === 'preferred') {
      return recipe.certifications?.includes('halal') || recipe.tags?.includes('vegetarian');
    }

    return true;
  });
}

// KOSHER FILTERS
function applyKosherFilters(recipes, kosherSettings) {
  const forbiddenIngredients = [
    'pork', 'ham', 'bacon', 'shellfish', 'shrimp', 'lobster', 'crab',
    'oysters', 'clams', 'squid'
  ];

  return recipes.filter(recipe => {
    // Check for forbidden ingredients
    const hasForbidden = recipe.ingredients?.some(ing =>
      forbiddenIngredients.some(forbidden =>
        ing.name?.toLowerCase().includes(forbidden)
      )
    );

    if (hasForbidden) return false;

    // Check for meat and dairy mixing
    if (kosherSettings?.separateMeatDairy) {
      const hasMeat = recipe.ingredients?.some(ing =>
        ['beef', 'chicken', 'lamb', 'meat'].some(meat =>
          ing.name?.toLowerCase().includes(meat)
        )
      );

      const hasDairy = recipe.ingredients?.some(ing =>
        ['milk', 'cheese', 'butter', 'cream', 'yogurt'].some(dairy =>
          ing.name?.toLowerCase().includes(dairy)
        )
      );

      if (hasMeat && hasDairy) return false;
    }

    // Check kosher certification if strict
    if (kosherSettings?.observanceLevel === 'strict') {
      return recipe.certifications?.includes('kosher');
    }

    return true;
  });
}

// HINDU FILTERS
function applyHinduFilters(recipes, hinduSettings) {
  let filteredRecipes = recipes;

  // Filter based on dietary practice
  switch (hinduSettings?.dietaryPractice) {
    case 'lacto-vegetarian':
      filteredRecipes = filteredRecipes.filter(recipe =>
        !hasIngredientType(recipe, ['meat', 'fish', 'eggs'])
      );
      break;

    case 'lacto-ovo':
      filteredRecipes = filteredRecipes.filter(recipe =>
        !hasIngredientType(recipe, ['meat', 'fish'])
      );
      break;

    case 'non-veg-no-beef':
      filteredRecipes = filteredRecipes.filter(recipe =>
        !hasIngredient(recipe, ['beef', 'veal'])
      );
      break;

    case 'vegan':
      filteredRecipes = filteredRecipes.filter(recipe =>
        !hasIngredientType(recipe, ['meat', 'fish', 'dairy', 'eggs', 'honey'])
      );
      break;
  }

  // Remove beef strictly
  if (hinduSettings?.avoidBeef) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      !hasIngredient(recipe, ['beef', 'veal'])
    );
  }

  // Remove onion and garlic if specified
  if (hinduSettings?.avoidOnionGarlic) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      !hasIngredient(recipe, ['onion', 'garlic', 'shallot', 'leek', 'chive'])
    );
  }

  return filteredRecipes;
}

// BUDDHIST FILTERS
function applyBuddhistFilters(recipes, buddhistSettings) {
  let filteredRecipes = recipes;

  switch (buddhistSettings?.dietaryPractice) {
    case 'vegetarian':
      filteredRecipes = filteredRecipes.filter(recipe =>
        !hasIngredientType(recipe, ['meat'])
      );
      break;

    case 'vegan':
      filteredRecipes = filteredRecipes.filter(recipe =>
        !hasIngredientType(recipe, ['meat', 'fish', 'dairy', 'eggs', 'honey'])
      );
      break;

    case 'pescatarian':
      filteredRecipes = filteredRecipes.filter(recipe =>
        !hasIngredientType(recipe, ['meat'])
      );
      break;
  }

  // Remove five pungent spices if specified
  if (buddhistSettings?.avoidFivePungent) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      !hasIngredient(recipe, ['onion', 'garlic', 'shallot', 'chive', 'leek'])
    );
  }

  return filteredRecipes;
}

// JAIN FILTERS
function applyJainFilters(recipes, jainSettings) {
  // All Jain diets are vegetarian at minimum
  let filteredRecipes = recipes.filter(recipe =>
    !hasIngredientType(recipe, ['meat', 'fish', 'eggs'])
  );

  // Remove onion and garlic (always for Jain)
  filteredRecipes = filteredRecipes.filter(recipe =>
    !hasIngredient(recipe, ['onion', 'garlic', 'shallot', 'leek', 'chive'])
  );

  // Remove root vegetables if strict or moderate
  if (jainSettings?.avoidRootVegetables) {
    const rootVegetables = [
      'potato', 'sweet potato', 'carrot', 'beet', 'turnip',
      'radish', 'ginger', 'turmeric'
    ];

    filteredRecipes = filteredRecipes.filter(recipe =>
      !hasIngredient(recipe, rootVegetables)
    );
  }

  return filteredRecipes;
}

// Helper: Check if recipe has specific ingredient
function hasIngredient(recipe, ingredientList) {
  return recipe.ingredients?.some(ing =>
    ingredientList.some(item =>
      ing.name?.toLowerCase().includes(item)
    )
  );
}

// Helper: Check if recipe has ingredient of certain type
function hasIngredientType(recipe, typeList) {
  return recipe.ingredients?.some(ing =>
    typeList.includes(ing.category?.toLowerCase())
  );
}

// Check if ingredient is allowed for religious diet
export const isIngredientAllowed = (ingredientName, religiousDiet) => {
  if (!religiousDiet || religiousDiet.religion === 'none') {
    return { allowed: true, reason: '' };
  }

  const name = ingredientName.toLowerCase();

  // Check based on religion
  switch (religiousDiet.religion) {
    case 'islamic':
      if (['pork', 'ham', 'bacon', 'alcohol', 'wine', 'beer'].some(f => name.includes(f))) {
        return { allowed: false, reason: 'Not halal' };
      }
      break;

    case 'jewish':
      if (['pork', 'shellfish', 'shrimp', 'crab', 'lobster'].some(f => name.includes(f))) {
        return { allowed: false, reason: 'Not kosher' };
      }
      break;

    case 'hindu':
      if (religiousDiet.hindu?.avoidBeef && ['beef', 'veal'].some(f => name.includes(f))) {
        return { allowed: false, reason: 'Beef not consumed' };
      }
      if (religiousDiet.hindu?.avoidOnionGarlic && ['onion', 'garlic'].some(f => name.includes(f))) {
        return { allowed: false, reason: 'Onion/garlic avoided' };
      }
      break;

    case 'jain':
      if (['onion', 'garlic', 'potato', 'carrot', 'meat', 'eggs'].some(f => name.includes(f))) {
        return { allowed: false, reason: 'Not Jain-compatible' };
      }
      break;
  }

  return { allowed: true, reason: '' };
};
