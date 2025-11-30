import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader } from 'lucide-react';

const EditFoodModal = ({ entry, isOpen, onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    servingsConsumed: 1,
    mealType: 'lunch',
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    }
  });

  // Initialize form data when entry changes
  useEffect(() => {
    if (entry) {
      setFormData({
        servingsConsumed: entry.food?.servingsConsumed || 1,
        mealType: entry.mealType || 'lunch',
        nutrition: {
          calories: entry.food?.nutrition?.calories || 0,
          protein: entry.food?.nutrition?.protein || 0,
          carbs: entry.food?.nutrition?.carbs || 0,
          fat: entry.food?.nutrition?.fat || 0,
          fiber: entry.food?.nutrition?.fiber || 0,
          sugar: entry.food?.nutrition?.sugar || 0,
          sodium: entry.food?.nutrition?.sodium || 0
        }
      });
    }
  }, [entry]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(entry.id, formData);
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServingsChange = (newServings) => {
    // Store the base nutrition values (per serving)
    const baseNutrition = entry.food?.nutrition || {};
    const currentServings = entry.food?.servingsConsumed || 1;

    // Calculate nutrition per single serving
    const perServingNutrition = {
      calories: (baseNutrition.calories || 0) / currentServings,
      protein: (baseNutrition.protein || 0) / currentServings,
      carbs: (baseNutrition.carbs || 0) / currentServings,
      fat: (baseNutrition.fat || 0) / currentServings,
      fiber: (baseNutrition.fiber || 0) / currentServings,
      sugar: (baseNutrition.sugar || 0) / currentServings,
      sodium: (baseNutrition.sodium || 0) / currentServings
    };

    // Calculate new total nutrition based on new servings
    const newNutrition = {
      calories: Math.round(perServingNutrition.calories * newServings),
      protein: Math.round(perServingNutrition.protein * newServings),
      carbs: Math.round(perServingNutrition.carbs * newServings),
      fat: Math.round(perServingNutrition.fat * newServings),
      fiber: Math.round(perServingNutrition.fiber * newServings),
      sugar: Math.round(perServingNutrition.sugar * newServings),
      sodium: Math.round(perServingNutrition.sodium * newServings)
    };

    setFormData(prev => ({
      ...prev,
      servingsConsumed: newServings,
      nutrition: newNutrition
    }));
  };

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '☀️' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' },
    { id: 'snack', label: 'Snack', icon: '🍿' }
  ];

  if (!entry) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Food Entry
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Food Name (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Food Name
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white">
                    {entry.food?.name || 'Unknown Food'}
                  </div>
                  {entry.food?.brand && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Brand: {entry.food.brand}
                    </p>
                  )}
                </div>

                {/* Servings Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Servings Consumed: {formData.servingsConsumed}x
                  </label>
                  <input
                    type="range"
                    min="0.25"
                    max="5"
                    step="0.25"
                    value={formData.servingsConsumed}
                    onChange={(e) => handleServingsChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>0.25</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Meal Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Meal Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {mealTypes.map((meal) => (
                      <button
                        key={meal.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mealType: meal.id }))}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.mealType === meal.id
                            ? 'border-primary bg-primary/10 dark:bg-primary/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="text-2xl mb-1">{meal.icon}</div>
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {meal.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nutrition Display (Auto-calculated based on servings) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Nutrition Facts (Total)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Calories</p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {formData.nutrition.calories}
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Protein</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {formData.nutrition.protein}g
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                      <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Carbs</p>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {formData.nutrition.carbs}g
                      </p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                      <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Fat</p>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                        {formData.nutrition.fat}g
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditFoodModal;
