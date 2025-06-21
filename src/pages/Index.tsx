
import React from 'react';
import { GameHeader } from '@/components/GameHeader';
import { GameDashboard } from '@/components/GameDashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <GameHeader
        level={1}
        xp={150}
        maxXp={300}
        badges={2}
        currentChallenge="Drag & Drop Coding"
        coins={100}
      />
      <GameDashboard />
    </div>
  );
};

export default Index;
