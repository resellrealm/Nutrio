import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Calendar, TrendingUp, Leaf, Globe, Heart, Award,
  ChevronRight, Activity, Sprout, CloudRain
} from 'lucide-react';
import { getUserProfile } from '../services/userService';
import { getLatestCheckIn } from '../services/monthlyCheckInService';
import { getSeasonalFoods, getCurrentSeasonName } from '../services/seasonalFoodsService';
import { calculateMonthlyImpact } from '../services/carbonFootprintService';
import toast from 'react-hot-toast';

const AdvancedFeatures = () => {
  const userId = useSelector(state => state.auth.user?.id);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [latestCheckIn, setLatestCheckIn] = useState(null);
  const [seasonalData, setSeasonalData] = useState(null);
  const [environmentalImpact, setEnvironmentalImpact] = useState(null);

  useEffect(() => {
    if (userId) {
      loadAdvancedFeatures();
    }
  }, [userId]);

  const loadAdvancedFeatures = async () => {
    try {
      // Load user profile
      const profileResult = await getUserProfile(userId);
      if (profileResult.success) {
        setUserProfile(profileResult.data);

        // Load seasonal foods based on user's region
        const region = profileResult.data.localization?.region || 'US';
        const seasonal = getSeasonalFoods(region);
        setSeasonalData({ ...seasonal, seasonName: getCurrentSeasonName(region) });

        // Load latest monthly check-in
        const checkInResult = await getLatestCheckIn(userId);
        if (checkInResult.success) {
          setLatestCheckIn(checkInResult.data);
        }

        // Calculate environmental impact (would use real meal data)
        // For now, using placeholder
        setEnvironmentalImpact({
          totalFootprint: '45.2',
          avgDailyFootprint: '1.5',
          rating: 'good'
        });
      }
    } catch (error) {
      console.error('Error loading advanced features:', error);
      toast.error('Failed to load advanced features');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Activity className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Advanced Features
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your personalized nutrition insights and sustainability tracking
        </p>
      </motion.div>

      {/* Monthly Check-In Card */}
      {latestCheckIn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Monthly Progress Check-In</h3>
                <p className="text-sm text-white/80">
                  {latestCheckIn.month} Report Available
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{Math.round(latestCheckIn.overallScore)}</div>
              <div className="text-xs text-white/80">Overall Score</div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <div className="text-sm mb-2">Weight Progress</div>
            <div className="text-lg font-semibold">
              {latestCheckIn.analysis?.weight?.onTrack ? '✓ On Track' : '⚠ Needs Attention'}
            </div>
            <p className="text-sm text-white/80 mt-1">
              {latestCheckIn.analysis?.weight?.message}
            </p>
          </div>

          {latestCheckIn.recommendations && latestCheckIn.recommendations.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Recommendations:</div>
              {latestCheckIn.recommendations.slice(0, 2).map((rec, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-3">
                  <div className="text-sm font-medium">{rec.title}</div>
                  <div className="text-xs text-white/80 mt-1">{rec.description}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Seasonal Foods Card */}
      {seasonalData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sprout className="w-6 h-6" />
                <div>
                  <h3 className="text-lg font-semibold">Seasonal Eating</h3>
                  <p className="text-sm text-white/90">{seasonalData.seasonName} Season</p>
                </div>
              </div>
              <Leaf className="w-8 h-8 opacity-50" />
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                What's in Season Now
              </h4>

              <div className="mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Vegetables ({seasonalData.vegetables?.length || 0})
                </div>
                <div className="flex flex-wrap gap-2">
                  {seasonalData.vegetables?.slice(0, 6).map((veg, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm"
                    >
                      {veg.name}
                      {veg.savingsVsOffSeason && (
                        <span className="ml-1 text-xs">-{veg.savingsVsOffSeason}%</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Fruits ({seasonalData.fruits?.length || 0})
                </div>
                <div className="flex flex-wrap gap-2">
                  {seasonalData.fruits?.slice(0, 6).map((fruit, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm"
                    >
                      {fruit.name}
                      {fruit.savingsVsOffSeason && (
                        <span className="ml-1 text-xs">-{fruit.savingsVsOffSeason}%</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Award className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Save up to 60% on seasonal produce
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Seasonal ingredients are fresher, tastier, and more affordable
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Environmental Impact Card */}
      {environmentalImpact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CloudRain className="w-6 h-6" />
                <div>
                  <h3 className="text-lg font-semibold">Environmental Impact</h3>
                  <p className="text-sm text-white/90">Your Carbon Footprint</p>
                </div>
              </div>
              <Globe className="w-8 h-8 opacity-50" />
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  This Month
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {environmentalImpact.totalFootprint} kg
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  CO2 equivalent
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Daily Average
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {environmentalImpact.avgDailyFootprint} kg
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                  {environmentalImpact.rating === 'good' ? '✓ Good' : 'Can improve'}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                💡 Quick Wins to Reduce Impact:
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                  <span>Choose more plant-based meals (saves ~5kg CO2/week)</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                  <span>Buy seasonal, local produce when available</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                  <span>Reduce red meat consumption by 1-2 meals/week</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Religious Diet Card */}
      {userProfile?.religiousDiet && userProfile.religiousDiet.religion !== 'none' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Religious Diet Preferences
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your dietary restrictions are automatically applied
              </p>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Active Filters:
            </div>
            <div className="flex flex-wrap gap-2">
              {userProfile.religiousDiet.religion === 'islamic' && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  ✓ Halal
                </span>
              )}
              {userProfile.religiousDiet.religion === 'jewish' && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  ✓ Kosher
                </span>
              )}
              {userProfile.religiousDiet.religion === 'hindu' && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  ✓ Hindu Dietary Guidelines
                </span>
              )}
              {userProfile.religiousDiet.religion === 'buddhist' && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  ✓ Buddhist Dietary Guidelines
                </span>
              )}
              {userProfile.religiousDiet.religion === 'jain' && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  ✓ Jain Dietary Guidelines
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
              All recipes and grocery lists are automatically filtered based on your preferences
            </p>
          </div>
        </motion.div>
      )}

      {/* Multi-Language Support Card */}
      {userProfile?.localization && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Localization Settings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your preferences for language and measurements
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Region</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {userProfile.localization.region}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Measurement System
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {userProfile.localization.measurementSystem}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Currency</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {userProfile.localization.currency}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Time Format</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {userProfile.localization.timeFormat}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedFeatures;
