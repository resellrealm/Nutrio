import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, X, Sparkles, Zap, Trophy, Target } from 'lucide-react';
import { requestNotificationPermission } from '../../services/notificationsService';
import toast from 'react-hot-toast';

const NotificationPermission = ({ onContinue, onSkip }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const result = await requestNotificationPermission();
      setPermission(result);

      if (result === 'granted') {
        toast.success('🎉 Notifications enabled!');
        setTimeout(() => onContinue({ notificationsEnabled: true }), 500);
      } else if (result === 'denied') {
        toast.error('Notifications blocked. You can enable them later in settings.');
        setTimeout(() => onContinue({ notificationsEnabled: false }), 1000);
      }
    } catch (error) {
      console.error('Notification permission error:', error);
      toast.error('Failed to request notifications');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    onSkip({ notificationsEnabled: false });
  };

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Meal Reminders',
      description: 'Never forget to log your meals',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Achievement Alerts',
      description: 'Get notified when you unlock achievements',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Goal Tracking',
      description: 'Stay on track with daily goal reminders',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Streak Protection',
      description: 'Protect your streak with timely reminders',
      color: 'from-blue-400 to-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl" />

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 text-center"
            >
              {/* Animated Bell Icon */}
              <motion.div
                animate={{
                  rotate: [0, -15, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="inline-block mb-4"
              >
                <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bell className="w-10 h-10" />
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold mb-2">
                Stay on Track with Notifications
              </h2>
              <p className="text-white/90 text-lg">
                Get timely reminders to help you reach your nutrition goals
              </p>
            </motion.div>
          </div>

          {/* Benefits Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                      {benefit.icon}
                    </div>

                    {/* Content */}
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Privacy Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Your Privacy Matters
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    We'll only send helpful reminders. No spam, no tracking, no annoying ads.
                    You can customize or disable notifications anytime in settings.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={handleEnableNotifications}
                disabled={isRequesting || permission === 'granted'}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {permission === 'granted' ? (
                  <>
                    <Check className="w-5 h-5" />
                    Notifications Enabled
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    {isRequesting ? 'Requesting...' : 'Enable Notifications'}
                  </>
                )}
              </button>

              <button
                onClick={handleSkip}
                disabled={isRequesting}
                className="flex-1 sm:flex-none bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Skip for Now
              </button>
            </motion.div>

            {/* Additional Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4"
            >
              You can always enable notifications later in your account settings
            </motion.p>
          </div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-50"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-2xl opacity-50"
        />
      </motion.div>
    </div>
  );
};

export default NotificationPermission;
