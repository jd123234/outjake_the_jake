"use client";

import { useState } from "react";
import GameSetup from "@/components/GameSetup";
import GameBoard from "@/components/GameBoard";
import { Player } from "@/types/game";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  const handleStartGame = (selectedPlayers: Player[]) => {
    setPlayers(selectedPlayers);
    setGameStarted(true);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setPlayers([]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[var(--background)] overflow-hidden">
      <div className="flex-1 flex items-center justify-center">
        {gameStarted ? (
          <GameBoard players={players} onRestart={handleRestart} />
        ) : (
          <GameSetup onStart={handleStartGame} />
        )}
      </div>
    </div>
  );
}
