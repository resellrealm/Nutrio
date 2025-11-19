import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Minus, TrendingUp, Heart, Activity, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setPrimaryGoal } from '../../store/onboardingSlice';

const Step3PrimaryGoal = () => {
  const dispatch = useDispatch();
  const selectedGoal = useSelector(state => state.onboarding.primaryGoal);

  const goals = [
    {
      id: 'lose_weight',
      label: 'Lose Weight',
      icon: TrendingDown,
      color: 'from-blue-500 to-blue-600',
      description: 'Achieve a healthier weight through balanced nutrition'
    },
    {
      id: 'maintain',
      label: 'Maintain Weight',
      icon: Minus,
      color: 'from-green-500 to-green-600',
      description: 'Keep your current weight stable with good habits'
    },
    {
      id: 'gain_muscle',
      label: 'Gain Weight/Muscle',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      description: 'Build muscle mass with proper nutrition'
    },
    {
      id: 'improve_health',
      label: 'Improve Overall Health',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      description: 'Focus on general wellness and healthy eating'
    },
    {
      id: 'manage_condition',
      label: 'Manage Medical Condition',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      description: 'Dietary support for health conditions'
    },
    {
      id: 'athletic_performance',
      label: 'Athletic Performance',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Optimize nutrition for sports and fitness'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">What's your main goal?</h3>
        <p className="text-gray-600">This helps us create the perfect plan for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const Icon = goal.icon;
          return (
            <button
              key={goal.id}
              onClick={() => dispatch(setPrimaryGoal(goal.id))}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedGoal === goal.id
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{goal.label}</h4>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Step3PrimaryGoal;
