"use client";

import React, { useState } from "react";
import { Player, GameState, Card } from "@/types/game";
import SnakeTurn from "./SnakeTurn";
import RankingPhase from "./RankingPhase";
import RevealPhase from "./RevealPhase";
import ScoringPhase from "./ScoringPhase";
import GameOver from "./GameOver";
import cardsData from "@/data/cards.json";

interface GameBoardProps {
  players: Player[];
  onRestart: () => void;
}

export default function GameBoard({ players, onRestart }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>({
    phase: "snake-turn",
    players: players,
    currentSnakeIndex: 0,
    currentCard: null,
    snakeAnswer: "",
    allAnswers: [],
    playerRankings: [],
    snakeChoice: "",
    doubleDowns: {},
    round: 1,
    totalRounds: players.length,
    timeRemaining: 120,
  });

  const [availableCards, setAvailableCards] = useState<Card[]>([...(cardsData as Card[])]);

  const drawCards = () => {
    // If we don't have enough cards, reset the deck
    if (availableCards.length < 3) {
      const shuffled = [...(cardsData as Card[])].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, 3);
      const remaining = shuffled.slice(3);
      setAvailableCards(remaining);
      return drawn;
    }

    // Draw from available cards
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, 3);
    const remaining = shuffled.slice(3);
    setAvailableCards(remaining);
    
    return drawn;
  };

  const handleSnakeSubmit = (card: Card, snakeAnswer: string) => {
    const allAnswers = [...card.answers];
    allAnswers.splice(card.snakePosition - 1, 0, snakeAnswer);
    const shuffledAnswers = [...allAnswers].sort(() => Math.random() - 0.5);

    setGameState({
      ...gameState,
      phase: "ranking",
      currentCard: card,
      snakeAnswer,
      allAnswers: shuffledAnswers,
      timeRemaining: 120,
    });
  };

  const handleRankingComplete = (
    rankings: string[],
    snakeChoice: string,
    doubleDowns: Record<string, number>
  ) => {
    setGameState({
      ...gameState,
      phase: "reveal",
      playerRankings: rankings,
      snakeChoice,
      doubleDowns,
    });
  };

  const handleRevealComplete = () => {
    setGameState({
      ...gameState,
      phase: "scoring",
    });
  };

  const handleNextRound = (updatedPlayers: Player[]) => {
    const nextRound = gameState.round + 1;
    const nextSnakeIndex = gameState.currentSnakeIndex + 1;

    if (nextRound > gameState.totalRounds) {
      setGameState({
        ...gameState,
        phase: "game-over",
        players: updatedPlayers,
      });
    } else {
      setGameState({
        ...gameState,
        phase: "snake-turn",
        players: updatedPlayers,
        currentSnakeIndex: nextSnakeIndex,
        currentCard: null,
        snakeAnswer: "",
        allAnswers: [],
        playerRankings: [],
        snakeChoice: "",
        doubleDowns: {},
        round: nextRound,
        timeRemaining: 120,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[var(--background)] overflow-hidden">
      {/* Header */}
      <header className="clean-card mx-2 mt-2 mb-2 px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐍</span>
          <div>
            <div className="title text-lg leading-tight font-bold">Out Snake the Jake</div>
            <p className="caption mt-1 text-sm">
              Round {gameState.round} of {gameState.totalRounds}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="btn-text touch-target px-3 py-2"
        >
          End Game
        </button>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {gameState.phase === "snake-turn" && (
          <SnakeTurn
            snake={gameState.players[gameState.currentSnakeIndex]}
            onSubmit={handleSnakeSubmit}
            drawCards={drawCards}
          />
        )}

        {gameState.phase === "ranking" && (
          <RankingPhase gameState={gameState} onComplete={handleRankingComplete} />
        )}

        {gameState.phase === "reveal" && (
          <RevealPhase gameState={gameState} onComplete={handleRevealComplete} />
        )}

        {gameState.phase === "scoring" && (
          <ScoringPhase gameState={gameState} onNextRound={handleNextRound} />
        )}

        {gameState.phase === "game-over" && (
          <GameOver players={gameState.players} onRestart={onRestart} />
        )}
      </main>
    </div>
  );
}
