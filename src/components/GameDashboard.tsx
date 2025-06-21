
import React, { useState } from 'react';
import { ChallengeCard } from './ChallengeCard';
import { CodeEditor } from './CodeEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
    instruction: 'Create a simple greeting message for your restaurant customers. Use the print() function to display "Welcome to CodeKitchen!"',
    starterCode: '// Welcome your first customer!\n// Use print() to display your greeting\n',
    expectedOutput: 'Welcome to CodeKitchen!',
    hints: [
      'Use the print() function to display text',
      'Remember to put your text in quotes!',
      'The exact message should be: Welcome to CodeKitchen!'
    ]
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
    instruction: 'Create variables to store ingredient quantities. You have 5 tomatoes and 3 onions. Calculate and display the total ingredients.',
    starterCode: '// Create variables for your ingredients\n// tomatoes = ?\n// onions = ?\n// Calculate total and print it\n',
    expectedOutput: 'Total ingredients: 8',
    hints: [
      'Create variables: tomatoes = 5 and onions = 3',
      'Add them together: total = tomatoes + onions',
      'Use print() to display the result with text'
    ]
  },
  {
    id: '3',
    title: 'Recipe Multiplier',
    description: 'Scale recipes up or down using mathematical operations',
    difficulty: 'Intermediate' as const,
    estimatedTime: '12 min',
    concept: 'Math Operations',
    completed: false,
    locked: true,
    instruction: 'Create a function that multiplies recipe ingredients by a serving size multiplier.',
    starterCode: '// Function to multiply recipe ingredients\n',
    expectedOutput: 'Recipe scaled for 4 servings',
    hints: [
      'Use function keyword to create a function',
      'Multiply each ingredient by the serving multiplier'
    ]
  }
];

export const GameDashboard: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());

  const handleStartChallenge = (challengeId: string) => {
    setSelectedChallenge(challengeId);
  };

  const handleCompleteChallenge = () => {
    if (selectedChallenge) {
      setCompletedChallenges(prev => new Set([...prev, selectedChallenge]));
      // Unlock next challenge
      const currentIndex = challenges.findIndex(c => c.id === selectedChallenge);
      if (currentIndex < challenges.length - 1) {
        challenges[currentIndex + 1].locked = false;
      }
      setSelectedChallenge(null);
    }
  };

  const handleBackToChallenges = () => {
    setSelectedChallenge(null);
  };

  const currentChallenge = challenges.find(c => c.id === selectedChallenge);

  if (selectedChallenge && currentChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleBackToChallenges}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Challenges
            </Button>
          </div>
          
          <CodeEditor 
            challenge={{
              title: currentChallenge.title,
              instruction: currentChallenge.instruction,
              starterCode: currentChallenge.starterCode,
              expectedOutput: currentChallenge.expectedOutput,
              hints: currentChallenge.hints
            }}
            onComplete={handleCompleteChallenge}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Coding Menu</h2>
          <p className="text-gray-600">Choose a challenge to start your culinary coding journey!</p>
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
              <p className="text-gray-600">
                You've completed {completedChallenges.size} challenge{completedChallenges.size !== 1 ? 's' : ''}. 
                Keep cooking up that code!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
