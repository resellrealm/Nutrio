import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsDown, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setDislikedFoods } from '../../store/onboardingSlice';

const Step11DislikedFoods = () => {
  const dispatch = useDispatch();
  const dislikedFoods = useSelector(state => state.onboarding.dislikedFoods);
  const [customFood, setCustomFood] = useState('');

  const commonDislikes = [
    'liver', 'olives', 'cilantro', 'blue_cheese', 'anchovies',
    'mushrooms', 'brussels_sprouts', 'beets', 'tofu', 'seafood',
    'spicy_foods', 'pickles', 'eggplant', 'cottage_cheese', 'oysters'
  ];

  const toggleFood = (food) => {
    const newDislikes = dislikedFoods.includes(food)
      ? dislikedFoods.filter(f => f !== food)
      : [...dislikedFoods, food];
    dispatch(setDislikedFoods(newDislikes));
  };

  const handleAddCustom = () => {
    if (customFood.trim() && !dislikedFoods.includes(customFood.trim())) {
      dispatch(setDislikedFoods([...dislikedFoods, customFood.trim()]));
      setCustomFood('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Any foods you dislike or want to avoid?</h3>
        <p className="text-gray-600">We'll exclude these from your meal recommendations (optional)</p>
      </div>

      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-sm text-gray-600">
          Selected: <strong>{dislikedFoods.length}</strong> items
        </p>
      </div>

      {/* Common Dislikes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Common Foods to Avoid
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonDislikes.map((food) => (
            <button
              key={food}
              onClick={() => toggleFood(food)}
              className={`p-3 rounded-xl border-2 transition-all ${
                dislikedFoods.includes(food)
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-800 capitalize">
                {food.replace('_', ' ')}
              </div>
              {dislikedFoods.includes(food) && (
                <ThumbsDown className="text-red-500 mx-auto mt-1" size={16} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Other Foods to Avoid
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={customFood}
            onChange={(e) => setCustomFood(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Mayonnaise, Raw onions"
          />
          <button
            onClick={handleAddCustom}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Show custom foods */}
      {dislikedFoods.filter(f => !commonDislikes.includes(f)).length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Custom Dislikes
          </label>
          <div className="flex flex-wrap gap-2">
            {dislikedFoods.filter(f => !commonDislikes.includes(f)).map((food) => (
              <div
                key={food}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{food}</span>
                <button
                  onClick={() => toggleFood(food)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> This step is optional. You can skip it or add items later in settings.
        </p>
      </div>
    </motion.div>
  );
};

export default Step11DislikedFoods;
