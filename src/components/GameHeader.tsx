
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChefHat, Trophy, Star, Coins } from 'lucide-react';

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
  const progressPercentage = (xp / maxXp) * 100;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-amber-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">CodeKitchen</h1>
              <p className="text-sm text-gray-600">Learn to code, one recipe at a time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Level {level} Chef
            </Badge>
            
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">{badges} Badges</span>
            </div>

            <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm">
              <Coins className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">{coins}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Current Challenge</p>
            <p className="font-medium text-gray-800">{currentChallenge}</p>
          </div>
          
          <div className="w-32">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
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
