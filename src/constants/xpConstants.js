/**
 * XP & Leveling System Constants
 * Defines all XP rewards, level titles, and progression formulas
 */

// ============================================
// LEVEL TITLES (1-100)
// ============================================
export const LEVEL_TITLES = {
  // Beginner Tier (1-10)
  1: { title: 'Nutrition Newbie', emoji: '🌱', tier: 'beginner' },
  2: { title: 'Calorie Cadet', emoji: '🎯', tier: 'beginner' },
  3: { title: 'Meal Apprentice', emoji: '🍽️', tier: 'beginner' },
  4: { title: 'Food Explorer', emoji: '🗺️', tier: 'beginner' },
  5: { title: 'Tracking Enthusiast', emoji: '📊', tier: 'beginner' },
  6: { title: 'Portion Prodigy', emoji: '⚖️', tier: 'beginner' },
  7: { title: 'Macro Novice', emoji: '🧮', tier: 'beginner' },
  8: { title: 'Health Seeker', emoji: '💚', tier: 'beginner' },
  9: { title: 'Balanced Beginner', emoji: '⚖️', tier: 'beginner' },
  10: { title: 'Wellness Warrior', emoji: '⚔️', tier: 'beginner' },

  // Intermediate Tier (11-25)
  11: { title: 'Nutrition Navigator', emoji: '🧭', tier: 'intermediate' },
  12: { title: 'Calorie Commander', emoji: '👑', tier: 'intermediate' },
  13: { title: 'Meal Maestro', emoji: '🎼', tier: 'intermediate' },
  14: { title: 'Diet Disciple', emoji: '🙏', tier: 'intermediate' },
  15: { title: 'Protein Paladin', emoji: '🛡️', tier: 'intermediate' },
  16: { title: 'Macro Mechanic', emoji: '🔧', tier: 'intermediate' },
  17: { title: 'Health Architect', emoji: '🏗️', tier: 'intermediate' },
  18: { title: 'Balance Keeper', emoji: '⚖️', tier: 'intermediate' },
  19: { title: 'Fitness Fanatic', emoji: '💪', tier: 'intermediate' },
  20: { title: 'Wellness Wizard', emoji: '🧙', tier: 'intermediate' },
  21: { title: 'Nutrition Knight', emoji: '⚔️', tier: 'intermediate' },
  22: { title: 'Calorie Crusader', emoji: '🏰', tier: 'intermediate' },
  23: { title: 'Macro Marshal', emoji: '🎖️', tier: 'intermediate' },
  24: { title: 'Diet Defender', emoji: '🛡️', tier: 'intermediate' },
  25: { title: 'Health Guardian', emoji: '👼', tier: 'intermediate' },

  // Advanced Tier (26-40)
  26: { title: 'Nutrition Ninja', emoji: '🥷', tier: 'advanced' },
  27: { title: 'Calorie Champion', emoji: '🏆', tier: 'advanced' },
  28: { title: 'Macro Master', emoji: '🎓', tier: 'advanced' },
  29: { title: 'Wellness Sage', emoji: '🧘', tier: 'advanced' },
  30: { title: 'Health Luminary', emoji: '✨', tier: 'advanced' },
  31: { title: 'Diet Virtuoso', emoji: '🎻', tier: 'advanced' },
  32: { title: 'Protein Prodigy', emoji: '💪', tier: 'advanced' },
  33: { title: 'Balance Sage', emoji: '⚖️', tier: 'advanced' },
  34: { title: 'Nutrition Oracle', emoji: '🔮', tier: 'advanced' },
  35: { title: 'Macro Savant', emoji: '🧠', tier: 'advanced' },
  36: { title: 'Health Titan', emoji: '💎', tier: 'advanced' },
  37: { title: 'Wellness Overlord', emoji: '👑', tier: 'advanced' },
  38: { title: 'Calorie Conqueror', emoji: '⚔️', tier: 'advanced' },
  39: { title: 'Nutrition Sovereign', emoji: '👑', tier: 'advanced' },
  40: { title: 'Diet Deity', emoji: '⚡', tier: 'advanced' },

  // Elite Tier (41-60)
  41: { title: 'Legendary Tracker', emoji: '🌟', tier: 'elite' },
  42: { title: 'Macro Immortal', emoji: '♾️', tier: 'elite' },
  43: { title: 'Health Ascendant', emoji: '🚀', tier: 'elite' },
  44: { title: 'Wellness Transcendent', emoji: '🌌', tier: 'elite' },
  45: { title: 'Nutrition Demigod', emoji: '🔱', tier: 'elite' },
  46: { title: 'Calorie Overlord', emoji: '👹', tier: 'elite' },
  47: { title: 'Balance Paragon', emoji: '💫', tier: 'elite' },
  48: { title: 'Protein Deity', emoji: '💪✨', tier: 'elite' },
  49: { title: 'Macro Eternal', emoji: '♾️✨', tier: 'elite' },
  50: { title: 'NUTRITION LEGEND', emoji: '🏆👑', tier: 'elite' },

  // Cosmic Tier (51-70)
  51: { title: 'Cosmic Nutritionist', emoji: '🌌', tier: 'cosmic' },
  52: { title: 'Stellar Tracker', emoji: '🌠', tier: 'cosmic' },
  53: { title: 'Galactic Guru', emoji: '🌌', tier: 'cosmic' },
  54: { title: 'Universal Master', emoji: '🌍', tier: 'cosmic' },
  55: { title: 'Quantum Analyst', emoji: '⚛️', tier: 'cosmic' },
  56: { title: 'Dimension Walker', emoji: '🌀', tier: 'cosmic' },
  57: { title: 'Time Lord', emoji: '⏰', tier: 'cosmic' },
  58: { title: 'Reality Shaper', emoji: '✨', tier: 'cosmic' },
  59: { title: 'Cosmic Entity', emoji: '🌌', tier: 'cosmic' },
  60: { title: 'Transcendent Being', emoji: '🌠', tier: 'cosmic' },
  61: { title: 'Omniscient Oracle', emoji: '👁️', tier: 'cosmic' },
  62: { title: 'Supreme Nutritionist', emoji: '👑', tier: 'cosmic' },
  63: { title: 'Eternal Wisdom', emoji: '♾️', tier: 'cosmic' },
  64: { title: 'Universal Guardian', emoji: '🛡️', tier: 'cosmic' },
  65: { title: 'Celestial Master', emoji: '⭐', tier: 'cosmic' },
  66: { title: 'Divine Tracker', emoji: '✨', tier: 'cosmic' },
  67: { title: 'Infinite Being', emoji: '♾️', tier: 'cosmic' },
  68: { title: 'Macro Omnipotent', emoji: '💫', tier: 'cosmic' },
  69: { title: 'Nutrition Nirvana', emoji: '🕉️', tier: 'cosmic' },
  70: { title: 'Health Enlightened', emoji: '☀️', tier: 'cosmic' },

  // God Tier (71-100)
  71: { title: 'Immortal Legend', emoji: '♾️🏆', tier: 'god' },
  72: { title: 'Supreme Being', emoji: '👑✨', tier: 'god' },
  73: { title: 'Alpha Omega', emoji: 'Ω', tier: 'god' },
  74: { title: 'Primordial Force', emoji: '💥', tier: 'god' },
  75: { title: 'Absolute Power', emoji: '⚡', tier: 'god' },
  76: { title: 'Omnipotent One', emoji: '🌟', tier: 'god' },
  77: { title: 'Creator Divine', emoji: '✨', tier: 'god' },
  78: { title: 'Ultimate Authority', emoji: '👑', tier: 'god' },
  79: { title: 'Eternal Sovereign', emoji: '♾️👑', tier: 'god' },
  80: { title: 'Mythic Deity', emoji: '⚡👑', tier: 'god' },
  81: { title: 'Legendary God', emoji: '🌟👑', tier: 'god' },
  82: { title: 'Apex Existence', emoji: '💎', tier: 'god' },
  83: { title: 'Omniversal Mind', emoji: '🧠✨', tier: 'god' },
  84: { title: 'Boundless Spirit', emoji: '🌌', tier: 'god' },
  85: { title: 'Infinite Wisdom', emoji: '♾️💡', tier: 'god' },
  86: { title: 'Perfect Balance', emoji: '⚖️✨', tier: 'god' },
  87: { title: 'Divine Harmony', emoji: '🕊️', tier: 'god' },
  88: { title: 'Sacred Perfection', emoji: '✨', tier: 'god' },
  89: { title: 'Celestial Emperor', emoji: '👑🌟', tier: 'god' },
  90: { title: 'Cosmic Overlord', emoji: '🌌👑', tier: 'god' },
  91: { title: 'Primeval God', emoji: '⚡👑', tier: 'god' },
  92: { title: 'Eternal Presence', emoji: '♾️', tier: 'god' },
  93: { title: 'Ultimate Reality', emoji: '🌟', tier: 'god' },
  94: { title: 'Infinite Creator', emoji: '✨♾️', tier: 'god' },
  95: { title: 'Supreme Architect', emoji: '🏗️👑', tier: 'god' },
  96: { title: 'Divine Absolute', emoji: '⚡✨', tier: 'god' },
  97: { title: 'Omnipotent Force', emoji: '💫👑', tier: 'god' },
  98: { title: 'Celestial Supreme', emoji: '🌠👑', tier: 'god' },
  99: { title: 'Nutrition Immortal', emoji: '♾️🏆', tier: 'god' },
  100: { title: 'NUTRIO GOD', emoji: '🌟👑⚡', tier: 'god' }
};

