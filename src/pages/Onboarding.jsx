import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Scale,
  Target,
  Activity,
  Utensils,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { updateOnboardingProgress, completeOnboarding, calculateAllMetrics } from '../services/userService';

const Onboarding = () => {
  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.user?.id);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Basic Info (Step 1)
    fullName: '',
    dateOfBirth: '',
    gender: '',

    // Physical Stats (Step 2)
    height: '',
    heightUnit: 'cm',
    currentWeight: '',
    targetWeight: '',
    weightUnit: 'kg',

    // Goals (Step 3)
    primary: '',
    timeline: '',
    activityLevel: '',

    // Dietary Preferences (Step 4)
    restrictions: [],
    allergies: [],

    // Meal Preferences (Step 5)
    mealsPerDay: 3,
    snacksPerDay: 2,
    skillLevel: ''
  });

  const totalSteps = 5;

  // Update form data
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Toggle array values (for checkboxes)
  const toggleArrayValue = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  // Validate current step
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.gender) {
          toast.error('Please fill in all fields');
          return false;
        }
        break;
      case 2:
        if (!formData.height || !formData.currentWeight || !formData.targetWeight) {
          toast.error('Please fill in all measurements');
          return false;
        }
        break;
      case 3:
        if (!formData.primary || !formData.activityLevel) {
          toast.error('Please select your goals and activity level');
          return false;
        }
        break;
      case 4:
        // Dietary preferences are optional
        break;
      case 5:
        if (!formData.skillLevel) {
          toast.error('Please select your cooking skill level');
          return false;
        }
        break;
    }
    return true;
  };

  // Next step
  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);

      // Save progress to Firestore
      await updateOnboardingProgress(userId, currentStep, formData);
    } else {
      // Complete onboarding
      await handleComplete();
    }
  };

  // Previous step
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Complete onboarding
  const handleComplete = async () => {
    if (!userId) {
      toast.error('User not logged in');
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate age from date of birth
      const age = formData.dateOfBirth
        ? new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()
        : null;

      // Prepare profile data
      const profileData = {
        basicInfo: {
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth || null,
          age,
          gender: formData.gender,
          height: {
            value: parseFloat(formData.height),
            unit: formData.heightUnit
          },
          currentWeight: {
            value: parseFloat(formData.currentWeight),
            unit: formData.weightUnit
          },
          targetWeight: {
            value: parseFloat(formData.targetWeight),
            unit: formData.weightUnit
          }
        },
        goals: {
          primary: formData.primary,
          timeline: formData.timeline || '',
          activityLevel: formData.activityLevel
        },
        dietary: {
          restrictions: formData.restrictions,
          allergies: formData.allergies
        },
        mealTiming: {
          mealsPerDay: formData.mealsPerDay,
          snacksPerDay: formData.snacksPerDay
        },
        cookingHabits: {
          skillLevel: formData.skillLevel,
          timeAvailable: { breakfast: 15, lunch: 30, dinner: 45 },
          preferredMethods: [],
          kitchenEquipment: []
        }
      };

      // Calculate metrics (BMI, TDEE, etc.)
      const calculatedMetrics = calculateAllMetrics(profileData);

      // Complete onboarding
      const result = await completeOnboarding(userId, calculatedMetrics);

      if (result.success) {
        toast.success('🎉 Welcome to Nutrio! Your profile is all set!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Let's get to know you!</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Tell us a bit about yourself</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender *</label>
              <div className="grid grid-cols-3 gap-3">
                {['male', 'female', 'other'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => updateField('gender', gender)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      formData.gender === gender
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Measurements</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">This helps us personalize your nutrition goals</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Height *</label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => updateField('height', e.target.value)}
                  placeholder="170"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                />
                <select
                  value={formData.heightUnit}
                  onChange={(e) => updateField('heightUnit', e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Weight *</label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  step="0.1"
                  value={formData.currentWeight}
                  onChange={(e) => updateField('currentWeight', e.target.value)}
                  placeholder="70"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                />
                <select
                  value={formData.weightUnit}
                  onChange={(e) => updateField('weightUnit', e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Weight *</label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetWeight}
                  onChange={(e) => updateField('targetWeight', e.target.value)}
                  placeholder="65"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                />
                <select
                  value={formData.weightUnit}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                  disabled
                >
                  <option value={formData.weightUnit}>{formData.weightUnit}</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Goals</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">What brings you to Nutrio?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Primary Goal *</label>
              <div className="space-y-3">
                {[
                  { value: 'lose_weight', label: 'Lose Weight', icon: '📉' },
                  { value: 'maintain_weight', label: 'Maintain Weight', icon: '⚖️' },
                  { value: 'gain_muscle', label: 'Build Muscle', icon: '💪' },
                  { value: 'eat_healthier', label: 'Eat Healthier', icon: '🥗' }
                ].map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => updateField('primary', goal.value)}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-3 ${
                      formData.primary === goal.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <span>{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Activity Level *</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => updateField('activityLevel', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select your activity level...</option>
                <option value="sedentary">Sedentary (little/no exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (athlete)</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dietary Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Help us tailor meal suggestions for you</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Dietary Restrictions (optional)</label>
              <div className="grid grid-cols-2 gap-3">
                {['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Keto', 'Paleo', 'Halal', 'Kosher'].map((restriction) => (
                  <button
                    key={restriction}
                    onClick={() => toggleArrayValue('restrictions', restriction)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      formData.restrictions.includes(restriction)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {restriction}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Common Allergies (optional)</label>
              <div className="grid grid-cols-2 gap-3">
                {['Nuts', 'Dairy', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Wheat', 'Gluten'].map((allergy) => (
                  <button
                    key={allergy}
                    onClick={() => toggleArrayValue('allergies', allergy)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      formData.allergies.includes(allergy)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Meal Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Almost done! Just a few more questions</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meals per day: {formData.mealsPerDay}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={formData.mealsPerDay}
                onChange={(e) => updateField('mealsPerDay', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Snacks per day: {formData.snacksPerDay}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.snacksPerDay}
                onChange={(e) => updateField('snacksPerDay', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cooking Skill Level *</label>
              <div className="space-y-3">
                {[
                  { value: 'beginner', label: 'Beginner', desc: 'Simple recipes with basic ingredients' },
                  { value: 'intermediate', label: 'Intermediate', desc: 'Comfortable with most cooking methods' },
                  { value: 'advanced', label: 'Advanced', desc: 'Love trying complex recipes' }
                ].map((skill) => (
                  <button
                    key={skill.value}
                    onClick={() => updateField('skillLevel', skill.value)}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all text-left ${
                      formData.skillLevel === skill.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div>{skill.label}</div>
                    <div className={`text-sm mt-1 ${formData.skillLevel === skill.value ? 'text-white/80' : 'text-gray-500'}`}>
                      {skill.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t dark:border-gray-700">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>{currentStep === totalSteps ? 'Complete' : 'Next'}</span>
              {currentStep === totalSteps ? (
                <Check size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>
        </motion.div>

        {/* Skip Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
