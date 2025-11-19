import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDietaryRestriction } from '../../store/onboardingSlice';

const Step7DietaryRestrictions = () => {
  const dispatch = useDispatch();
  const selected = useSelector(state => state.onboarding.dietaryRestrictions);

  const restrictions = [
    { id: 'none', label: 'None', icon: '✓' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'pescatarian', label: 'Pescatarian', icon: '🐟' },
    { id: 'omnivore', label: 'Omnivore', icon: '🍖' },
    { id: 'paleo', label: 'Paleo', icon: '🥩' },
    { id: 'keto', label: 'Keto', icon: '🥑' },
    { id: 'low_carb', label: 'Low-Carb', icon: '🔻' },
    { id: 'gluten_free', label: 'Gluten-Free', icon: '🌾' },
    { id: 'dairy_free', label: 'Dairy-Free', icon: '🥛' },
    { id: 'halal', label: 'Halal', icon: '☪️' },
    { id: 'kosher', label: 'Kosher', icon: '✡️' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Dietary Restrictions & Preferences</h3>
        <p className="text-gray-600">Do you follow any dietary restrictions? (Select all that apply)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {restrictions.map((restriction) => (
          <button
            key={restriction.id}
            onClick={() => dispatch(toggleDietaryRestriction(restriction.id))}
            className={`p-4 rounded-xl border-2 transition-all ${
              selected.includes(restriction.id)
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">{restriction.icon}</div>
            <div className="text-sm font-medium text-gray-800">{restriction.label}</div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Step7DietaryRestrictions;