// Get level info helper
export const getLevelInfo = (level) => {
  const clampedLevel = Math.max(1, Math.min(100, level));
  return LEVEL_TITLES[clampedLevel] || LEVEL_TITLES[1];
};

// ============================================
// LEVEL PROGRESSION FORMULA
// ============================================

/**
 * Calculate XP needed for a specific level
 * Formula: level * 100 (linear scaling)
 */
export const getXPForLevel = (level) => {
  return level * 100;
};

/**
 * Calculate total XP needed from level 1 to target level
 */
export const getTotalXPForLevel = (targetLevel) => {
  let total = 0;
  for (let i = 1; i < targetLevel; i++) {
    total += getXPForLevel(i);
  }
  return total;
};

/**
 * Calculate level from total XP
 */
export const getLevelFromXP = (totalXP) => {
  let level = 1;
  let xpRemaining = totalXP;

  while (xpRemaining >= getXPForLevel(level)) {
    xpRemaining -= getXPForLevel(level);
    level++;
  }

  return {
    level,
    currentXP: xpRemaining,
    xpForNextLevel: getXPForLevel(level)
  };
};

// ============================================
// XP REWARD VALUES
// ============================================

export const XP_REWARDS = {
  // Meal Logging
  MEAL_LOG: 10,
  MEAL_LOG_WITH_PHOTO: 15,
  MEAL_LOG_BARCODE: 12,
  ALL_THREE_MEALS: 50,
  FIVE_MEALS_DAY: 30,

  // Accuracy & Detail
  ADD_NOTES: 5,
  LOG_PORTION_SIZE: 8,
  COMPLETE_MACROS: 10,

  // Goals & Targets
  HIT_CALORIE_GOAL: 30,
  HIT_PROTEIN_GOAL: 25,
  HIT_CARBS_GOAL: 20,
  HIT_FAT_GOAL: 20,
  HIT_ALL_MACROS: 100,
  WITHIN_50_CALORIES: 40,

  // Hydration
  LOG_WATER_GLASS: 5,
  MEET_WATER_GOAL: 30,
  EIGHT_GLASSES: 50,

  // Streaks
  DAILY_LOGIN: 5,
  THREE_DAY_STREAK: 25,
  SEVEN_DAY_STREAK: 75,
  FOURTEEN_DAY_STREAK: 150,
  THIRTY_DAY_STREAK: 400,

  // Consistency
  FIVE_DAYS_WEEK: 100,
  SEVEN_DAYS_WEEK: 200,
  BREAKFAST_ON_TIME: 15,
  LOG_WITHIN_30_MIN: 10,

  // Premium Features
  VIEW_AI_MEAL: 5,
  ADD_TO_PLANNER: 15,
  COMPLETE_MEAL_PLAN: 150,
  GENERATE_GROCERY_LIST: 20,
  MARK_ITEM_PURCHASED: 2,
  COMPLETE_GROCERY_LIST: 75,
  SCAN_FRIDGE: 30,
  GET_MEAL_SUGGESTION: 25,
  SAVE_CUSTOM_RECIPE: 25,
  TRY_AI_RECIPE: 30,
  RATE_RECIPE: 5,
  REVIEW_RECIPE: 10,
  VIEW_ANALYTICS: 10,
  EXPORT_DATA: 15,
  VIEW_MONTHLY_TRENDS: 20,

  // Achievements
  EASY_ACHIEVEMENT: 50,
  MEDIUM_ACHIEVEMENT: 150,
  HARD_ACHIEVEMENT: 300,

  // Milestones
  FIRST_ACHIEVEMENT: 100,
  TEN_ACHIEVEMENTS: 200,
  TWENTY_FIVE_ACHIEVEMENTS: 500,
  FIFTY_ACHIEVEMENTS: 1000,
  ALL_ACHIEVEMENTS: 5000,

  // One-Time Bonuses
  COMPLETE_ONBOARDING: 100,
  SETUP_NOTIFICATIONS: 25,
  UPLOAD_PROFILE_PHOTO: 15,
  ENABLE_DARK_MODE: 5,

  // Social (Future)
  ADD_FRIEND: 20,
  SEND_ENCOURAGEMENT: 5,
  COMPLETE_CHALLENGE: 100,
  REFER_USER: 500
};

