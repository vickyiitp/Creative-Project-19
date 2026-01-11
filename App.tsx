import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { UIOverlay } from './components/UIOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GameStatus } from './types';
import { CONSTANTS } from './constants';

export default function App() {
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(CONSTANTS.STARTING_LIVES);

  const handleStart = () => {
    setStatus(GameStatus.PLAYING);
    setScore(0);
    setLives(CONSTANTS.STARTING_LIVES);
  };

  const handleRestart = () => {
    setStatus(GameStatus.PLAYING);
    setScore(0);
    setLives(CONSTANTS.STARTING_LIVES);
  };

  const handleGameOver = (finalScore: number) => {
    setStatus(GameStatus.GAME_OVER);
  };

  return (
    <ErrorBoundary>
      {/* Global Background Layer */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="quantum-gradient-bg"></div>
        <div className="digital-aurora"></div>
        {/* Floating Shapes */}
        <div className="shape shape-hex shape-1"></div>
        <div className="shape shape-hex shape-2"></div>
        <div className="shape shape-hex shape-3"></div>
        <div className="shape shape-hex shape-4"></div>
      </div>

      <div className="relative w-full h-screen overflow-hidden select-none z-10">
        <GameCanvas 
          status={status} 
          onScoreUpdate={setScore} 
          onLivesUpdate={setLives}
          onGameOver={handleGameOver}
        />
        <UIOverlay 
          status={status} 
          score={score} 
          lives={lives}
          onStart={handleStart}
          onRestart={handleRestart}
        />
        
        <style>{`
          .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}