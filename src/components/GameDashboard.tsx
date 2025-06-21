
import React, { useState } from 'react';
import { ChallengeCard } from './ChallengeCard';
import { DragDropCodeEditor } from './DragDropCodeEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins } from 'lucide-react';
import { allChallenges } from '@/data/challenges';

export const GameDashboard: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [coins, setCoins] = useState(100); // Starting coins

  const handleStartChallenge = (challengeId: string) => {
    setSelectedChallenge(challengeId);
  };

  const handleCompleteChallenge = (coinsEarned: number) => {
    if (selectedChallenge) {
      setCompletedChallenges(prev => new Set([...prev, selectedChallenge]));
      setCoins(prev => prev + coinsEarned);
      
      // Unlock next challenge
      const currentIndex = allChallenges.findIndex(c => c.id === selectedChallenge);
      if (currentIndex < allChallenges.length - 1) {
        allChallenges[currentIndex + 1].locked = false;
      }
      setSelectedChallenge(null);
    }
  };

  const handleSpendCoins = (amount: number) => {
    setCoins(prev => Math.max(0, prev - amount));
  };

  const handleBackToChallenges = () => {
    setSelectedChallenge(null);
  };

  const currentChallenge = allChallenges.find(c => c.id === selectedChallenge);

  if (selectedChallenge && currentChallenge) {
    return (
      <DragDropCodeEditor
        challenge={{
          id: currentChallenge.id,
          title: currentChallenge.title,
          instruction: currentChallenge.instruction,
          codeBlocks: currentChallenge.codeBlocks,
          correctOrder: currentChallenge.correctOrder,
          expectedOutput: currentChallenge.expectedOutput,
          hints: currentChallenge.hints,
          coinsReward: currentChallenge.coinsReward,
          conceptExplanation: currentChallenge.conceptExplanation,
          concept: currentChallenge.concept,
          difficultyLevel: currentChallenge.difficultyLevel
        }}
        onComplete={handleCompleteChallenge}
        onBack={handleBackToChallenges}
        currentCoins={coins}
        onSpendCoins={handleSpendCoins}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Your Coding Menu</h2>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow border dark:border-gray-600">
              <Coins className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium dark:text-gray-200">{coins} Coins</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Choose a challenge to start your culinary coding journey!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Complete challenges to earn coins • Use coins to buy hints • Drag & drop to arrange code!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={{
                ...challenge,
                completed: completedChallenges.has(challenge.id)
              }}
              onStart={handleStartChallenge}
            />
          ))}
        </div>

        {completedChallenges.size > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-md mx-auto border dark:border-gray-600">
              <div className="text-4xl mb-2">👨‍🍳</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Great Progress!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                You've completed {completedChallenges.size} challenge{completedChallenges.size !== 1 ? 's' : ''}. 
                Keep cooking up that code!
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Coins className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span>Total coins earned: {coins - 100}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
