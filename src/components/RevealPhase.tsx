"use client";

import { GameState } from "@/types/game";
import { useState, useEffect } from "react";

interface RevealPhaseProps {
  gameState: GameState;
  onComplete: () => void;
}

const RevealPhase: React.FC<RevealPhaseProps> = ({ gameState, onComplete }) => {
  const [revealedPositions, setRevealedPositions] = useState<boolean[]>([false, false, false, false, false, false]);
  const [snakeRevealed, setSnakeRevealed] = useState(false);
  const [autoRevealing, setAutoRevealing] = useState(false);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);

  const correctAnswers = gameState.currentCard?.answers ?? [];
  const playerRankings = gameState.playerRankings ?? [];
  const currentSnake = gameState.players[gameState.currentSnakeIndex];
  const rankingPlayers = gameState.players.filter((_, index) => index !== gameState.currentSnakeIndex);

  const isPositionCorrect = (index: number): boolean => {
    const guess = playerRankings[index];
    
    // Snake position is never "correct" in terms of ranking
    if (guess === gameState.snakeAnswer) return false;
    
    if (!guess || !correctAnswers[index]) return false;

    // Check if guess matches the correct answer for this position
    if (index === 0) {
      return guess === correctAnswers[0];
    }
    if (index === 1 || index === 2) {
      return guess === correctAnswers[1] || guess === correctAnswers[2];
    }
    if (index === 3 || index === 4) {
      return guess === correctAnswers[3] || guess === correctAnswers[4];
    }
    return false;
  };

  const getCorrectRankForAnswer = (answer: string): number | null => {
    const correctIndex = correctAnswers.findIndex(correct => correct === answer);
    return correctIndex !== -1 ? correctIndex + 1 : null;
  };

  const getDoubleDownResults = () => {
    const results: Array<{ player: any; position: number; correct: boolean }> = [];
    
    Object.entries(gameState.doubleDowns).forEach(([playerId, position]) => {
      const player = gameState.players.find(p => p.id === playerId);
      if (player) {
        const isCorrect = isPositionCorrect(position);
        results.push({ player, position, correct: isCorrect });
      }
    });
    
    return results;
  };

  const handleStartReveal = () => {
    setAutoRevealing(true);
  };

  // Auto-reveal timer effect
  useEffect(() => {
    if (!autoRevealing) return;
    
    if (currentRevealIndex >= 6) {
      // After all positions are revealed, reveal the snake
      if (!snakeRevealed) {
        const timer = setTimeout(() => {
          setSnakeRevealed(true);
          setAutoRevealing(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
      setAutoRevealing(false);
      return;
    }

    const timer = setTimeout(() => {
      setRevealedPositions(prev => {
        const next = [...prev];
        next[currentRevealIndex] = true;
        return next;
      });
      setCurrentRevealIndex(prev => prev + 1);
    }, 2000); // 2 second delay between reveals

    return () => clearTimeout(timer);
  }, [autoRevealing, currentRevealIndex, snakeRevealed]);

  const handleNext = () => {
    onComplete();
  };

  const allRevealed = revealedPositions.every(Boolean) && snakeRevealed;
  const doubleDownResults = getDoubleDownResults();

  return (
    <div className="flex flex-col h-full mobile-container">
      {/* Header */}
      <div className="clean-card mx-2 mt-0 px-4 py-0.5 mb-1">
        {gameState.currentCard && (
          <>
            {gameState.currentCard.category && (
              <div
                className="caption uppercase tracking-wide mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {gameState.currentCard.category}
              </div>
            )}
            <div className="body font-semibold mb-0">
              {gameState.currentCard.question}
            </div>
            {gameState.currentCard.source && (
              <div 
                className="caption text-xs mb-0 leading-tight" 
                style={{ color: "var(--text-tertiary)" }}
              >
                Source: {gameState.currentCard.source}
              </div>
            )}
            
            {/* Status and Button Row */}
            <div className="flex items-center justify-between mt-1 mb-2">
              <div className="caption">
                {!autoRevealing && !allRevealed 
                  ? "Ready to see how you did?" 
                  : autoRevealing 
                  ? "Revealing answers..." 
                  : "Here's how your ranking stacked up."
                }
              </div>
              
              {!autoRevealing && !allRevealed ? (
                <button
                  type="button"
                  onClick={handleStartReveal}
                  className="btn-primary touch-target px-3 py-2 text-sm font-semibold"
                >
                  🎭 Start Reveal
                </button>
              ) : allRevealed ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary touch-target px-3 py-2 text-sm font-semibold"
                >
                  Continue →
                </button>
              ) : (
                <div className="caption text-xs" style={{ color: "var(--text-secondary)" }}>
                  {revealedPositions.filter(Boolean).length}/6
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main reveal list */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden px-2">
        <div className="clean-card flex-1 px-4 py-3 flex flex-col gap-3">
          {playerRankings.map((answer, index) => {
            const isSnakeAnswer = answer === gameState.snakeAnswer;
            const isRevealed = revealedPositions[index];
            const isCorrect = !isSnakeAnswer && isPositionCorrect(index);
            const correctRank = !isSnakeAnswer ? getCorrectRankForAnswer(answer) : null;
            const hasDoubleDown = Object.values(gameState.doubleDowns).includes(index);

            return (
              <div
                key={`${answer}-${index}`}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3 touch-target
                  ${hasDoubleDown && isRevealed 
                    ? isCorrect 
                      ? "bg-green-50/70 border-2 border-green-400"
                      : "bg-red-50/70 border-2 border-red-400"
                    : "bg-white/70 border-2 border-gray-200"
                  }
                `}
              >
                {/* Position badge */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold text-white ${
                    isRevealed
                      ? isCorrect
                        ? "bg-[var(--success)]"
                        : "bg-[var(--danger)]"
                      : "bg-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                
                {/* Snake indicator if this is the snake answer */}
                
                {/* Answer text */}
                <div className="flex-1 body leading-snug">
                  {answer}
                  {hasDoubleDown && (
                    <div className="caption text-xs mt-1 flex items-center gap-1">
                      <span>💎</span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        Double Down Position
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Reveal status */}
                {isRevealed && (
                  <div className="flex items-center gap-2">
                    {isSnakeAnswer ? (
                      <span className="text-lg font-bold text-green-600">
                        THE SNAKE!
                      </span>
                    ) : (
                      <>
                        <span className="text-xl">
                          {isCorrect ? "✅" : "❌"}
                        </span>
                        {correctRank && (
                          <span className="body font-bold" style={{ color: "var(--text-primary)" }}>
                            (#{correctRank})
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Double Down Results */}
        {allRevealed && doubleDownResults.length > 0 && (
          <div className="clean-card mx-0 px-4 py-3">
            <div className="title text-center mb-3">💎 Double Down Results</div>
            <div className="space-y-2">
              {doubleDownResults.map((result, idx) => (
                <div 
                  key={idx} 
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-lg
                    ${result.correct 
                      ? "bg-green-100 border border-green-300"
                      : "bg-red-100 border border-red-300"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${gameState.players.find(p => p.id === result.player.id)?.color || 'bg-gray-500'}`}></div>
                    <span className="body font-medium">{result.player.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="caption">Position #{result.position + 1}</span>
                    <span className="text-lg">
                      {result.correct ? "🎉" : "💔"}
                    </span>
                    {result.correct && (
                      <span className="caption font-bold text-green-600">+3 points!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevealPhase;
