import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setTimeline } from '../../store/onboardingSlice';

const Step4Timeline = () => {
  const dispatch = useDispatch();
  const selectedTimeline = useSelector(state => state.onboarding.timeline);

  const timelines = [
    { id: '1-3_months', label: '1-3 months', description: 'Quick results' },
    { id: '3-6_months', label: '3-6 months', description: 'Sustainable progress' },
    { id: '6-12_months', label: '6-12 months', description: 'Long-term transformation' },
    { id: '1+_year', label: '1+ year', description: 'Gradual lifestyle change' },
    { id: 'no_timeline', label: 'No specific timeline', description: 'Flexible approach' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">What's your target timeline?</h3>
        <p className="text-gray-600">When would you like to reach your goal?</p>
      </div>

      <div className="space-y-3">
        {timelines.map((timeline) => (
          <button
            key={timeline.id}
            onClick={() => dispatch(setTimeline(timeline.id))}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              selectedTimeline === timeline.id
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className={selectedTimeline === timeline.id ? 'text-primary' : 'text-gray-400'} size={20} />
                <div>
                  <h4 className="font-semibold text-gray-800">{timeline.label}</h4>
                  <p className="text-sm text-gray-600">{timeline.description}</p>
                </div>
              </div>
              {selectedTimeline === timeline.id && (
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Step4Timeline;
