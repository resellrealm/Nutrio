import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setBudget } from '../../store/onboardingSlice';

const Step13Budget = () => {
  const dispatch = useDispatch();
  const budget = useSelector(state => state.onboarding.budget);
  const household = useSelector(state => state.onboarding.household);
  const error = useSelector(state => state.onboarding.errors[13]);

  const [localData, setLocalData] = useState(budget);

  const currencies = [
    { id: 'USD', symbol: '$', label: 'USD' },
    { id: 'EUR', symbol: '€', label: 'EUR' },
    { id: 'GBP', symbol: '£', label: 'GBP' },
    { id: 'CAD', symbol: 'C$', label: 'CAD' },
    { id: 'AUD', symbol: 'A$', label: 'AUD' }
  ];

  const priorities = [
    {
      id: 'strict',
      label: 'Strict',
      description: 'Stay within budget, suggest alternatives',
      icon: '🎯'
    },
    {
      id: 'flexible',
      label: 'Flexible',
      description: 'Can go over by 10-15%',
      icon: '↔️'
    },
    {
      id: 'no_limit',
      label: 'No Limit',
      description: 'Show cost but don\'t restrict',
      icon: '∞'
    }
  ];

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    dispatch(setBudget(newData));
  };

  const getCurrentCurrency = () => {
    return currencies.find(c => c.id === localData.currency) || currencies[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">What's your weekly grocery budget?</h3>
        <p className="text-gray-600">We'll help you stay within budget with smart recommendations</p>
      </div>

      <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
        <p className="text-sm text-purple-800">
          💰 <strong>Budget-Smart Shopping:</strong> We'll suggest cheaper alternatives and bulk-buy options when you're over budget
        </p>
      </div>

      {/* Currency Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Currency
        </label>
        <div className="grid grid-cols-5 gap-2">
          {currencies.map((currency) => (
            <button
              key={currency.id}
              onClick={() => handleChange('currency', currency.id)}
              className={`p-3 rounded-xl border-2 transition-all ${
                localData.currency === currency.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-lg font-bold">{currency.symbol}</div>
              <div className="text-xs text-gray-600">{currency.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <DollarSign className="inline mr-2" size={16} />
          Weekly Budget: {getCurrentCurrency().symbol}{localData.weekly}
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="20"
            max="500"
            step="10"
            value={localData.weekly}
            onChange={(e) => handleChange('weekly', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <input
            type="number"
            value={localData.weekly}
            onChange={(e) => handleChange('weekly', parseInt(e.target.value) || 0)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center font-semibold"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{getCurrentCurrency().symbol}20</span>
          <span>{getCurrentCurrency().symbol}250</span>
          <span>{getCurrentCurrency().symbol}500+</span>
        </div>
      </div>

      {/* Per Person Calculation */}
      {household.totalMembers > 0 && localData.weekly > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-800">
              <TrendingUp className="inline mr-1" size={14} />
              Per person per week:
            </span>
            <span className="font-bold text-green-900">
              {getCurrentCurrency().symbol}{Math.round(localData.weekly / household.totalMembers)}
            </span>
          </div>
        </div>
      )}

      {/* Budget Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Budget Priority
        </label>
        <div className="space-y-3">
          {priorities.map((priority) => (
            <button
              key={priority.id}
              onClick={() => handleChange('priority', priority.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                localData.priority === priority.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{priority.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{priority.label}</h4>
                    <p className="text-sm text-gray-600">{priority.description}</p>
                  </div>
                </div>
                {localData.priority === priority.id && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
    </motion.div>
  );
};

export default Step13Budget;
