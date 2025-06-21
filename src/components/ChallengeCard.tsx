
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, ChefHat } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  concept: string;
  completed: boolean;
  locked: boolean;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onStart: (challengeId: string) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onStart }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      challenge.locked ? 'opacity-50' : 'hover:scale-105'
    } ${challenge.completed ? 'border-green-300 bg-green-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className={`h-5 w-5 ${challenge.completed ? 'text-green-600' : 'text-amber-600'}`} />
            <CardTitle className="text-lg">{challenge.title}</CardTitle>
            {challenge.completed && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
          </div>
          <Badge className={getDifficultyColor(challenge.difficulty)}>
            {challenge.difficulty}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600">
          {challenge.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{challenge.estimatedTime}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {challenge.concept}
            </Badge>
          </div>
        </div>
        
        <Button 
          onClick={() => onStart(challenge.id)}
          disabled={challenge.locked}
          className={`w-full ${
            challenge.completed 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          {challenge.locked ? 'Locked' : challenge.completed ? 'Review' : 'Start Cooking'}
        </Button>
      </CardContent>
    </Card>
  );
};
