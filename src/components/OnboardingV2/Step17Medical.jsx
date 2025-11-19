import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setMedicalConditions } from '../../store/onboardingSlice';

const Step17Medical = () => {
  const dispatch = useDispatch();
  const conditions = useSelector(state => state.onboarding.medicalConditions);

  const medicalConditions = [
    { id: 'none', label: 'None', icon: '✓' },
    { id: 'diabetes_type1', label: 'Diabetes Type 1', icon: '💉' },
    { id: 'diabetes_type2', label: 'Diabetes Type 2', icon: '🩸' },
    { id: 'high_bp', label: 'High Blood Pressure', icon: '❤️' },
    { id: 'high_cholesterol', label: 'High Cholesterol', icon: '📊' },
    { id: 'heart_disease', label: 'Heart Disease', icon: '💓' },
    { id: 'pcos', label: 'PCOS', icon: '🔬' },
    { id: 'thyroid', label: 'Thyroid Issues', icon: '🦋' },
    { id: 'ibs', label: 'IBS/Digestive Issues', icon: '🌀' }
  ];

  const toggleCondition = (conditionId) => {
    const newConditions = conditions.includes(conditionId)
      ? conditions.filter(c => c !== conditionId)
      : [...conditions, conditionId];
    dispatch(setMedicalConditions(newConditions));
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Any health conditions we should know about?</h3>
        <p className="text-gray-600">This step is optional but helps us provide better recommendations</p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3">
        <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-blue-800">
          <strong>Privacy Notice:</strong> This information helps us provide better recommendations. Your data is private and secure.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {medicalConditions.map((condition) => (
          <button key={condition.id} onClick={() => toggleCondition(condition.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              conditions.includes(condition.id) ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-gray-300'
            }`}>
            <div className="text-2xl mb-2">{condition.icon}</div>
            <div className="text-sm font-medium text-gray-800">{condition.label}</div>
          </button>
        ))}
      </div>

      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-sm text-gray-600">
          💡 You can skip this step if you prefer not to share health information
        </p>
      </div>
    </motion.div>
  );
};

export default Step17Medical;
