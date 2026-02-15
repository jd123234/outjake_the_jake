"use client";

import React, { useState } from "react";
import { GameState } from "@/types/game";
import Timer from "./Timer";

interface RankingPhaseProps {
  gameState: GameState;
  onComplete: (
    rankings: string[],
    foxChoice: string,
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

  const handleDragStart = (index: number) => {
    setDragIndex(index);
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
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    // Pass the complete ordered array (6 elements: 5 top + 1 fox)
    onComplete(orderedAnswers, orderedAnswers[5], gameState.doubleDowns ?? {});
  };

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
            <div className="caption flex items-center justify-between pt-1">
              <span>Drag cards to set Top 5; last card is the Fox.</span>
              <Timer initialSeconds={gameState.timeRemaining} />
            </div>
          </>
        )}
      </div>

      {/* Single vertical list */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        <div className="clean-card flex-1 px-4 py-3 flex flex-col gap-2">
          {orderedAnswers.map((answer, index) => {
            const isFoxSlot = index === orderedAnswers.length - 1;
            const label = isFoxSlot ? "Fox" : `#${index + 1}`;

            return (
              <div
                key={answer}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                  isFoxSlot
                    ? "border border-orange-400 bg-orange-50/70"
                    : "border border-dashed border-gray-300 bg-white/70"
                }`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <span
                  className="caption font-semibold"
                  style={{
                    color: isFoxSlot ? "#ff9f0a" : "var(--text-secondary)",
                  }}
                >
                  {label}
                </span>
                <span className="flex-1 body text-sm leading-snug">
                  {answer}
                </span>
                <span className="caption text-[var(--text-tertiary)]">
                  ⠿
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer submit */}
        <div className="clean-card px-4 py-3 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary"
          >
            Lock in order
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingPhase;
