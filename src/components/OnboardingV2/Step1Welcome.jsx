import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, TrendingUp } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { acknowledgeWelcome } from '../../store/onboardingSlice';

const Step1Welcome = ({ onNext }) => {
  const dispatch = useDispatch();

  const handleGetStarted = () => {
    dispatch(acknowledgeWelcome());
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-xl"
        >
          <Sparkles className="text-white" size={48} />
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-800">
          Welcome to Nutrio!
        </h2>

        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Let's personalize your nutrition journey. We'll ask you a few questions to create a customized plan just for you.
        </p>
      </div>

      <div className="space-y-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingUp className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Personalized Goals</h3>
            <p className="text-sm text-gray-600">Track your progress and achieve your health goals</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="text-accent" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Smart Meal Planning</h3>
            <p className="text-sm text-gray-600">Get customized meal plans based on your preferences</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Grocery Lists & Budgeting</h3>
            <p className="text-sm text-gray-600">Automatically generated shopping lists within your budget</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">
          This will take about 5-7 minutes
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          Get Started
        </button>
      </div>
    </motion.div>
  );
};

export default Step1Welcome;
