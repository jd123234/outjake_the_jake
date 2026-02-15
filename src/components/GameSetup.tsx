"use client";

import { useState } from "react";
import { Player, PLAYER_COLORS } from "@/types/game";

interface GameSetupProps {
  onStart: (players: Player[]) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill("").map((_, i) => playerNames[i] || ""));
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name: name || `Player ${index + 1}`,
      color: PLAYER_COLORS[index].name,
      score: 0,
    }));
    onStart(players);
  };

  const canStart = playerNames.filter((n) => n.trim()).length >= 2;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="clean-card w-full mx-4 p-4 space-y-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🦊</span>
            <div>
              <h1 className="title-large">Outfox the Fox</h1>
              <p className="caption">Bluff your way to victory</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="title mb-3">How to Play</h2>
            <div className="space-y-2 body" style={{ color: "var(--text-secondary)" }}>
              <p>• One player is the Fox and creates a fake answer.</p>
              <p>• Everyone ranks the answers from #1 to #5.</p>
              <p>• Guess which answer belongs to the Fox.</p>
              <p>• Double down on one answer for bonus points.</p>
            </div>
          </section>

          <section>
            <label className="title block mb-3 text-[17px] font-semibold">
              Number of Players
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((count) => {
                const isActive = playerCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handlePlayerCountChange(count)}
                    className={"btn-secondary text-center" + (isActive ? " bg-[color:var(--accent-soft)]" : "")}
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
            <label className="title block mb-3 text-[17px] font-semibold">
              Player Names
            </label>
            <div className="space-y-3">
              {Array.from({ length: playerCount }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex-shrink-0 ${PLAYER_COLORS[index].bg}`}
                  />
                  <input
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    value={playerNames[index] || ""}
                    onChange={(e) => handleNameChange(index, e.target.value)}
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
              className="btn-primary w-full"
            >
              {canStart ? "🦊 Start Game" : "Enter at least 2 player names"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
