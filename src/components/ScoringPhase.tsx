"use client";

import { useMemo } from "react";
import { GameState, Player } from "@/types/game";

interface ScoringPhaseProps {
  gameState: GameState;
  onNextRound: (updatedPlayers: Player[]) => void;
}

export default function ScoringPhase({ gameState, onNextRound }: ScoringPhaseProps) {
  const { updatedPlayers, scores } = useMemo(() => {
    const calculateScores = () => {
      const updatedPlayers = gameState.players.map((p) => ({ ...p }));
      const correctAnswers = gameState.currentCard?.answers || [];
      const scores: Record<string, number> = {};

      updatedPlayers.forEach((player) => {
        scores[player.id] = 0;
      });

      const foxPlayerId = updatedPlayers[gameState.currentFoxIndex].id;
      const foxAnswerInRankings = gameState.playerRankings.indexOf(
        gameState.foxAnswer
      );

      if (foxAnswerInRankings === 0) {
        scores[foxPlayerId] = 5;
      } else if (foxAnswerInRankings === 1 || foxAnswerInRankings === 2) {
        scores[foxPlayerId] = 4;
      } else if (foxAnswerInRankings === 3 || foxAnswerInRankings === 4) {
        scores[foxPlayerId] = 3;
      }

      const guessers = updatedPlayers.filter(
        (_, i) => i !== gameState.currentFoxIndex
      );

      guessers.forEach((player) => {
        let playerScore = 0;

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

        const doubleDownPosition = gameState.doubleDowns[player.id];
        if (doubleDownPosition !== undefined) {
          const doubleDownAnswer = gameState.playerRankings[doubleDownPosition];
          const correctPosition = correctAnswers.indexOf(doubleDownAnswer);
          if (correctPosition === doubleDownPosition) {
            playerScore += 1;
          }
        }

        scores[player.id] = playerScore;
      });

      updatedPlayers.forEach((player) => {
        player.score += scores[player.id];
      });

      return { updatedPlayers, scores };
    };

    return calculateScores();
  }, []);

  const foxPlayer = gameState.players[gameState.currentFoxIndex];
  const guessers = gameState.players.filter(
    (_, i) => i !== gameState.currentFoxIndex
  );
  const isFoxCaught = gameState.foxChoice === gameState.foxAnswer;

  return (
    <section className="space-y-6">
      <div className="clean-card px-6 py-6 text-center space-y-1">
        <h2 className="title">Round {gameState.round} scores</h2>
        <p className="caption">See how the Fox and guessers did.</p>
      </div>

      <div className="clean-card px-6 py-6 space-y-4">
        <div
          className="surface-block px-5 py-4 flex items-center justify-between gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,159,10,0.22), rgba(255,149,0,0.18))",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦊</span>
            <div>
              <div className="body font-semibold">{foxPlayer.name}</div>
              <div className="caption">
                {isFoxCaught
                  ? "Their answer was caught."
                  : `Fake answer ranked #${
                      gameState.playerRankings.indexOf(gameState.foxAnswer) + 1
                    }`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div
              className="body font-semibold"
              style={{ color: "#ff9f0a" }}
            >
              +{scores[foxPlayer.id]}
            </div>
            <div className="caption">
              Total {updatedPlayers[gameState.currentFoxIndex].score}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="body font-semibold">Guessers</h3>
          {guessers.map((player) => {
            const updatedPlayer = updatedPlayers.find(
              (p) => p.id === player.id
            )!;
            const doubleDownPosition = gameState.doubleDowns[player.id];
            const hadDoubleDown = doubleDownPosition !== undefined;

            return (
              <div
                key={player.id}
                className="surface-block px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: player.color.toLowerCase() }}
                  />
                  <div>
                    <div className="body font-semibold">{player.name}</div>
                    {hadDoubleDown && (
                      <div className="caption">
                        💎 double down on #{doubleDownPosition! + 1}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="body font-semibold"
                    style={{ color: "var(--success)" }}
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

      <div className="clean-card px-6 py-6 space-y-4">
        <div className="space-y-2">
          <h3 className="body font-semibold text-center">Leaderboard</h3>
          <div className="space-y-2">
            {[...updatedPlayers]
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="surface-block px-4 py-3 flex items-center justify-between gap-3"
                  style={{
                    backgroundColor:
                      index === 0
                        ? "rgba(0,122,255,0.16)"
                        : "var(--background-elevated)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="caption font-semibold">
                      {index === 0 ? "🏆" : `#${index + 1}`}
                    </span>
                    <span className="body">{player.name}</span>
                  </div>
                  <span className="body font-semibold">{player.score}</span>
                </div>
              ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNextRound(updatedPlayers)}
          className="btn-primary w-full"
        >
          {gameState.round < gameState.totalRounds
            ? "Next round →"
            : "See final results 🏆"}
        </button>
      </div>
    </section>
  );
}
