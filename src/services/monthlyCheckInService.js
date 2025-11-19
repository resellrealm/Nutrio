import { db } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { getUserProfile, calculateBMI, calculateTDEE } from './userService';
import { getDailyTotals, getWeeklySummary } from './foodLogService';

/**
 * Monthly Check-In Service
 * Generates end-of-month progress reports and recommendations
 */

// Get or create monthly summary
export const getMonthlySummary = async (userId, month, year) => {
  try {
    const summaryId = `${userId}_${year}_${month}`;
    const summaryRef = doc(db, 'monthlySummaries', summaryId);
    const summarySnap = await getDoc(summaryRef);

    if (summarySnap.exists()) {
      return { success: true, data: summarySnap.data() };
    }

    return { success: false, error: 'No summary found' };
  } catch (error) {
    console.error('Get monthly summary error:', error);
    return { success: false, error: error.message };
  }
};

// Create new monthly summary
export const createMonthlySummary = async (userId, month, year) => {
  try {
    const userProfile = await getUserProfile(userId);
    if (!userProfile.success) {
      throw new Error('Failed to get user profile');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const summaryId = `${userId}_${year}_${month}`;
    const summaryData = {
      userId,
      month: `${year}-${String(month).padStart(2, '0')}`,
      startDate,
      endDate,

      weight: {
        startingWeight: userProfile.data.basicInfo?.currentWeight?.value || 0,
        endingWeight: 0,
        change: 0,
        goal: userProfile.data.goals?.primary || '',
        onTrack: false
      },

      nutrition: {
        targetCalories: userProfile.data.calculated?.dailyCalories || 2000,
        avgCaloriesConsumed: 0,
        daysMetCalorieGoal: 0,
        totalDaysTracked: 0,
        consistencyPercentage: 0,

        macros: {
          protein: { target: 0, avgAchieved: 0, daysMetGoal: 0 },
          carbs: { target: 0, avgAchieved: 0, daysMetGoal: 0 },
          fat: { target: 0, avgAchieved: 0, daysMetGoal: 0 }
        }
      },

      behavior: {
        mealsLogged: 0,
        totalPossibleMeals: 0,
        loggingConsistency: 0,
        longestStreak: 0,
        currentStreak: 0
      },

      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    };

    const summaryRef = doc(db, 'monthlySummaries', summaryId);
    await setDoc(summaryRef, summaryData);

    return { success: true, data: summaryData };
  } catch (error) {
    console.error('Create monthly summary error:', error);
    return { success: false, error: error.message };
  }
};

// Update monthly summary with daily data
export const updateMonthlySummary = async (userId, dailyData) => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    let summary = await getMonthlySummary(userId, month, year);

    if (!summary.success) {
      summary = await createMonthlySummary(userId, month, year);
    }

    const summaryData = summary.data;
    const totalDays = summaryData.nutrition.totalDaysTracked + 1;

    // Update running averages
    const updatedData = {
      'nutrition.totalDaysTracked': totalDays,
      'nutrition.avgCaloriesConsumed':
        (summaryData.nutrition.avgCaloriesConsumed * (totalDays - 1) + dailyData.calories) / totalDays,
      'behavior.mealsLogged': summaryData.behavior.mealsLogged + dailyData.mealsCount,
      lastUpdated: serverTimestamp()
    };

    // Update streak
    if (dailyData.mealsCount > 0) {
      updatedData['behavior.currentStreak'] = summaryData.behavior.currentStreak + 1;
      if (updatedData['behavior.currentStreak'] > summaryData.behavior.longestStreak) {
        updatedData['behavior.longestStreak'] = updatedData['behavior.currentStreak'];
      }
    } else {
      updatedData['behavior.currentStreak'] = 0;
    }

    const summaryId = `${userId}_${year}_${month}`;
    const summaryRef = doc(db, 'monthlySummaries', summaryId);
    await updateDoc(summaryRef, updatedData);

    return { success: true };
  } catch (error) {
    console.error('Update monthly summary error:', error);
    return { success: false, error: error.message };
  }
};

