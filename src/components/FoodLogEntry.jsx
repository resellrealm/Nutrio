import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Clock } from 'lucide-react';

const FoodLogEntry = ({ entry, onEdit, onDelete }) => {
  const getMealIcon = (type) => {
    switch(type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍿';
      default: return '🍽️';
    }
  };

  const getMealTypeColor = (type) => {
    switch(type) {
      case 'breakfast': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'lunch': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'dinner': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'snack': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    // Handle Firestore Timestamp
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const nutrition = entry.food?.nutrition || {};
  const servings = entry.food?.servingsConsumed || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Food Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Meal Icon */}
          <div className="text-3xl flex-shrink-0">
            {getMealIcon(entry.mealType)}
          </div>

          {/* Food Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                {entry.food?.name || 'Unknown Food'}
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getMealTypeColor(entry.mealType)}`}>
                {entry.mealType}
              </span>
            </div>

            {entry.food?.brand && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {entry.food.brand}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              {entry.timestamp && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatTime(entry.timestamp)}
                </span>
              )}
              {servings !== 1 && (
                <>
                  <span>•</span>
                  <span>{servings}x servings</span>
                </>
              )}
              {entry.source && (
                <>
                  <span>•</span>
                  <span className="capitalize">{entry.source}</span>
                </>
              )}
            </div>

            {/* Nutrition Summary */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg">
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {Math.round(nutrition.calories || 0)}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-500 ml-1">cal</span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                  {Math.round(nutrition.protein || 0)}g
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-500 ml-1">protein</span>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-lg">
                <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                  {Math.round(nutrition.carbs || 0)}g
                </span>
                <span className="text-xs text-orange-600 dark:text-orange-500 ml-1">carbs</span>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-lg">
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  {Math.round(nutrition.fat || 0)}g
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-500 ml-1">fat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            title="Edit entry"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(entry)}
            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            title="Delete entry"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Image if available */}
      {entry.food?.imageUrl && entry.source === 'photo' && (
        <div className="mt-3 rounded-lg overflow-hidden">
          <img
            src={entry.food.imageUrl}
            alt={entry.food.name}
            className="w-full h-32 object-cover"
          />
        </div>
      )}
    </motion.div>
  );
};

export default FoodLogEntry;
