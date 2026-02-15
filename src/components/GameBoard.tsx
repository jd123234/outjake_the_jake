"use client";

import React, { useState } from "react";
import { Player, GameState, Card } from "@/types/game";
import FoxTurn from "./FoxTurn";
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
    phase: "fox-turn",
    players: players,
    currentFoxIndex: 0,
    currentCard: null,
    foxAnswer: "",
    allAnswers: [],
    playerRankings: [],
    foxChoice: "",
    doubleDowns: {},
    round: 1,
    totalRounds: players.length,
    timeRemaining: 120,
  });

  const [availableCards, setAvailableCards] = useState<Card[]>([...cardsData]);

  const drawCards = () => {
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, 3);

    if (availableCards.length < 3) {
      setAvailableCards([...cardsData]);
      return [...cardsData].sort(() => Math.random() - 0.5).slice(0, 3);
    }

    return drawn;
  };

  const handleFoxSubmit = (card: Card, foxAnswer: string) => {
    const allAnswers = [...card.answers];
    allAnswers.splice(card.foxPosition - 1, 0, foxAnswer);
    const shuffledAnswers = [...allAnswers].sort(() => Math.random() - 0.5);

    setGameState({
      ...gameState,
      phase: "ranking",
      currentCard: card,
      foxAnswer,
      allAnswers: shuffledAnswers,
      timeRemaining: 120,
    });
  };

  const handleRankingComplete = (
    rankings: string[],
    foxChoice: string,
    doubleDowns: Record<string, number>
  ) => {
    setGameState({
      ...gameState,
      phase: "reveal",
      playerRankings: rankings,
      foxChoice,
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
    const nextFoxIndex = gameState.currentFoxIndex + 1;

    if (nextRound > gameState.totalRounds) {
      setGameState({
        ...gameState,
        phase: "game-over",
        players: updatedPlayers,
      });
    } else {
      setGameState({
        ...gameState,
        phase: "fox-turn",
        players: updatedPlayers,
        currentFoxIndex: nextFoxIndex,
        currentCard: null,
        foxAnswer: "",
        allAnswers: [],
        playerRankings: [],
        foxChoice: "",
        doubleDowns: {},
        round: nextRound,
        timeRemaining: 120,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="clean-card mx-4 mt-4 mb-2 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦊</span>
          <div>
            <div className="title-large leading-tight">Outfox the Fox</div>
            <p className="caption mt-1">
              Round {gameState.round} of {gameState.totalRounds}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="btn-text"
        >
          End Game
        </button>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex flex-col gap-2 px-4 pb-4 overflow-hidden">
        {gameState.phase === "fox-turn" && (
          <FoxTurn
            fox={gameState.players[gameState.currentFoxIndex]}
            onSubmit={handleFoxSubmit}
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
