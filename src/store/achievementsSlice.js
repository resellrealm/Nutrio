import { createSlice } from '@reduxjs/toolkit';
import { getXPForLevel, getLevelFromXP, getLevelInfo } from '../constants/xpConstants';

const initialState = {
  level: 1,
  currentXP: 0,
  totalXP: 0, // All-time XP earned
  achievements: [],
  unlockedBadges: [],
  recentUnlocks: [],
  lastLevelUp: null,
  dailyXPEarned: {}, // Track daily XP by date for caps
  levelTitle: 'Nutrition Newbie',
  levelEmoji: '🌱',
  levelTier: 'beginner'
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    addXP: (state, action) => {
      const { amount, source, applyMultiplier = false } = action.payload;
      let xpToAdd = amount;

      // Apply multiplier if specified (e.g., premium, streaks)
      if (applyMultiplier && action.payload.multiplier) {
        xpToAdd = Math.floor(amount * action.payload.multiplier);
      }

      // Add XP
      state.currentXP += xpToAdd;
      state.totalXP += xpToAdd;

      // Check for level up(s)
      let leveledUp = false;
      while (state.currentXP >= getXPForLevel(state.level)) {
        const xpNeeded = getXPForLevel(state.level);
        state.currentXP -= xpNeeded;
        state.level += 1;
        leveledUp = true;
        state.lastLevelUp = new Date().toISOString();
      }

      // Update level title/emoji/tier
      const levelInfo = getLevelInfo(state.level);
      state.levelTitle = levelInfo.title;
      state.levelEmoji = levelInfo.emoji;
      state.levelTier = levelInfo.tier;

      // Track daily XP for caps
      const today = new Date().toISOString().split('T')[0];
      if (!state.dailyXPEarned[today]) {
        state.dailyXPEarned[today] = {};
      }
      if (!state.dailyXPEarned[today][source]) {
        state.dailyXPEarned[today][source] = 0;
      }
      state.dailyXPEarned[today][source] += xpToAdd;

      return { leveledUp, xpAdded: xpToAdd };
    },

    // Set XP directly (for loading from Firestore)
    setXP: (state, action) => {
      const { totalXP } = action.payload;
      const { level, currentXP } = getLevelFromXP(totalXP);

      state.level = level;
      state.currentXP = currentXP;
      state.totalXP = totalXP;

      const levelInfo = getLevelInfo(level);
      state.levelTitle = levelInfo.title;
      state.levelEmoji = levelInfo.emoji;
      state.levelTier = levelInfo.tier;
    },

    unlockAchievement: (state, action) => {
      const achievement = action.payload;
      if (!state.unlockedBadges.includes(achievement.id)) {
        state.unlockedBadges.push(achievement.id);
        state.recentUnlocks.push({
          ...achievement,
          unlockedAt: new Date().toISOString(),
        });

        // Add achievement XP
        if (achievement.xp) {
          state.currentXP += achievement.xp;
          state.totalXP += achievement.xp;

          // Check for level up
          while (state.currentXP >= getXPForLevel(state.level)) {
            const xpNeeded = getXPForLevel(state.level);
            state.currentXP -= xpNeeded;
            state.level += 1;
            state.lastLevelUp = new Date().toISOString();
          }

          // Update level info
          const levelInfo = getLevelInfo(state.level);
          state.levelTitle = levelInfo.title;
          state.levelEmoji = levelInfo.emoji;
          state.levelTier = levelInfo.tier;
        }
      }
    },

    updateAchievementProgress: (state, action) => {
      const { id, progress } = action.payload;
      const achievement = state.achievements.find(a => a.id === id);
      if (achievement) {
        achievement.progress = progress;
      }
    },

    clearRecentUnlocks: (state) => {
      state.recentUnlocks = [];
    },

    resetDailyXP: (state) => {
      const today = new Date().toISOString().split('T')[0];
      // Keep only today's XP, remove old days
      const newDailyXP = {};
      if (state.dailyXPEarned[today]) {
        newDailyXP[today] = state.dailyXPEarned[today];
      }
      state.dailyXPEarned = newDailyXP;
    }
  },
});

export const {
  addXP,
  setXP,
  unlockAchievement,
  updateAchievementProgress,
  clearRecentUnlocks,
  resetDailyXP
} = achievementsSlice.actions;

export default achievementsSlice.reducer;
