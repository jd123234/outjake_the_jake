"use client";

import React, { useState } from "react";
import { Player, GameState, Card } from "@/types/game";
import SnakeTurn from "./SnakeTurn";
import RankingPhase from "./RankingPhase";
import RevealPhase from "./RevealPhase";
import ScoringPhase from "./ScoringPhase";
import GameOver from "./GameOver";
import Logo from "./Logo";
import cardsData from "@/data/cards.json";

interface GameBoardProps {
  players: Player[];
  winningScore?: number;
  onRestart: () => void;
}

export default function GameBoard({ players, winningScore = 10, onRestart }: GameBoardProps) {
  const shuffleCards = (cards: Card[]) => [...cards].sort(() => Math.random() - 0.5);

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
    winningScore: winningScore,
  });

  const [drawPile, setDrawPile] = useState<Card[]>(() => shuffleCards(cardsData as Card[]));
  const [lastDrawnIds, setLastDrawnIds] = useState<number[]>([]);

  const drawCards = () => {
    let pile = drawPile;

    // If we don't have enough cards, reset the deck
    if (pile.length < 3) {
      pile = shuffleCards(cardsData as Card[]);
    }

    let drawn = pile.slice(0, 3);
    let attempts = 0;

    while (attempts < 6 && drawn.some((card) => lastDrawnIds.includes(card.id))) {
      pile = shuffleCards(pile);
      drawn = pile.slice(0, 3);
      attempts += 1;
    }

    const remaining = pile.slice(3);
    setDrawPile(remaining);
    setLastDrawnIds(drawn.map((card) => card.id));

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
    // Check if anyone has reached the winning score
    const winner = updatedPlayers.find(player => player.score >= (gameState.winningScore || 10));
    
    if (winner) {
      setGameState({
        ...gameState,
        phase: "game-over",
        players: updatedPlayers,
      });
    } else {
      const nextRound = gameState.round + 1;
      const nextSnakeIndex = (gameState.currentSnakeIndex + 1) % gameState.players.length;

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
      <header className="clean-card mx-2 mt-2 mb-2 px-4 py-3 flex items-center justify-center gap-3 flex-shrink-0 relative">
        {gameState.players.length <= 3 && (
          <Logo size={80} className="absolute left-4 top-1/2 -translate-y-1/2" />
        )}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className={`flex items-center w-full ${gameState.players.length > 4 ? 'justify-center' : 'justify-center'} relative`}>
            <p className="caption text-sm" style={{ color: "var(--text-secondary)" }}>
              First to {gameState.winningScore || 10} points
            </p>
            {gameState.players.length >= 4 && (
              <button
                type="button"
                onClick={onRestart}
                className="btn-text touch-target px-2 py-1 text-xs border border-[color:var(--accent)] rounded absolute right-0"
                style={{ minWidth: 0 }}
              >
                End Game
              </button>
            )}
          </div>
          {gameState.players.length >= 3 ? (
            <div
              className={`grid -mt-2 ${gameState.players.length === 3 ? "gap-0 w-11/12 max-w-md mx-auto" : "gap-2 w-full"}`}
              style={{ gridTemplateColumns: `repeat(${gameState.players.length}, minmax(0, 1fr))` }}
            >
              {gameState.players.map((p) => (
                <div key={p.id} className="flex flex-col items-center gap-0.5 min-w-0">
                  <div className="text-xl font-semibold text-center truncate">{p.name}</div>
                  <div className="text-3xl font-bold text-[color:var(--accent)]">{p.score}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`flex flex-wrap items-center justify-center w-full ml-0 ${gameState.players.length > 4 ? 'mr-0' : ''} -mt-2 -space-x-2`}>
              {gameState.players.map((p) => (
                <div key={p.id} className="flex flex-col items-center gap-0.5 min-w-12 max-w-20 flex-1">
                  <div className="text-xl font-semibold text-center truncate">{p.name}</div>
                  <div className="text-3xl font-bold text-[color:var(--accent)]">{p.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {gameState.players.length <= 3 && (
          <button
            type="button"
            onClick={onRestart}
            className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg"
            style={{
              right: '1rem', // matches left-4 for logo
              width: 64,
              height: 64,
              background: '#2563eb', // Tailwind blue-600
              color: 'white',
              fontWeight: 700,
              fontSize: 17,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: 'none',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
          >
            End<br />Game
          </button>
        )}
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
