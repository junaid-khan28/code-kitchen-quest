
import React, { useState } from 'react';
import { ChallengeCard } from './ChallengeCard';
import { DragDropCodeEditor } from './DragDropCodeEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins } from 'lucide-react';

const challenges = [
  {
    id: '1',
    title: 'Hello Kitchen',
    description: 'Learn to greet customers in your coding restaurant',
    difficulty: 'Beginner' as const,
    estimatedTime: '5 min',
    concept: 'Output',
    completed: false,
    locked: false,
    instruction: 'Arrange the code blocks to create a greeting message for your restaurant customers.',
    codeBlocks: [
      { id: 'block-1', content: 'print("Welcome to CodeKitchen!")', type: 'code' as const },
      { id: 'block-2', content: '// This is our greeting message', type: 'comment' as const },
      { id: 'block-3', content: '// Let\'s welcome our customers', type: 'comment' as const }
    ],
    correctOrder: ['block-2', 'block-3', 'block-1'],
    expectedOutput: 'Welcome to CodeKitchen!',
    hints: [
      'Comments should come before the actual code',
      'The print statement should be at the end',
      'Start with the general comment, then the specific one'
    ],
    coinsReward: 50
  },
  {
    id: '2',
    title: 'Ingredient Counter',
    description: 'Count ingredients using variables in your digital pantry',
    difficulty: 'Beginner' as const,
    estimatedTime: '8 min',
    concept: 'Variables',
    completed: false,
    locked: false,
    instruction: 'Arrange the code blocks to correctly count and display the total ingredients.',
    codeBlocks: [
      { id: 'var-1', content: 'tomatoes = 5', type: 'code' as const },
      { id: 'var-2', content: 'onions = 3', type: 'code' as const },
      { id: 'var-3', content: 'total = tomatoes + onions', type: 'code' as const },
      { id: 'var-4', content: 'print("Total ingredients:", total)', type: 'code' as const },
      { id: 'comment-1', content: '// Define our ingredient quantities', type: 'comment' as const }
    ],
    correctOrder: ['comment-1', 'var-1', 'var-2', 'var-3', 'var-4'],
    expectedOutput: 'Total ingredients: 8',
    hints: [
      'Start with the comment to explain what you\'re doing',
      'Define variables before using them',
      'Calculate the total before printing it'
    ],
    coinsReward: 75
  },
  {
    id: '3',
    title: 'Recipe Multiplier',
    description: 'Scale recipes up or down using mathematical operations',
    difficulty: 'Intermediate' as const,
    estimatedTime: '12 min',
    concept: 'Functions',
    completed: false,
    locked: true,
    instruction: 'Arrange the code blocks to create a function that multiplies recipe ingredients.',
    codeBlocks: [
      { id: 'func-1', content: 'function scaleRecipe(servings) {', type: 'code' as const },
      { id: 'func-2', content: '  eggs = 2 * servings', type: 'code' as const },
      { id: 'func-3', content: '  flour = 1 * servings', type: 'code' as const },
      { id: 'func-4', content: '  print("Recipe scaled for", servings, "servings")', type: 'code' as const },
      { id: 'func-5', content: '}', type: 'code' as const },
      { id: 'func-6', content: 'scaleRecipe(4)', type: 'code' as const },
      { id: 'comment-2', content: '// Function to scale recipe ingredients', type: 'comment' as const }
    ],
    correctOrder: ['comment-2', 'func-1', 'func-2', 'func-3', 'func-4', 'func-5', 'func-6'],
    expectedOutput: 'Recipe scaled for 4 servings',
    hints: [
      'Start with a comment explaining the function',
      'Function definition comes before the function call',
      'Variables should be calculated inside the function'
    ],
    coinsReward: 100
  }
];

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
      const currentIndex = challenges.findIndex(c => c.id === selectedChallenge);
      if (currentIndex < challenges.length - 1) {
        challenges[currentIndex + 1].locked = false;
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

  const currentChallenge = challenges.find(c => c.id === selectedChallenge);

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
          coinsReward: currentChallenge.coinsReward
        }}
        onComplete={handleCompleteChallenge}
        onBack={handleBackToChallenges}
        currentCoins={coins}
        onSpendCoins={handleSpendCoins}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Your Coding Menu</h2>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
              <Coins className="h-5 w-5 text-yellow-600" />
              <span className="font-medium">{coins} Coins</span>
            </div>
          </div>
          <p className="text-gray-600">Choose a challenge to start your culinary coding journey!</p>
          <p className="text-sm text-gray-500 mt-2">
            Complete challenges to earn coins • Use coins to buy hints • Drag & drop to arrange code!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
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
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <div className="text-4xl mb-2">👨‍🍳</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Great Progress!</h3>
              <p className="text-gray-600 mb-2">
                You've completed {completedChallenges.size} challenge{completedChallenges.size !== 1 ? 's' : ''}. 
                Keep cooking up that code!
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Coins className="h-4 w-4 text-yellow-600" />
                <span>Total coins earned: {coins - 100}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
