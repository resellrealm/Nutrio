import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCuisinePreference } from '../../store/onboardingSlice';

const Step9CuisinePreferences = () => {
  const dispatch = useDispatch();
  const selected = useSelector(state => state.onboarding.cuisinePreferences);
  const error = useSelector(state => state.onboarding.errors[9]);

  const cuisines = [
    { id: 'italian', label: 'Italian', icon: '🍝', color: 'from-green-500 to-red-500' },
    { id: 'mexican', label: 'Mexican', icon: '🌮', color: 'from-yellow-500 to-red-600' },
    { id: 'asian', label: 'Asian', icon: '🍜', color: 'from-red-600 to-orange-500' },
    { id: 'indian', label: 'Indian', icon: '🍛', color: 'from-orange-600 to-yellow-500' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🥗', color: 'from-blue-500 to-green-500' },
    { id: 'middle_eastern', label: 'Middle Eastern', icon: '🥙', color: 'from-purple-500 to-pink-500' },
    { id: 'american', label: 'American', icon: '🍔', color: 'from-red-500 to-blue-500' },
    { id: 'french', label: 'French', icon: '🥐', color: 'from-blue-600 to-red-600' },
    { id: 'caribbean', label: 'Caribbean', icon: '🍹', color: 'from-green-400 to-blue-400' },
    { id: 'african', label: 'African', icon: '🍲', color: 'from-orange-500 to-green-600' },
    { id: 'latin_american', label: 'Latin American', icon: '🫔', color: 'from-red-500 to-green-600' },
    { id: 'european', label: 'European', icon: '🧀', color: 'from-blue-500 to-purple-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">What cuisines do you enjoy?</h3>
        <p className="text-gray-600">
          <Globe className="inline mr-1" size={16} />
          Select at least 3 cuisines - this helps us personalize your grocery lists
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Selected: {selected.length}/12</strong> {selected.length >= 3 ? '✓' : `(Need ${3 - selected.length} more)`}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine.id}
            onClick={() => dispatch(toggleCuisinePreference(cuisine.id))}
            className={`p-4 rounded-xl border-2 transition-all ${
              selected.includes(cuisine.id)
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cuisine.color} flex items-center justify-center mx-auto mb-2`}>
              <span className="text-2xl">{cuisine.icon}</span>
            </div>
            <div className="text-sm font-medium text-gray-800">{cuisine.label}</div>
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
    </motion.div>
  );
};

export default Step9CuisinePreferences;
