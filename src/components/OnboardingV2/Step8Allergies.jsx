import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAllergy } from '../../store/onboardingSlice';

const Step8Allergies = () => {
  const dispatch = useDispatch();
  const selected = useSelector(state => state.onboarding.allergies);
  const [customAllergy, setCustomAllergy] = useState('');

  const allergies = [
    { id: 'none', label: 'None', icon: '✓' },
    { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
    { id: 'tree_nuts', label: 'Tree Nuts', icon: '🌰' },
    { id: 'shellfish', label: 'Shellfish', icon: '🦞' },
    { id: 'fish', label: 'Fish', icon: '🐟' },
    { id: 'eggs', label: 'Eggs', icon: '🥚' },
    { id: 'dairy', label: 'Dairy/Lactose', icon: '🥛' },
    { id: 'soy', label: 'Soy', icon: '🫘' },
    { id: 'wheat', label: 'Wheat/Gluten', icon: '🌾' },
    { id: 'sesame', label: 'Sesame', icon: '🫙' }
  ];

  const handleAddCustom = () => {
    if (customAllergy.trim()) {
      dispatch(toggleAllergy(`other:${customAllergy.trim()}`));
      setCustomAllergy('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Food Allergies & Intolerances</h3>
        <p className="text-gray-600">Any food allergies or intolerances we should know about?</p>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start space-x-3">
        <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-yellow-800">
          This is important for your safety. We'll exclude these ingredients from all meal recommendations.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allergies.map((allergy) => (
          <button
            key={allergy.id}
            onClick={() => dispatch(toggleAllergy(allergy.id))}
            className={`p-4 rounded-xl border-2 transition-all ${
              selected.includes(allergy.id)
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">{allergy.icon}</div>
            <div className="text-sm font-medium text-gray-800">{allergy.label}</div>
          </button>
        ))}
      </div>

      {/* Custom allergy input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Other Allergies
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Avocado, Strawberries"
          />
          <button
            onClick={handleAddCustom}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Show custom allergies */}
      {selected.filter(a => a.startsWith('other:')).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.filter(a => a.startsWith('other:')).map((allergy) => (
            <div
              key={allergy}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{allergy.replace('other:', '')}</span>
              <button
                onClick={() => dispatch(toggleAllergy(allergy))}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Step8Allergies;
