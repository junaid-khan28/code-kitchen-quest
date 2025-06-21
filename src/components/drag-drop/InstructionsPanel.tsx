
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, BookOpen } from 'lucide-react';
import { DragDropChallenge } from './types';

interface InstructionsPanelProps {
  challenge: DragDropChallenge;
  purchasedHints: number[];
  currentCoins: number;
  hintsExhausted: boolean;
  isCorrect: boolean;
  onPurchaseHint: (hintIndex: number) => void;
  onShowConceptModal: () => void;
}

export const InstructionsPanel: React.FC<InstructionsPanelProps> = ({
  challenge,
  purchasedHints,
  currentCoins,
  hintsExhausted,
  isCorrect,
  onPurchaseHint,
  onShowConceptModal
}) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🍳</span>
          <span className="dark:text-white">{challenge.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-600">
          <h3 className="font-medium text-gray-800 dark:text-white mb-2">Recipe Instructions:</h3>
          <p className="text-gray-700 dark:text-gray-300">{challenge.instruction}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-600">
          <h3 className="font-medium text-gray-800 dark:text-white mb-2">Expected Result:</h3>
          <pre className="text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded border dark:border-gray-600 font-mono text-gray-800 dark:text-gray-200">
            {challenge.expectedOutput}
          </pre>
        </div>

        {/* Hints Section */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-800 dark:text-white">🍴 Chef's Tips:</h3>
          {challenge.hints.map((hint, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-600">
              {purchasedHints.includes(index) ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">{hint}</p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">💡 Hint {index + 1}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPurchaseHint(index)}
                    disabled={currentCoins < 10}
                    className="text-xs"
                  >
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Buy (10 🪙)
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Concept Learning Section */}
        {hintsExhausted && !isCorrect && (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              📚 Need more help?
            </h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm mb-3">
              Learn more about {challenge.concept} to solve this challenge!
            </p>
            <Button
              size="sm"
              onClick={onShowConceptModal}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Learn {challenge.concept}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
