import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActivityLevel } from '../../store/onboardingSlice';

const Step5Activity = () => {
  const dispatch = useDispatch();
  const selectedLevel = useSelector(state => state.onboarding.activityLevel);

  const levels = [
    {
      id: 'sedentary',
      label: 'Sedentary',
      description: 'Little to no exercise',
      examples: 'Desk job, minimal daily movement'
    },
    {
      id: 'lightly_active',
      label: 'Lightly Active',
      description: '1-3 days/week',
      examples: 'Light exercise or sports 1-3 days/week'
    },
    {
      id: 'moderately_active',
      label: 'Moderately Active',
      description: '3-5 days/week',
      examples: 'Moderate exercise 3-5 days/week'
    },
    {
      id: 'very_active',
      label: 'Very Active',
      description: '6-7 days/week',
      examples: 'Hard exercise 6-7 days/week'
    },
    {
      id: 'extremely_active',
      label: 'Extremely Active',
      description: 'Athlete or physical job',
      examples: 'Very hard exercise daily, physical job, or training twice per day'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">How active are you?</h3>
        <p className="text-gray-600">This helps us calculate your calorie needs</p>
      </div>

      <div className="space-y-3">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => dispatch(setActivityLevel(level.id))}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              selectedLevel === level.id
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className={selectedLevel === level.id ? 'text-primary' : 'text-gray-400'} size={20} />
                  <h4 className="font-semibold text-gray-800">{level.label}</h4>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">{level.description}</p>
                <p className="text-xs text-gray-500">{level.examples}</p>
              </div>
              {selectedLevel === level.id && (
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Step5Activity;
