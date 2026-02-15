"use client";

import React, { useState } from "react";
import { Card, Player } from "@/types/game";

interface SnakeTurnProps {
  snake: Player;
  onSubmit: (card: Card, snakeAnswer: string) => void;
  drawCards: () => Card[];
}

export default function SnakeTurn({ snake, onSubmit, drawCards }: SnakeTurnProps) {
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [snakeAnswer, setSnakeAnswer] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);

  const handleDrawCards = () => {
    const cards = drawCards();
    setDrawnCards(cards);
    setShowInstructions(false);
  };

  const handleSelectCard = (card: Card) => {
    setSelectedCard(card);
  };

  const handleSubmit = () => {
    if (selectedCard && snakeAnswer.trim()) {
      onSubmit(selectedCard, snakeAnswer.trim());
    }
  };

  const canSubmit = selectedCard && snakeAnswer.trim().length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {/* Step: choose card */}
        {showInstructions ? (
          <div className="clean-card px-4 py-3 mb-2">
            <div className="text-center max-w-2xl mx-auto space-y-6">
              <div className="text-5xl">🐍</div>
              <div className="space-y-2">
                <h2 className="title">{snake.name}, you're the Snake</h2>
                <p className="caption">Create a fake answer that blends in.</p>
              </div>
              <div className="surface-block p-5 space-y-3">
                <p className="body" style={{ color: "var(--text-secondary)" }}>
                  1. Draw 3 question cards and choose one.
                </p>
                <p className="body" style={{ color: "var(--text-secondary)" }}>
                  2. Read the real Top 5 answers.
                </p>
                <p className="body" style={{ color: "var(--text-secondary)" }}>
                  3. Write a fake answer in the marked position.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDrawCards}
                className="btn-primary inline-flex items-center justify-center gap-2 px-6"
              >
                <span>🎴 Draw 3 Cards</span>
              </button>
            </div>
          </div>
        ) : !selectedCard ? (
          /* Vertical list of candidate cards */
          <div className="clean-card flex-1 px-4 py-3 overflow-y-auto">
            <div className="space-y-3">
              {drawnCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className="w-full text-left surface-block px-3 py-3 flex flex-col gap-1"
                  onClick={() => handleSelectCard(card)}
                >
                  <span
                    className="caption uppercase tracking-wide"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {card.category}
                  </span>
                  <span className="body font-semibold">{card.question}</span>
                  {card.source && (
                    <span 
                      className="caption text-xs mt-1" 
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Source: {card.source}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Step: write fake answer */
          <div className="clean-card flex-1 px-4 py-3 overflow-y-auto space-y-3">
            {/* Question & answers */}
            <div className="space-y-2">
              <div className="space-y-1">
                <span
                  className="caption uppercase tracking-wide"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {selectedCard.category}
                </span>
                <h2 className="title">{selectedCard.question}</h2>
                {selectedCard.source && (
                  <p 
                    className="caption text-xs" 
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Source: {selectedCard.source}
                  </p>
                )}
              </div>
              
              <label className="body font-semibold" htmlFor="snake-answer">
                Your Snake answer
              </label>
              <input
                id="snake-answer"
                type="text"
                value={snakeAnswer}
                onChange={(e) => setSnakeAnswer(e.target.value)}
                placeholder="Type a believable fake answer"
              />
              <p
                className="caption"
                style={{ color: "var(--text-secondary)" }}
              >
                Tip: mirror the tone and length of the real answers.
              </p>

              {/* show all real answers in a compact list so the Snake can see the rankings */}
              <div className="space-y-1">
                {selectedCard.answers.map((answer, idx) => (
                  <div key={answer} className="surface-block px-3 py-2 body text-sm">
                    #{idx + 1} {answer}
                  </div>
                ))}
              </div>
            </div>

            {/* Fake answer input */}
            <div className="space-y-1">
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCard(null);
                    setSnakeAnswer("");
                  }}
                  className="btn-text"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="btn-primary flex-1"
                >
                  Submit & Continue →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
