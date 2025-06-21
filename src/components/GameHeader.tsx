
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChefHat, Trophy, Star, Coins, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface GameHeaderProps {
  level: number;
  xp: number;
  maxXp: number;
  badges: number;
  currentChallenge: string;
  coins?: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  level,
  xp,
  maxXp,
  badges,
  currentChallenge,
  coins = 0
}) => {
  const { theme, toggleTheme } = useTheme();
  const progressPercentage = (xp / maxXp) * 100;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 border-b border-amber-200 dark:border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CodeKitchen</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Learn to code, one recipe at a time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
              Level {level} Chef
            </Badge>
            
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium dark:text-gray-300">{badges} Badges</span>
            </div>

            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border dark:border-gray-600">
              <Coins className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium dark:text-gray-300">{coins}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Challenge</p>
            <p className="font-medium text-gray-800 dark:text-white">{currentChallenge}</p>
          </div>
          
          <div className="w-32">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>XP</span>
              <span>{xp}/{maxXp}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
