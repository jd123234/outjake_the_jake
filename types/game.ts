export interface Card {
  id: number;
  question: string;
  answers: string[];
  foxPosition: number; // 1-5, where the fox answer should be inserted
}

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
}

export interface GameState {
  phase: 'setup' | 'fox-turn' | 'ranking' | 'reveal' | 'scoring' | 'game-over';
  players: Player[];
  currentFoxIndex: number;
  currentCard: Card | null;
  foxAnswer: string;
  allAnswers: string[]; // 5 real + 1 fox answer
  playerRankings: string[]; // Ordered by players (position 0 = #1)
  doubleDowns: Record<string, number>; // playerId -> answer index
  round: number;
  totalRounds: number;
  timeRemaining: number;
}

export const PLAYER_COLORS = [
  { name: 'Orange', bg: 'bg-orange-500', border: 'border-orange-600', text: 'text-orange-600' },
  { name: 'Blue', bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-blue-600' },
  { name: 'Green', bg: 'bg-green-500', border: 'border-green-600', text: 'text-green-600' },
  { name: 'Purple', bg: 'bg-purple-500', border: 'border-purple-600', text: 'text-purple-600' },
  { name: 'Pink', bg: 'bg-pink-500', border: 'border-pink-600', text: 'text-pink-600' },
  { name: 'Yellow', bg: 'bg-yellow-500', border: 'border-yellow-600', text: 'text-yellow-600' },
];
