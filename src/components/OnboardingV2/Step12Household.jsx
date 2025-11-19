import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Baby } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setHousehold } from '../../store/onboardingSlice';

const Step12Household = () => {
  const dispatch = useDispatch();
  const household = useSelector(state => state.onboarding.household);
  const error = useSelector(state => state.onboarding.errors[12]);

  const [localData, setLocalData] = useState(household);

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };

    // Auto-adjust children ages array when count changes
    if (field === 'childrenCount') {
      const currentAges = newData.childrenAges || [];
      if (value > currentAges.length) {
        newData.childrenAges = [...currentAges, ...Array(value - currentAges.length).fill(0)];
      } else {
        newData.childrenAges = currentAges.slice(0, value);
      }
    }

    // Update has children based on count
    if (field === 'childrenCount') {
      newData.hasChildren = value > 0;
    }

    setLocalData(newData);
    dispatch(setHousehold(newData));
  };

  const handleChildAgeChange = (index, age) => {
    const newAges = [...localData.childrenAges];
    newAges[index] = parseInt(age) || 0;
    const newData = { ...localData, childrenAges: newAges };
    setLocalData(newData);
    dispatch(setHousehold(newData));
  };

  const toggleFeedingOthers = (option) => {
    const feedingOthers = localData.feedingOthers.includes(option)
      ? localData.feedingOthers.filter(o => o !== option)
      : [...localData.feedingOthers, option];
    const newData = { ...localData, feedingOthers };
    setLocalData(newData);
    dispatch(setHousehold(newData));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Who are you shopping for?</h3>
        <p className="text-gray-600">This helps us scale recipes and grocery lists appropriately</p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          🛒 <strong>Important:</strong> We use this to calculate proper grocery quantities for your household
        </p>
      </div>

      {/* Total Household Members */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Users className="inline mr-2" size={16} />
          Total number of people in household: {localData.totalMembers}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={localData.totalMembers}
          onChange={(e) => handleChange('totalMembers', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>5</span>
          <span>10+</span>
        </div>
      </div>

      {/* Children Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Baby className="inline mr-2" size={16} />
          How many children? {localData.childrenCount}
        </label>
        <input
          type="range"
          min="0"
          max={localData.totalMembers}
          value={localData.childrenCount}
          onChange={(e) => handleChange('childrenCount', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Children Ages */}
      {localData.hasChildren && localData.childrenCount > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Ages of children
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: localData.childrenCount }, (_, i) => (
              <div key={i}>
                <label className="text-xs text-gray-600 mb-1 block">Child {i + 1}</label>
                <input
                  type="number"
                  min="0"
                  max="18"
                  value={localData.childrenAges[i] || 0}
                  onChange={(e) => handleChildAgeChange(i, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Age"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Who else are you feeding */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Who else are you feeding?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['just_myself', 'partner', 'family', 'housemates', 'friends'].map((option) => (
            <button
              key={option}
              onClick={() => toggleFeedingOthers(option)}
              className={`p-3 rounded-xl border-2 transition-all ${
                localData.feedingOthers.includes(option)
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-800 capitalize">
                {option.replace('_', ' ')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
        <p className="text-sm text-green-800">
          <strong>Summary:</strong> {localData.totalMembers} people total
          {localData.hasChildren && ` (${localData.childrenCount} ${localData.childrenCount === 1 ? 'child' : 'children'})`}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
    </motion.div>
  );
};

export default Step12Household;
