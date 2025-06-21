
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Coins, ChefHat } from 'lucide-react';

interface CompletionAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  coinsEarned: number;
  levelCompleted: number;
}

export const CompletionAnimation: React.FC<CompletionAnimationProps> = ({
  isVisible,
  onComplete,
  coinsEarned,
  levelCompleted
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-800 dark:text-white mb-2"
            >
              Level Complete!
            </motion.h2>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-2 mb-4"
            >
              <ChefHat className="h-6 w-6 text-amber-600" />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Level {levelCompleted}
              </span>
              <Trophy className="h-6 w-6 text-yellow-600" />
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                <Coins className="h-5 w-5" />
                <span className="font-semibold">+{coinsEarned} Coins Earned!</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-gray-600 dark:text-gray-400"
            >
              <p>Excellent work, Chef!</p>
              <p className="text-sm">Ready for the next challenge?</p>
            </motion.div>
            
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      y: "100%", 
                      x: Math.random() * 400 - 200,
                      rotate: 0,
                      opacity: 1
                    }}
                    animate={{ 
                      y: "-100%", 
                      rotate: 360,
                      opacity: 0
                    }}
                    transition={{ 
                      duration: 2,
                      delay: Math.random() * 0.5,
                      ease: "easeOut"
                    }}
                    className="absolute text-2xl"
                  >
                    {['🎉', '⭐', '🏆', '👨‍🍳', '🔥'][Math.floor(Math.random() * 5)]}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
