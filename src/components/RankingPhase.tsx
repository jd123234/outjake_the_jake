"use client";

import React, { useState, useRef, useEffect } from "react";
import { GameState } from "@/types/game";
import Timer from "./Timer";

interface RankingPhaseProps {
  gameState: GameState;
  onComplete: (
    rankings: string[],
    snakeChoice: string,
    doubleDowns: Record<string, number>
  ) => void;
}

const RankingPhase: React.FC<RankingPhaseProps> = ({ gameState, onComplete }) => {
  // Start from a random order of all 6 answers
  const [orderedAnswers, setOrderedAnswers] = useState<string[]>(() => {
    const copy = [...gameState.allAnswers];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  });

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchCurrentY, setTouchCurrentY] = useState<number | null>(null);
  const [step, setStep] = useState<'ranking' | 'double-down'>('ranking');
  const [selectedDoubleDown, setSelectedDoubleDown] = useState<number | null>(null);
  const dragElementRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Get current snake player (the one NOT ranking)
  const currentSnake = gameState.players[gameState.currentSnakeIndex];
  const rankingPlayers = gameState.players.filter((_, index) => index !== gameState.currentSnakeIndex);

  // Touch and drag handlers
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setTouchCurrentY(touch.clientY);
    setDragIndex(index);
    
    // Add haptic feedback class
    const element = e.currentTarget as HTMLElement;
    element.classList.add('haptic-feedback');
    setTimeout(() => element.classList.remove('haptic-feedback'), 100);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragIndex === null || !containerRef.current) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    setTouchCurrentY(touch.clientY);
    
    // Find which item we're over
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = touch.clientY - rect.top;
    const itemHeight = 60; // Approximate height of each item + gap
    const newIndex = Math.max(0, Math.min(orderedAnswers.length - 1, Math.floor(relativeY / itemHeight)));
    
    setDragOverIndex(newIndex);
  };

  const handleTouchEnd = () => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      setOrderedAnswers((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(dragOverIndex, 0, moved);
        return next;
      });
    }
    
    setDragIndex(null);
    setDragOverIndex(null);
    setTouchStartY(null);
    setTouchCurrentY(null);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragEnter = (targetIndex: number) => {
    setDragOverIndex(targetIndex);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;

    setOrderedAnswers((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });

    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    if (step === 'ranking') {
      // Move to double down selection
      setStep('double-down');
    } else {
      // Complete the phase with rankings and double down
      const doubleDowns: Record<string, number> = {};
      if (selectedDoubleDown !== null) {
        // Add double down for all ranking players (everyone except the snake)
        rankingPlayers.forEach(player => {
          doubleDowns[player.id] = selectedDoubleDown;
        });
      }
      
      // Pass the complete ordered array (6 elements: 5 top + 1 snake)
      onComplete(orderedAnswers, orderedAnswers[5], doubleDowns);
    }
  };

  const handleDoubleDownSelect = (position: number) => {
    setSelectedDoubleDown(position === selectedDoubleDown ? null : position);
  };

  const handleBackToRanking = () => {
    setStep('ranking');
    setSelectedDoubleDown(null);
  };

  return (
    <div className="flex flex-col h-full mobile-container">
      {/* Header */}
      <div className="clean-card mx-2 mt-2 px-4 py-3 mb-2">
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
            <div className="body font-semibold mb-3">
              {gameState.currentCard.question}
            </div>
            {gameState.currentCard.source && (
              <div 
                className="caption text-xs mb-3" 
                style={{ color: "var(--text-tertiary)" }}
              >
                Source: {gameState.currentCard.source}
              </div>
            )}
            
            {/* Timer and Submit Button Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden>⏱</span>
                <div
                  className="body font-bold text-lg"
                  style={{
                    color: gameState.timeRemaining <= 30 ? "var(--danger)" : "var(--accent)",
                    animation: gameState.timeRemaining <= 30 ? "pulse 1s infinite" : "none",
                  }}
                >
                  {Math.floor(gameState.timeRemaining / 60)}:{(gameState.timeRemaining % 60).toString().padStart(2, "0")}
                </div>
              </div>
              
              {step === 'ranking' ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary touch-target px-3 py-2 text-sm font-semibold"
                >
                  Continue →
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleBackToRanking}
                    className="btn-secondary touch-target px-2 py-1 text-xs"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn-primary touch-target px-3 py-2 text-sm font-semibold"
                    disabled={selectedDoubleDown === null}
                  >
                    {selectedDoubleDown === null ? "Pick One" : "Lock In!"}
                  </button>
                </div>
              )}
            </div>
            
            <div className="caption text-xs">
              {step === 'ranking' 
                ? "Drag cards to set Top 5; last card is the Snake."
                : "Pick ONE position (1-5) to double down on for +3 bonus points if correct!"
              }
            </div>
          </>
        )}
      </div>

      {step === 'ranking' ? (
        /* Ranking Step - Single vertical list */
        <div className="flex-1 flex flex-col gap-2 overflow-hidden px-2">
          <div 
            ref={containerRef}
            className="clean-card flex-1 px-4 py-3 flex flex-col gap-3 scroll-container"
          >
            {orderedAnswers.map((answer, index) => {
              const isSnakeSlot = index === orderedAnswers.length - 1;
              const label = isSnakeSlot ? "Snake" : `#${index + 1}`;
              const isDragging = dragIndex === index;
              const isDragOver = dragOverIndex === index;

              return (
                <div
                  key={answer}
                  ref={isDragging ? dragElementRef : null}
                  className={`
                    flex items-center gap-3 rounded-xl px-4 py-2 touch-target
                    draggable-tile drop-zone game-element
                    ${isDragging ? 'dragging' : ''}
                    ${isDragOver ? 'drag-over' : ''}
                    ${isSnakeSlot
                      ? "border-2 border-green-400 bg-green-50/70"
                      : "border-2 border-dashed border-gray-300 bg-white/70"
                    }
                  `}
                  style={{
                    transform: isDragging && touchCurrentY && touchStartY 
                      ? `translateY(${touchCurrentY - touchStartY}px) scale(1.05) rotate(2deg)` 
                      : undefined,
                    zIndex: isDragging ? 1000 : undefined
                  }}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="touch-target">
                    <span
                      className="caption font-bold text-lg"
                      style={{
                        color: isSnakeSlot ? "#22c55e" : "var(--text-secondary)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <span className="flex-1 body leading-snug">
                    {answer}
                  </span>
                  <div className="touch-target">
                    <span className="text-2xl" style={{ color: "var(--text-tertiary)" }}>
                      ⠿
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Double Down Step */
        <div className="flex-1 flex flex-col gap-2 overflow-hidden px-2">
          <div className="clean-card flex-1 px-4 py-3 flex flex-col gap-3">
            <div className="body font-semibold text-center mb-2">💎 Choose Your Double Down</div>
            <div className="caption text-center mb-3 text-xs" style={{ color: "var(--text-secondary)" }}>
              Select ONE position you're most confident about:
            </div>
            
            {orderedAnswers.slice(0, 5).map((answer, index) => {
              const isSelected = selectedDoubleDown === index;
              
              return (
                <button
                  key={answer}
                  type="button"
                  onClick={() => handleDoubleDownSelect(index)}
                  className={`
                    flex items-center gap-3 rounded-xl px-4 py-2 touch-target
                    game-element transition-all duration-200
                    ${isSelected
                      ? "border-2 border-blue-500 bg-blue-50/70 shadow-lg"
                      : "border-2 border-dashed border-gray-300 bg-white/70 hover:border-blue-300"
                    }
                  `}
                >
                  <div className="touch-target">
                    <span
                      className="caption font-bold text-lg"
                      style={{
                        color: isSelected ? "#007aff" : "var(--text-secondary)",
                      }}
                    >
                      #{index + 1}
                    </span>
                  </div>
                  <span className="flex-1 body leading-snug text-left">
                    {answer}
                  </span>
                  <div className="touch-target">
                    <span className="text-2xl">
                      {isSelected ? "💎" : "○"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingPhase;