// Generate monthly check-in report
export const generateMonthlyCheckIn = async (userId) => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Get user profile
    const userProfile = await getUserProfile(userId);
    if (!userProfile.success) {
      throw new Error('Failed to get user profile');
    }

    // Get monthly summary
    const summary = await getMonthlySummary(userId, month, year);
    if (!summary.success) {
      throw new Error('No monthly data available');
    }

    // Analyze weight progress
    const weightAnalysis = analyzeWeight(summary.data, userProfile.data);

    // Analyze nutrition
    const nutritionAnalysis = analyzeNutrition(summary.data, userProfile.data);

    // Analyze behavior
    const behaviorAnalysis = analyzeBehavior(summary.data);

    // Generate recommendations
    const recommendations = generateRecommendations(
      weightAnalysis,
      nutritionAnalysis,
      behaviorAnalysis,
      userProfile.data
    );

    // Calculate overall score
    const overallScore = calculateOverallScore(
      weightAnalysis,
      nutritionAnalysis,
      behaviorAnalysis
    );

    // Create check-in report
    const checkInReport = {
      userId,
      month: summary.data.month,
      generatedAt: new Date(),

      summary: summary.data,

      analysis: {
        weight: weightAnalysis,
        nutrition: nutritionAnalysis,
        behavior: behaviorAnalysis
      },

      recommendations,
      overallScore,
      onTrackForGoal: weightAnalysis.onTrack,

      viewed: false,
      viewedAt: null
    };

    // Save check-in report
    const checkInId = `${userId}_${year}_${month}_checkin`;
    const checkInRef = doc(db, 'monthlyCheckIns', checkInId);
    await setDoc(checkInRef, checkInReport);

    return { success: true, data: checkInReport };
  } catch (error) {
    console.error('Generate monthly check-in error:', error);
    return { success: false, error: error.message };
  }
};

// Analyze weight progress
function analyzeWeight(summary, userProfile) {
  const weightChange = summary.weight.change;
  const goal = userProfile.goals?.primary || 'maintain';

  let status = '';
  let onTrack = false;
  let message = '';

  if (goal === 'lose_weight') {
    const expectedLoss = -2; // kg per month

    if (weightChange <= expectedLoss) {
      status = 'excellent';
      onTrack = true;
      message = `Amazing! You lost ${Math.abs(weightChange)}kg this month. You're on track!`;
    } else if (weightChange < 0) {
      status = 'good';
      onTrack = true;
      message = `Good progress! You lost ${Math.abs(weightChange)}kg. Keep up the consistency.`;
    } else if (weightChange === 0) {
      status = 'needs improvement';
      onTrack = false;
      message = `Your weight stayed the same. Let's adjust your meal plan to create more deficit.`;
    } else {
      status = 'off track';
      onTrack = false;
      message = `You gained ${weightChange}kg. Don't worry - we can get back on track together.`;
    }
  } else if (goal === 'maintain') {
    const allowedVariation = 1;

    if (Math.abs(weightChange) <= allowedVariation) {
      status = 'excellent';
      onTrack = true;
      message = `Perfect! Your weight has remained stable.`;
    } else {
      status = 'needs attention';
      onTrack = false;
      message = `Your weight changed by ${weightChange}kg. Let's adjust to maintain stability.`;
    }
  } else if (goal === 'gain_muscle') {
    const expectedGain = 1.5;

    if (weightChange >= expectedGain) {
      status = 'excellent';
      onTrack = true;
      message = `Excellent! You gained ${weightChange}kg. Keep up the high-protein intake.`;
    } else if (weightChange > 0) {
      status = 'good';
      onTrack = true;
      message = `You're making progress with ${weightChange}kg gained.`;
    } else {
      status = 'off track';
      onTrack = false;
      message = `To gain muscle, we need a calorie surplus. Let's increase your intake.`;
    }
  }

  return {
    status,
    onTrack,
    message,
    change: weightChange,
    percentageToGoal: 0 // Would calculate based on target weight
  };
}

