"use client";

import { GameState } from "@/types/game";
import { useState, useEffect } from "react";

interface RevealPhaseProps {
  gameState: GameState;
  onComplete: () => void;
}

const RevealPhase: React.FC<RevealPhaseProps> = ({ gameState, onComplete }) => {
  const [revealedPositions, setRevealedPositions] = useState<boolean[]>([false, false, false, false, false, false]);
  const [autoRevealing, setAutoRevealing] = useState(false);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);

  const correctAnswers = gameState.currentCard?.answers ?? [];
  const playerRankings = gameState.playerRankings ?? [];

  const isPositionCorrect = (index: number): boolean => {
    const guess = playerRankings[index];
    
    if (index === 5) return false; // Fox position is never "correct"
    
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

  const handleStartReveal = () => {
    setAutoRevealing(true);
  };

  // Auto-reveal timer effect
  useEffect(() => {
    if (!autoRevealing) return;
    
    if (currentRevealIndex >= 6) {
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
  }, [autoRevealing, currentRevealIndex]);

  const handleNext = () => {
    onComplete();
  };

  const allRevealed = revealedPositions.every(Boolean);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="clean-card px-4 py-3 mb-2 space-y-1">
        {gameState.currentCard && (
          <>
            {gameState.currentCard.category && (
              <div
                className="caption uppercase tracking-wide"
                style={{ color: "var(--text-secondary)" }}
              >
                {gameState.currentCard.category}
              </div>
            )}
            <div className="body font-semibold">
              {gameState.currentCard.question}
            </div>
            <div className="caption pt-1">
              {!autoRevealing && !allRevealed 
                ? "Ready to see how you did?" 
                : autoRevealing 
                ? "Revealing answers..." 
                : "Here's how your ranking stacked up."
              }
            </div>
          </>
        )}
      </div>

      {/* Main reveal list */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        <div className="clean-card flex-1 px-4 py-3 flex flex-col gap-2">
          {playerRankings.map((answer, index) => {
            const isFoxRow = index === 5;
            const isRevealed = revealedPositions[index];
            const isCorrect = !isFoxRow && isPositionCorrect(index);
            const correctRank = !isFoxRow ? getCorrectRankForAnswer(answer) : null;
            const isFoxAnswer = answer === gameState.foxAnswer;

            return (
              <div
                key={`${answer}-${index}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white/70"
              >
                {/* Position badge */}
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold text-white ${
                    isFoxRow
                      ? "bg-orange-500"
                      : isRevealed
                      ? isCorrect
                        ? "bg-[var(--success)]"
                        : "bg-[var(--danger)]"
                      : "bg-gray-400"
                  }`}
                >
                  {isFoxRow ? "🦊" : index + 1}
                </div>
                
                {/* Answer text */}
                <div className="flex-1 body text-sm leading-snug">
                  {answer}
                </div>
                
                {/* Reveal status */}
                {isRevealed && (
                  <div className="flex items-center gap-2">
                    {isFoxRow ? (
                      <span className="text-sm font-semibold text-orange-600">
                        {isFoxAnswer ? "THE FOX!" : "🦊"}
                      </span>
                    ) : (
                      <>
                        <span className="text-lg">
                          {isCorrect ? "✅" : "❌"}
                        </span>
                        {correctRank && (
                          <span className="text-xs font-semibold text-[var(--text-secondary)]">
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

        {/* Footer */}
        <div className="clean-card px-4 py-3 flex items-center justify-end">
          {!autoRevealing && !allRevealed ? (
            <button
              type="button"
              onClick={handleStartReveal}
              className="btn-primary"
            >
              Start Reveal
            </button>
          ) : allRevealed ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary"
            >
              Continue
            </button>
          ) : (
            <div className="caption text-[var(--text-secondary)]">
              Revealing... {revealedPositions.filter(Boolean).length}/6
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevealPhase;
