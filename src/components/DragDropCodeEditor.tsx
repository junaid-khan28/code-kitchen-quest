
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, ArrowLeft, Coins, Lightbulb } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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
  };

  const checkSolution = () => {
    const currentOrder = codeBlocks.map(block => block.id);
    const isOrderCorrect = JSON.stringify(currentOrder) === JSON.stringify(challenge.correctOrder);
    
    if (isOrderCorrect) {
      setIsCorrect(true);
      setOutput(challenge.expectedOutput);
      setTimeout(() => {
        onComplete(challenge.coinsReward);
      }, 2000);
    } else {
      setIsCorrect(false);
      setOutput('Code order is incorrect. Try rearranging the blocks!');
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenges
          </Button>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
            <Coins className="h-5 w-5 text-yellow-600" />
            <span className="font-medium">{currentCoins} Coins</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instructions Panel */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🍳</span>
                <span>{challenge.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-800 mb-2">Recipe Instructions:</h3>
                <p className="text-gray-700">{challenge.instruction}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-800 mb-2">Expected Result:</h3>
                <pre className="text-sm bg-gray-50 p-2 rounded border font-mono">
                  {challenge.expectedOutput}
                </pre>
              </div>

              {/* Hints Section */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-800">🍴 Chef's Tips:</h3>
                {challenge.hints.map((hint, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border">
                    {purchasedHints.includes(index) ? (
                      <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                        <p className="text-yellow-700 text-sm">{hint}</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">💡 Hint {index + 1}</span>
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
            </CardContent>
          </Card>

          {/* Drag & Drop Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Arrange the Code Blocks</CardTitle>
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
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Drag and drop the code blocks below to arrange them in the correct order!
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
                              className={`p-3 bg-white border rounded-lg font-mono text-sm cursor-move transition-all ${
                                snapshot.isDragging 
                                  ? 'shadow-lg scale-105 border-blue-300' 
                                  : 'hover:shadow-md border-gray-200'
                              } ${
                                block.type === 'comment' ? 'bg-green-50 text-green-700' : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400">#{index + 1}</span>
                                <span>{block.content}</span>
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
                    <h3 className="font-medium">Result:</h3>
                    {isCorrect ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Perfect!
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Keep trying
                      </Badge>
                    )}
                  </div>
                  <div className={`text-sm p-3 rounded border ${
                    isCorrect ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {output}
                  </div>
                </div>
              )}

              {isCorrect && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <h3 className="font-bold text-green-800">Delicious Success!</h3>
                  <p className="text-green-700">You've earned {challenge.coinsReward} coins! Great job, chef!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