// Analyze nutrition habits
function analyzeNutrition(summary, userProfile) {
  const calorieConsistency = summary.nutrition.totalDaysTracked > 0
    ? (summary.nutrition.daysMetCalorieGoal / summary.nutrition.totalDaysTracked) * 100
    : 0;
  const loggingConsistency = summary.behavior.loggingConsistency || 0;

  let nutritionScore = 0;
  const issues = [];
  const wins = [];

  // Calorie consistency
  if (calorieConsistency >= 80) {
    nutritionScore += 30;
    wins.push('Excellent calorie consistency');
  } else if (calorieConsistency >= 60) {
    nutritionScore += 20;
  } else {
    issues.push(`Only hit calorie goals ${Math.round(calorieConsistency)}% of days`);
  }

  // Logging consistency
  if (loggingConsistency >= 90) {
    nutritionScore += 40;
    wins.push('Outstanding logging consistency');
  } else if (loggingConsistency >= 70) {
    nutritionScore += 30;
  } else if (loggingConsistency >= 50) {
    nutritionScore += 20;
    issues.push('Log meals more consistently for better insights');
  } else {
    issues.push('Low logging consistency - aim for 70% of meals logged');
  }

  return {
    score: nutritionScore,
    wins,
    issues,
    calorieConsistency,
    loggingConsistency
  };
}

// Analyze behavior patterns
function analyzeBehavior(summary) {
  const wins = [];
  const issues = [];

  // Streak analysis
  if (summary.behavior.longestStreak >= 21) {
    wins.push(`Amazing ${summary.behavior.longestStreak}-day logging streak! Habit formed.`);
  } else if (summary.behavior.longestStreak >= 7) {
    wins.push(`Good ${summary.behavior.longestStreak}-day streak! Keep building the habit.`);
  } else {
    issues.push('Try to build a 7+ day logging streak for habit formation');
  }

  return { wins, issues };
}

// Generate recommendations
function generateRecommendations(weightAnalysis, nutritionAnalysis, behaviorAnalysis, userProfile) {
  const recommendations = [];

  // Weight-based recommendations
  if (!weightAnalysis.onTrack) {
    if (weightAnalysis.change > 0 && userProfile.goals?.primary === 'lose_weight') {
      recommendations.push({
        priority: 'high',
        title: 'Adjust Calorie Target',
        description: 'Reduce daily calories by 200 to create a better deficit for weight loss.',
        action: 'adjustCalories',
        actionValue: -200
      });
    }

    if (weightAnalysis.change === 0 && userProfile.goals?.primary === 'gain_muscle') {
      recommendations.push({
        priority: 'high',
        title: 'Increase Calorie Surplus',
        description: 'Increase daily calories by 300 and ensure protein targets are met.',
        action: 'adjustCalories',
        actionValue: 300
      });
    }
  }

  // Nutrition-based recommendations
  if (nutritionAnalysis.loggingConsistency < 70) {
    recommendations.push({
      priority: 'high',
      title: 'Improve Logging Consistency',
      description: 'Set reminders for meal times to log immediately after eating.',
      action: 'setReminders'
    });
  }

  return recommendations;
}

// Calculate overall score
function calculateOverallScore(weightAnalysis, nutritionAnalysis, behaviorAnalysis) {
  let score = 0;

  score += weightAnalysis.onTrack ? 40 : 0;
  score += nutritionAnalysis.score * 0.4;
  score += behaviorAnalysis.wins.length * 5;

  return Math.min(100, score);
}

// Get latest check-in for user
export const getLatestCheckIn = async (userId) => {
  try {
    const checkInsRef = collection(db, 'monthlyCheckIns');
    const q = query(
      checkInsRef,
      where('userId', '==', userId),
      orderBy('generatedAt', 'desc'),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: 'No check-ins found' };
    }

    const checkIn = snapshot.docs[0].data();
    return { success: true, data: checkIn };
  } catch (error) {
    console.error('Get latest check-in error:', error);
    return { success: false, error: error.message };
  }
};

// Mark check-in as viewed
export const markCheckInAsViewed = async (userId, month, year) => {
  try {
    const checkInId = `${userId}_${year}_${month}_checkin`;
    const checkInRef = doc(db, 'monthlyCheckIns', checkInId);

    await updateDoc(checkInRef, {
      viewed: true,
      viewedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Mark check-in as viewed error:', error);
    return { success: false, error: error.message };
  }
};
