import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ToasterLoading from '../components/ToasterLoading';

const ToasterDemo = () => {
  const [showToaster, setShowToaster] = useState(false);
  const [duration, setDuration] = useState(5000);

  const handleStart = () => {
    setShowToaster(true);
  };

  const handleComplete = () => {
    setShowToaster(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center p-8">
      {showToaster && (
        <ToasterLoading
          onLoadingComplete={handleComplete}
          duration={duration}
        />
      )}

      {!showToaster && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🍞</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Toaster Loading Demo
            </h1>
            <p className="text-gray-600 text-lg">
              Get ready for the most epic loading experience!
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Animated Toaster</strong> with glowing heating elements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Toast Animation</strong> that rises and pops out with physics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Steam Particles</strong> floating up from the toaster</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Sound Effects</strong> - ticking and a satisfying "ding!"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Happy Toast Face</strong> that appears when toasting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Countdown Timer</strong> showing seconds remaining</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span><strong>Sparkle Explosion</strong> when the toast pops!</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-semibold mb-2 block">
                  Duration (milliseconds)
                </span>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="2000"
                    max="10000"
                    step="500"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="font-mono font-bold text-primary-700 min-w-[80px]">
                    {duration}ms
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  ({(duration / 1000).toFixed(1)} seconds)
                </p>
              </label>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-lg"
          >
            🍞 Start Toasting!
          </motion.button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Click the button to see the magic happen!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ToasterDemo;
