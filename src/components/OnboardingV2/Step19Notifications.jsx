import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotifications } from '../../store/onboardingSlice';

const Step19Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.onboarding.notifications);
  const [localData, setLocalData] = useState(notifications);

  const handleToggle = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    dispatch(setNotifications(newData));
  };

  const handleNestedToggle = (field, subfield, value) => {
    const newData = {
      ...localData,
      [field]: { ...localData[field], [subfield]: value }
    };
    setLocalData(newData);
    dispatch(setNotifications(newData));
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">How can we help you stay on track?</h3>
        <p className="text-gray-600">Choose your notification preferences (you can change these later)</p>
      </div>

      <div className="space-y-4">
        {/* Meal Reminders */}
        <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="text-primary" size={20} />
              <div>
                <div className="font-medium text-gray-800">Daily Meal Reminders</div>
                <div className="text-sm text-gray-600">Get notified at meal times</div>
              </div>
            </div>
            <input type="checkbox" checked={localData.mealReminders.enabled}
              onChange={(e) => handleNestedToggle('mealReminders', 'enabled', e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
          </label>
        </div>

        {/* Water Reminders */}
        <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="text-blue-500" size={20} />
              <div>
                <div className="font-medium text-gray-800">Water Intake Reminders</div>
                <div className="text-sm text-gray-600">Stay hydrated throughout the day</div>
              </div>
            </div>
            <input type="checkbox" checked={localData.waterReminders.enabled}
              onChange={(e) => handleNestedToggle('waterReminders', 'enabled', e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
          </label>
        </div>

        {/* Grocery Reminders */}
        <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="text-green-500" size={20} />
              <div>
                <div className="font-medium text-gray-800">Grocery List Reminders</div>
                <div className="text-sm text-gray-600">Weekly shopping reminders</div>
              </div>
            </div>
            <input type="checkbox" checked={localData.groceryReminders.enabled}
              onChange={(e) => handleNestedToggle('groceryReminders', 'enabled', e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
          </label>
        </div>

        {/* Progress Check-ins */}
        <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="text-purple-500" size={20} />
              <div>
                <div className="font-medium text-gray-800">Progress Check-ins</div>
                <div className="text-sm text-gray-600">Weekly progress updates</div>
              </div>
            </div>
            <input type="checkbox" checked={localData.progressCheckIns.enabled}
              onChange={(e) => handleNestedToggle('progressCheckIns', 'enabled', e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
          </label>
        </div>

        {/* Recipe Suggestions */}
        <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="text-orange-500" size={20} />
              <div>
                <div className="font-medium text-gray-800">Recipe Suggestions</div>
                <div className="text-sm text-gray-600">Discover new meals</div>
              </div>
            </div>
            <input type="checkbox" checked={localData.recipeSuggestions}
              onChange={(e) => handleToggle('recipeSuggestions', e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
          </label>
        </div>

        {/* Achievement Notifications */}
        <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="text-yellow-500" size={20} />
              <div>
                <div className="font-medium text-gray-800">Achievement Notifications</div>
                <div className="text-sm text-gray-600">Celebrate your wins!</div>
              </div>
            </div>
            <input type="checkbox" checked={localData.achievements}
              onChange={(e) => handleToggle('achievements', e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
          </label>
        </div>
      </div>

      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-sm text-gray-600 flex items-center">
          <BellOff className="mr-2" size={14} />
          You can change these settings anytime in your account
        </p>
      </div>
    </motion.div>
  );
};

export default Step19Notifications;
