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
  const [showSnakePopup, setShowSnakePopup] = useState(false);
  const [snakePopupFading, setSnakePopupFading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
        }, 1200);
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
    }, 1200); // 1.2 second delay between reveals

    return () => clearTimeout(timer);
  }, [autoRevealing, currentRevealIndex, snakeRevealed]);

  // Show and dissolve snake popup when position #1 is revealed and contains the snake
  useEffect(() => {
    if (revealedPositions[0]) {
      const snakeAnswer = gameState.snakeAnswer;
      if (playerRankings[0] === snakeAnswer) {
        setShowSnakePopup(true);
        const timer = setTimeout(() => {
          setSnakePopupFading(true);
          const fadeTimer = setTimeout(() => {
            setShowSnakePopup(false);
            setSnakePopupFading(false);
          }, 1000);
          return () => clearTimeout(fadeTimer);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [revealedPositions[0], playerRankings, gameState.snakeAnswer]);

  // Show confetti when position #6 is revealed and contains the snake
  useEffect(() => {
    if (revealedPositions[5]) {
      const snakeAnswer = gameState.snakeAnswer;
      if (playerRankings[5] === snakeAnswer) {
        setShowConfetti(true);
        const timer = setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [revealedPositions[5], playerRankings, gameState.snakeAnswer]);

  const handleNext = () => {
    onComplete();
  };

  const allRevealed = revealedPositions.every(Boolean) && snakeRevealed;
  const doubleDownResults = getDoubleDownResults();

  return (
    <div className="flex flex-col h-full mobile-container relative">
      {/* Snake popup */}
      {showSnakePopup && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div 
            className="text-9xl"
            style={{
              animation: snakePopupFading ? "fadeOut 1s ease-out forwards" : "shake 0.5s infinite, scaleIn 0.6s ease-out",
              transformOrigin: "center",
            }}
          >
            🐍
          </div>
        </div>
      )}

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {[...Array(80)].map((_, i) => (
            <div
              key={`confetti-${i}`}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: "-10px",
                width: `${6 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 6}px`,
                backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"][Math.floor(Math.random() * 5)],
                borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                animation: `confettiFall ${1.8 + Math.random() * 0.8}s linear forwards`,
                animationDelay: `${Math.random() * 0.2}s`,
                willChange: "transform",
              }}
            />
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-10px) rotateZ(-2deg);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(10px) rotateZ(2deg);
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(150vh) rotateZ(720deg);
            opacity: 0;
          }
        }
      `}</style>
      {/* Header */}
      <div className="clean-card mx-2 mt-0 px-4 py-0.5 mb-1">
        {gameState.currentCard && (
          <>
            {gameState.currentCard.category && (
              <div
                className="caption uppercase tracking-wide mb-2 mt-2"
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
                  Start Reveal
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
                  bg-white/70 border-2 border-gray-200
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
                  {index === 5 ? '🐍' : index + 1}
                </div>
                
                {/* Snake indicator if this is the snake answer */}
                
                {/* Answer text */}
                <div className="flex-1 body leading-snug">
                  {answer}
                  {hasDoubleDown && (
                    <div className="caption text-xs mt-1 flex flex-wrap gap-1 items-center">
                      {Object.entries(gameState.doubleDowns).map(([playerId, doubleDownIndex]) => {
                        if (doubleDownIndex === index) {
                          const player = gameState.players.find(p => p.id === playerId);
                          if (player) {
                            return (
                              <div key={playerId} className="flex items-center gap-0.5">
                                <div 
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: player.color.toLowerCase() }}
                                />
                                <span style={{ color: "var(--text-secondary)" }}>
                                  {player.name}
                                </span>
                              </div>
                            );
                          }
                        }
                        return null;
                      })}
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

      </div>
    </div>
  );
};

export default RevealPhase;
