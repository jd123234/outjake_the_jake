"use client";

import { useState } from "react";
import { Player, PLAYER_COLORS } from "@/types/game";


interface GameSetupProps {
  onStart: (players: Player[], winningScore?: number) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
  const [winningScore, setWinningScore] = useState(10);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill("").map((_, i) => playerNames[i] || ""));
  };

  const handleNameChange = (index: number, name: string) => {
    // Capitalize the first letter automatically
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    const newNames = [...playerNames];
    newNames[index] = capitalized;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name: name || `Player ${index + 1}`,
      color: PLAYER_COLORS[index].name,
      score: 0,
    }));
    onStart(players, winningScore);
  };

  const canStart = playerNames.filter((n) => n.trim()).length >= 2;

  return (
    <div className="flex flex-col h-full mobile-container">
      <div className="mx-2 my-4 p-6 space-y-4 flex-1 overflow-y-auto text-center">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4 relative">
            <div className="w-full">
              <h1 className="title-large">Out Snake the Jake</h1>
              <p className="caption">Bluff your way to victory</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          <section>
            <h2 className="title mb-2">How to Play</h2>
            <div className="space-y-1 body text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
              <p>• One player is the Snake and creates a fake answer.</p>
              <p>• Everyone ranks the answers from #1 to #5.</p>
              <p>• Guess which answer belongs to the Snake.</p>
              <p>• Double down on one answer for bonus points.</p>
            </div>
          </section>

          <section>
            <label className="title block mb-4 text-lg font-semibold">
              Number of Players
            </label>
            <div className="grid grid-cols-5 gap-3">
              {[2, 3, 4, 5, 6].map((count) => {
                const isActive = playerCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handlePlayerCountChange(count)}
                    className={"btn-secondary text-center touch-target" + (isActive ? " bg-[color:var(--accent-soft)]" : "")}
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text-secondary)",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <label className="title block mb-4 text-lg font-semibold">
              Winning Score
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[10, 20, 30, 40].map((score) => {
                const isActive = winningScore === score;
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setWinningScore(score)}
                    className={"btn-secondary text-center touch-target" + (isActive ? " bg-[color:var(--accent-soft)]" : "")}
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text-secondary)",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {score}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <label className="title block mb-4 text-lg font-semibold">
              Player Names
            </label>
            <div className="space-y-4">
              {Array.from({ length: playerCount }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex-shrink-0 ${PLAYER_COLORS[index].bg}`}
                  />
                  <input
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    value={playerNames[index] || ""}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="text-lg py-3"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="btn-primary w-full touch-target text-lg font-semibold py-4"
            >
              {canStart ? "🐍 Start Game" : "Enter at least 2 player names"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
