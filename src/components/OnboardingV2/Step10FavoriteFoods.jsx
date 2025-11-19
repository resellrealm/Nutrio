import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setFavoriteIngredients } from '../../store/onboardingSlice';

const Step10FavoriteFoods = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.onboarding.favoriteIngredients);
  const error = useSelector(state => state.onboarding.errors[10]);

  const [activeCategory, setActiveCategory] = useState('proteins');

  const foodCategories = {
    proteins: {
      label: 'Proteins',
      icon: '🍖',
      minRequired: 1,
      items: ['chicken', 'beef', 'fish', 'tofu', 'pork', 'turkey', 'lamb', 'eggs', 'shrimp', 'salmon']
    },
    vegetables: {
      label: 'Vegetables',
      icon: '🥬',
      minRequired: 5,
      items: ['broccoli', 'spinach', 'carrots', 'tomatoes', 'peppers', 'onions', 'garlic', 'mushrooms', 'zucchini', 'cauliflower', 'lettuce', 'cucumber', 'asparagus', 'kale', 'celery']
    },
    fruits: {
      label: 'Fruits',
      icon: '🍎',
      minRequired: 3,
      items: ['apples', 'bananas', 'berries', 'oranges', 'grapes', 'mango', 'pineapple', 'avocado', 'strawberries', 'blueberries', 'watermelon', 'peaches']
    },
    grains: {
      label: 'Grains',
      icon: '🌾',
      minRequired: 0,
      items: ['rice', 'pasta', 'bread', 'quinoa', 'oats', 'couscous', 'tortillas', 'barley']
    },
    snacks: {
      label: 'Snacks',
      icon: '🍿',
      minRequired: 0,
      items: ['nuts', 'yogurt', 'cheese', 'crackers', 'hummus', 'protein_bars', 'dark_chocolate', 'popcorn']
    }
  };

  const toggleItem = (category, item) => {
    const currentItems = favorites[category] || [];
    const newItems = currentItems.includes(item)
      ? currentItems.filter(i => i !== item)
      : [...currentItems, item];

    dispatch(setFavoriteIngredients({ [category]: newItems }));
  };

  const getCategoryProgress = (category) => {
    const selected = (favorites[category] || []).length;
    const required = foodCategories[category].minRequired;
    return { selected, required, met: selected >= required };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">What are your favorite foods?</h3>
        <p className="text-gray-600">Select foods you love - we'll prioritize them in meal plans</p>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {Object.keys(foodCategories).map((category) => {
          const progress = getCategoryProgress(category);
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{foodCategories[category].icon}</span>
              {foodCategories[category].label}
              <span className={`ml-2 text-xs ${progress.met ? 'opacity-100' : 'opacity-60'}`}>
                ({progress.selected}{progress.required > 0 ? `/${progress.required}` : ''})
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Requirements:</strong> 1+ protein, 5+ vegetables, 3+ fruits
        </p>
      </div>

      {/* Food Items */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {foodCategories[activeCategory].items.map((item) => (
          <button
            key={item}
            onClick={() => toggleItem(activeCategory, item)}
            className={`p-3 rounded-xl border-2 transition-all ${
              (favorites[activeCategory] || []).includes(item)
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-sm font-medium text-gray-800 capitalize">
              {item.replace('_', ' ')}
            </div>
            {(favorites[activeCategory] || []).includes(item) && (
              <Heart className="text-primary mx-auto mt-1" size={16} fill="currentColor" />
            )}
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

export default Step10FavoriteFoods;
