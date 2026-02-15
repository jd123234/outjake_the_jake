export interface Card {
  id: number;
  question: string;
  // Optional category label, e.g. "Art", "Video Games"
  category?: string;
  answers: string[];
  snakePosition: number; // 1-5, where the snake answer should be inserted
  source?: string; // Optional source citation for the card data
}

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
}

export interface GameState {
  phase: 'setup' | 'snake-turn' | 'ranking' | 'reveal' | 'scoring' | 'game-over';
  players: Player[];
  currentSnakeIndex: number;
  currentCard: Card | null;
  snakeAnswer: string;
  allAnswers: string[]; // 5 real + 1 snake answer
  playerRankings: string[]; // Only 5 positions (1-5)
  snakeChoice: string; // Which answer players think is the Snake
  doubleDowns: Record<string, number>; // playerId -> answer index (0-4 for positions 1-5)
  round: number;
  totalRounds: number;
  timeRemaining: number;
  winningScore?: number;
}

export const PLAYER_COLORS = [
  { name: 'Green', bg: 'bg-green-500', border: 'border-green-600', text: 'text-green-600' },
  { name: 'Blue', bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-blue-600' },
  { name: 'Orange', bg: 'bg-orange-500', border: 'border-orange-600', text: 'text-orange-600' },
  { name: 'Purple', bg: 'bg-purple-500', border: 'border-purple-600', text: 'text-purple-600' },
  { name: 'Pink', bg: 'bg-pink-500', border: 'border-pink-600', text: 'text-pink-600' },
  { name: 'Yellow', bg: 'bg-yellow-500', border: 'border-yellow-600', text: 'text-yellow-600' },
];
