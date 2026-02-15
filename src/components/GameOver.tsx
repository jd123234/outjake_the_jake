"use client";

import { Player } from "@/types/game";

interface GameOverProps {
  players: Player[];
  onRestart: () => void;
}

export default function GameOver({ players, onRestart }: GameOverProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <section className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="clean-card max-w-xl w-full px-6 py-8 md:px-8 md:py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl">🏆</div>
          <h1 className="title">Game over</h1>
          <p className="caption">Final scores for this game of Outfox the Fox.</p>
        </div>

        <div className="surface-block px-5 py-5 text-center space-y-2">
          <p className="caption" style={{ color: "var(--text-secondary)" }}>
            Winner
          </p>
          <div className="body font-semibold text-lg">{winner.name}</div>
          <div className="body" style={{ color: "var(--accent)" }}>
            {winner.score} points
          </div>
        </div>

        <div className="surface-block px-5 py-5 space-y-3">
          <h3 className="body font-semibold text-center">Final standings</h3>
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-[12px]"
                style={{ backgroundColor: "rgba(118,118,128,0.06)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="caption font-semibold">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : `#${index + 1}`}
                  </span>
                  <div
                    className="w-7 h-7 rounded-full"
                    style={{ backgroundColor: player.color.toLowerCase() }}
                  />
                  <span className="body">{player.name}</span>
                </div>
                <span className="body font-semibold">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-block px-5 py-4 text-center">
          <p className="caption" style={{ color: "var(--text-secondary)" }}>
            Thanks for playing{" "}
            <span className="body font-semibold">Outfox the Fox</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="btn-primary w-full"
        >
          Play again
        </button>
      </div>
    </section>
  );
}
