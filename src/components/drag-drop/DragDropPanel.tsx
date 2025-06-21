
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { CodeBlock } from './types';

interface DragDropPanelProps {
  codeBlocks: CodeBlock[];
  correctPositions: Set<number>;
  showResult: boolean;
  isCorrect: boolean;
  output: string;
  onDragEnd: (result: DropResult) => void;
  onCheckSolution: () => void;
  onResetChallenge: () => void;
}

export const DragDropPanel: React.FC<DragDropPanelProps> = ({
  codeBlocks,
  correctPositions,
  showResult,
  isCorrect,
  output,
  onDragEnd,
  onCheckSolution,
  onResetChallenge
}) => {
  return (
    <Card className="dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="dark:text-white">Arrange the Code Blocks</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onResetChallenge}>
              Shuffle Again
            </Button>
            <Button onClick={onCheckSolution} className="bg-green-600 hover:bg-green-700">
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

        <DragDropContext onDragEnd={onDragEnd}>
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
  );
};
