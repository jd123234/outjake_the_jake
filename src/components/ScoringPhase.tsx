"use client";

import { useMemo } from "react";
import { GameState, Player } from "@/types/game";

interface ScoringPhaseProps {
  gameState: GameState;
  onNextRound: (updatedPlayers: Player[]) => void;
}

export default function ScoringPhase({ gameState, onNextRound }: ScoringPhaseProps) {
  const snakePlayer = gameState.players[gameState.currentSnakeIndex];
  const rankingPlayers = gameState.players.filter(
    (_, i) => i !== gameState.currentSnakeIndex
  );
  const isSnakeCaught = gameState.snakeChoice === gameState.snakeAnswer;
  const { updatedPlayers, scores } = useMemo(() => {
    const calculateScores = () => {
      const updatedPlayers = gameState.players.map((p) => ({ ...p }));
      const correctAnswers = gameState.currentCard?.answers || [];
      const scores: Record<string, number> = {};

      updatedPlayers.forEach((player) => {
        scores[player.id] = 0;
      });

      const snakePlayerId = updatedPlayers[gameState.currentSnakeIndex].id;
      const snakeAnswerInRankings = gameState.playerRankings.indexOf(
        gameState.snakeAnswer
      );

      if (snakeAnswerInRankings === 0) {
        scores[snakePlayerId] = 5;
      } else if (snakeAnswerInRankings === 1 || snakeAnswerInRankings === 2) {
        scores[snakePlayerId] = 4;
      } else if (snakeAnswerInRankings === 3 || snakeAnswerInRankings === 4) {
        scores[snakePlayerId] = 3;
      }

      const guessers = updatedPlayers.filter(
        (_, i) => i !== gameState.currentSnakeIndex
      );

      guessers.forEach((player) => {
        let playerScore = 0;

        // Regular ranking scoring
        gameState.playerRankings.forEach((rankedAnswer, position) => {
          const correctPosition = correctAnswers.indexOf(rankedAnswer);
          if (correctPosition === -1) return;

          if (position === 0 && correctPosition === 0) {
            playerScore += 1;
          } else if (
            (position === 1 || position === 2) &&
            (correctPosition === 1 || correctPosition === 2)
          ) {
            playerScore += 1;
          } else if (
            (position === 3 || position === 4) &&
            (correctPosition === 3 || correctPosition === 4)
          ) {
            playerScore += 1;
          }
        });

        // Double down bonus scoring (+3 points for exact match)
        const doubleDownPosition = gameState.doubleDowns[player.id];
        if (doubleDownPosition !== undefined) {
          const doubleDownAnswer = gameState.playerRankings[doubleDownPosition];
          const correctPosition = correctAnswers.indexOf(doubleDownAnswer);
          // Award 3 points only if the answer is in the EXACT position they doubled down on
          if (correctPosition === doubleDownPosition) {
            playerScore += 3;
          }
        }

        scores[player.id] = playerScore;
      });

      return { updatedPlayers, scores };
    };

    return calculateScores();
  }, []);

  return (
    <div className="flex flex-col h-full mobile-container relative">
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3 pb-2">
        <div className="clean-card px-4 py-4 space-y-3 pb-9 mb-0">
          <div className="text-center space-y-1 mb-1.5">
            <h2 className="title">Round {gameState.round} Results</h2>
            <p className="caption">See how the Snake and guessers did.</p>
          </div>
          <div
            className="surface-block px-5 py-3 flex items-center justify-between gap-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,159,10,0.22), rgba(255,149,0,0.18))",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐍</span>
              <div>
                <div className="body font-semibold">{snakePlayer.name}</div>
                <div className="caption">
                  {isSnakeCaught
                    ? "Their answer was caught."
                    : `Fake answer ranked #${
                        gameState.playerRankings.indexOf(gameState.snakeAnswer) + 1
                      }`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className="body font-semibold"
                style={{ color: "#22c55e" }}
              >
                +{scores[snakePlayer.id]}
              </div>
              <div className="caption">
                Total {updatedPlayers[gameState.currentSnakeIndex].score}
              </div>
            </div>
          </div>

        <div className="space-y-2">
          <h3 className="body font-semibold">Guessers</h3>
          {rankingPlayers.map((player) => {
            const updatedPlayer = updatedPlayers.find(
              (p) => p.id === player.id
            )!;
            const doubleDownPosition = gameState.doubleDowns[player.id];
            const hadDoubleDown = doubleDownPosition !== undefined;
            
            // Calculate breakdown of score
            let regularPoints = 0;
            let doubleDownPoints = 0;
            
            // Calculate regular points
            gameState.playerRankings.forEach((rankedAnswer, position) => {
              const correctPosition = gameState.currentCard?.answers.indexOf(rankedAnswer) || -1;
              if (correctPosition === -1) return;

              if (position === 0 && correctPosition === 0) {
                regularPoints += 1;
              } else if (
                (position === 1 || position === 2) &&
                (correctPosition === 1 || correctPosition === 2)
              ) {
                regularPoints += 1;
              } else if (
                (position === 3 || position === 4) &&
                (correctPosition === 3 || correctPosition === 4)
              ) {
                regularPoints += 1;
              }
            });
            
            // Calculate double down points
            if (hadDoubleDown) {
              const doubleDownAnswer = gameState.playerRankings[doubleDownPosition];
              const correctPosition = gameState.currentCard?.answers.indexOf(doubleDownAnswer) || -1;
              if (correctPosition === doubleDownPosition) {
                doubleDownPoints = 3;
              }
            }

            return (
              <div
                key={player.id}
                className="surface-block px-5 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: player.color.toLowerCase() }}
                  />
                  <div>
                    <div className="body font-semibold">{player.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="body font-semibold"
                    style={{ color: scores[player.id] > 0 ? "var(--success)" : "var(--text-secondary)" }}
                  >
                    +{scores[player.id]}
                  </div>
                  <div className="caption">Total {updatedPlayer.score}</div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onNextRound(updatedPlayers)}
        className="fixed bottom-2 left-4 right-4 btn-primary text-lg font-semibold z-50"
      >
        {updatedPlayers.some(player => player.score >= (gameState.winningScore || 10))
          ? "See Final Results 🏆"
          : "Next Round →"}
      </button>
    </div>
  );
}
