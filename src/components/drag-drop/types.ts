
export interface CodeBlock {
  id: string;
  content: string;
  type: 'code' | 'comment';
}

export interface DragDropChallenge {
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

export interface DragDropCodeEditorProps {
  challenge: DragDropChallenge;
  onComplete: (coinsEarned: number) => void;
  onBack: () => void;
  currentCoins: number;
  onSpendCoins: (amount: number) => void;
}