// ============================================
// XP MULTIPLIERS
// ============================================

export const XP_MULTIPLIERS = {
  PREMIUM: 1.5,
  WEEKEND: 2.0,
  FIRST_ACTION_OF_DAY: 2.0,

  // Streak multipliers (every 7 days adds 10%, max 2x)
  getStreakMultiplier: (streakDays) => {
    const multiplier = 1 + (Math.floor(streakDays / 7) * 0.1);
    return Math.min(multiplier, 2.0);
  },

  // Level milestone boost (every 10 levels, get 3x boost for 24 hours)
  isLevelMilestone: (level) => level > 0 && level % 10 === 0
};

// ============================================
// DAILY CAPS (Prevent Gaming)
// ============================================

export const DAILY_XP_CAPS = {
  MEAL_LOGGING: 200,
  WATER_LOGGING: 100,
  // No caps on goals, streaks, achievements
};

// ============================================
// TIER COLORS
// ============================================

export const TIER_COLORS = {
  beginner: {
    gradient: 'from-green-400 to-green-600',
    bg: 'bg-green-500',
    text: 'text-green-600',
    border: 'border-green-500'
  },
  intermediate: {
    gradient: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    border: 'border-blue-500'
  },
  advanced: {
    gradient: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-500',
    text: 'text-purple-600',
    border: 'border-purple-500'
  },
  elite: {
    gradient: 'from-orange-400 to-orange-600',
    bg: 'bg-orange-500',
    text: 'text-orange-600',
    border: 'border-orange-500'
  },
  cosmic: {
    gradient: 'from-pink-400 via-purple-500 to-indigo-600',
    bg: 'bg-gradient-to-r from-pink-500 to-indigo-600',
    text: 'text-pink-600',
    border: 'border-pink-500'
  },
  god: {
    gradient: 'from-yellow-400 via-orange-500 to-red-600',
    bg: 'bg-gradient-to-r from-yellow-400 to-red-600',
    text: 'text-yellow-600',
    border: 'border-yellow-500'
  }
};

export default {
  LEVEL_TITLES,
  getLevelInfo,
  getXPForLevel,
  getTotalXPForLevel,
  getLevelFromXP,
  XP_REWARDS,
  XP_MULTIPLIERS,
  DAILY_XP_CAPS,
  TIER_COLORS
};
