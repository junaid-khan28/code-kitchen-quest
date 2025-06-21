
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Coins } from 'lucide-react';
import { ConceptModal } from './ConceptModal';
import { CompletionAnimation } from './CompletionAnimation';
import { InstructionsPanel } from './drag-drop/InstructionsPanel';
import { DragDropPanel } from './drag-drop/DragDropPanel';
import { useDragDropLogic } from './drag-drop/hooks/useDragDropLogic';
import { DragDropCodeEditorProps } from './drag-drop/types';

export const DragDropCodeEditor: React.FC<DragDropCodeEditorProps> = ({
  challenge,
  onComplete,
  onBack,
  currentCoins,
  onSpendCoins
}) => {
  const [purchasedHints, setPurchasedHints] = useState<number[]>([]);
  const [showConceptModal, setShowConceptModal] = useState(false);

  const {
    codeBlocks,
    isCorrect,
    showResult,
    output,
    correctPositions,
    hintsExhausted,
    showCompletionAnimation,
    setShowCompletionAnimation,
    handleDragEnd,
    checkSolution,
    resetChallenge
  } = useDragDropLogic(challenge);

  const purchaseHint = (hintIndex: number) => {
    const hintCost = 10;
    if (currentCoins >= hintCost && !purchasedHints.includes(hintIndex)) {
      onSpendCoins(hintCost);
      setPurchasedHints([...purchasedHints, hintIndex]);
    }
  };

  const handleCheckSolution = () => {
    checkSolution(purchasedHints);
  };

  const handleConceptModalClose = () => {
    setShowConceptModal(false);
    resetChallenge();
  };

  const handleCompletionAnimationComplete = () => {
    setShowCompletionAnimation(false);
    setTimeout(() => {
      onComplete(challenge.coinsReward);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenges
          </Button>
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Level {challenge.difficultyLevel}
            </Badge>
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow border dark:border-gray-600">
              <Coins className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium dark:text-gray-200">{currentCoins} Coins</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InstructionsPanel
            challenge={challenge}
            purchasedHints={purchasedHints}
            currentCoins={currentCoins}
            hintsExhausted={hintsExhausted}
            isCorrect={isCorrect}
            onPurchaseHint={purchaseHint}
            onShowConceptModal={() => setShowConceptModal(true)}
          />

          <DragDropPanel
            codeBlocks={codeBlocks}
            correctPositions={correctPositions}
            showResult={showResult}
            isCorrect={isCorrect}
            output={output}
            onDragEnd={handleDragEnd}
            onCheckSolution={handleCheckSolution}
            onResetChallenge={resetChallenge}
          />
        </div>
      </div>

      <ConceptModal
        isOpen={showConceptModal}
        onClose={handleConceptModalClose}
        title={challenge.title}
        concept={challenge.concept}
        explanation={challenge.conceptExplanation}
      />

      <CompletionAnimation
        isVisible={showCompletionAnimation}
        onComplete={handleCompletionAnimationComplete}
        coinsEarned={challenge.coinsReward}
        levelCompleted={challenge.difficultyLevel}
      />
    </div>
  );
};
