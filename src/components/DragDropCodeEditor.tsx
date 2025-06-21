
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, ArrowLeft, Coins, Lightbulb, BookOpen, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ConceptModal } from './ConceptModal';
import { CompletionAnimation } from './CompletionAnimation';

interface CodeBlock {
  id: string;
  content: string;
  type: 'code' | 'comment';
}

interface DragDropChallenge {
  id: string;
  title: string;
  instruction: string;
  codeBlocks: CodeBlock[];
  correctOrder: string[];
  expectedOutput: string;
  hints: string[];
  coinsReward: number;
  conceptExplanation: string;
  concept: string;
  difficultyLevel: number;
}

interface DragDropCodeEditorProps {
  challenge: DragDropChallenge;
  onComplete: (coinsEarned: number) => void;
  onBack: () => void;
  currentCoins: number;
  onSpendCoins: (amount: number) => void;
}

export const DragDropCodeEditor: React.FC<DragDropCodeEditorProps> = ({
  challenge,
  onComplete,
  onBack,
  currentCoins,
  onSpendCoins
}) => {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [purchasedHints, setPurchasedHints] = useState<number[]>([]);
  const [output, setOutput] = useState('');
  const [correctPositions, setCorrectPositions] = useState<Set<number>>(new Set());
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [hintsExhausted, setHintsExhausted] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

  useEffect(() => {
    // Shuffle code blocks initially
    const shuffled = [...challenge.codeBlocks].sort(() => Math.random() - 0.5);
    setCodeBlocks(shuffled);
  }, [challenge]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(codeBlocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCodeBlocks(items);
    
    // Check which positions are correct after each drag
    const newCorrectPositions = new Set<number>();
    items.forEach((block, index) => {
      if (block.id === challenge.correctOrder[index]) {
        newCorrectPositions.add(index);
      }
    });
    setCorrectPositions(newCorrectPositions);
  };

  const checkSolution = () => {
    const currentOrder = codeBlocks.map(block => block.id);
    const isOrderCorrect = JSON.stringify(currentOrder) === JSON.stringify(challenge.correctOrder);
    
    if (isOrderCorrect) {
      setIsCorrect(true);
      setOutput(challenge.expectedOutput);
      setShowCompletionAnimation(true);
    } else {
      setIsCorrect(false);
      setOutput('Code order is incorrect. Try rearranging the blocks!');
      
      // Check if all hints have been purchased
      if (purchasedHints.length === challenge.hints.length) {
        setHintsExhausted(true);
      }
    }
    setShowResult(true);
  };

  const purchaseHint = (hintIndex: number) => {
    const hintCost = 10;
    if (currentCoins >= hintCost && !purchasedHints.includes(hintIndex)) {
      onSpendCoins(hintCost);
      setPurchasedHints([...purchasedHints, hintIndex]);
    }
  };

  const resetChallenge = () => {
    const shuffled = [...challenge.codeBlocks].sort(() => Math.random() - 0.5);
    setCodeBlocks(shuffled);
    setShowResult(false);
    setIsCorrect(false);
    setOutput('');
    setCorrectPositions(new Set());
    setHintsExhausted(false);
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
          {/* Instructions Panel */}
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
                          onClick={() => purchaseHint(index)}
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
                    onClick={() => setShowConceptModal(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Learn {challenge.concept}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Drag & Drop Panel */}
          <Card className="dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="dark:text-white">Arrange the Code Blocks</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={resetChallenge}>
                    Shuffle Again
                  </Button>
                  <Button onClick={checkSolution} className="bg-green-600 hover:bg-green-700">
                    Check Solution
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Drag and drop the code blocks below to arrange them in the correct order! 
                  ✅ marks show correct positions.
                </p>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="codeBlocks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {codeBlocks.map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 border rounded-lg font-mono text-sm cursor-move transition-all relative ${
                                snapshot.isDragging 
                                  ? 'shadow-lg scale-105 border-blue-300 dark:border-blue-600' 
                                  : 'hover:shadow-md border-gray-200 dark:border-gray-600'
                              } ${
                                block.type === 'comment' 
                                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                                  : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                              } ${
                                correctPositions.has(index) 
                                  ? 'border-green-400 dark:border-green-500 bg-green-100 dark:bg-green-900/30' 
                                  : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-400 dark:text-gray-500">#{index + 1}</span>
                                  <span>{block.content}</span>
                                </div>
                                {correctPositions.has(index) && (
                                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {showResult && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium dark:text-white">Result:</h3>
                    {isCorrect ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Perfect!
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Keep trying
                      </Badge>
                    )}
                  </div>
                  <div className={`text-sm p-3 rounded border ${
                    isCorrect 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  }`}>
                    {output}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Concept Learning Modal */}
      <ConceptModal
        isOpen={showConceptModal}
        onClose={handleConceptModalClose}
        title={challenge.title}
        concept={challenge.concept}
        explanation={challenge.conceptExplanation}
      />

      {/* Completion Animation */}
      <CompletionAnimation
        isVisible={showCompletionAnimation}
        onComplete={handleCompletionAnimationComplete}
        coinsEarned={challenge.coinsReward}
        levelCompleted={challenge.difficultyLevel}
      />
    </div>
  );
};
