
import { useState, useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { CodeBlock, DragDropChallenge } from '../types';

export const useDragDropLogic = (challenge: DragDropChallenge) => {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [output, setOutput] = useState('');
  const [correctPositions, setCorrectPositions] = useState<Set<number>>(new Set());
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

  const checkSolution = (purchasedHints: number[]) => {
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

  const resetChallenge = () => {
    const shuffled = [...challenge.codeBlocks].sort(() => Math.random() - 0.5);
    setCodeBlocks(shuffled);
    setShowResult(false);
    setIsCorrect(false);
    setOutput('');
    setCorrectPositions(new Set());
    setHintsExhausted(false);
  };

  return {
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
  };
};
