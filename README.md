# 🦊 Outfox the Fox - Party Game

A fun, fox-themed party game built with Next.js where players try to identify a fake answer inserted by "The Fox" into a Top 5 list!

## 🎮 How to Play

1. **Setup**: Enter 2-6 player names
2. **The Fox's Turn**: One player becomes the Fox and:
   - Draws 3 question cards
   - Selects one card (without seeing answers)
   - Reads the 5 real answers
   - Creates a convincing fake answer
3. **Ranking Phase**: Other players work together to rank all 6 answers
4. **Double Down**: Each player can place their token on ONE answer for bonus points
5. **Reveal & Score**: 
   - Fox scores based on how highly their fake answer ranks
   - Players score for correct rankings
   - Double-down bonuses for exact matches
6. **Winner**: Play continues until everyone has been the Fox once!

## 🚀 Getting Started

### Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

## 📝 Game Features

- ✅ Complete turn-based gameplay
- ✅ Fox turn with card selection
- ✅ Collaborative ranking with drag-and-drop
- ✅ Double-down mechanic for bonus points
- ✅ Scoring system with range tolerance (2-3 and 4-5 count as correct)
- ✅ 2-minute timer per round
- ✅ Final leaderboard and winner announcement
- ✅ Beautiful fox-themed UI with animations

## 🎴 Adding Custom Cards

Edit `src/data/cards.json` to add your own Top 5 lists:

```json
{
  "id": 1,
  "question": "Your Top 5 Category",
  "answers": [
    "First Answer",
    "Second Answer",
    "Third Answer",
    "Fourth Answer",
    "Fifth Answer"
  ],
  "foxPosition": 3
}
```

- `foxPosition`: Where the Fox's answer will be inserted (1-5)

## 🛠️ Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main game entry
│   └── layout.tsx        # App layout
├── components/
│   ├── GameSetup.tsx     # Player setup screen
│   ├── GameBoard.tsx     # Main game controller
│   ├── FoxTurn.tsx       # Fox's card selection & answer creation
│   ├── RankingPhase.tsx  # Player ranking interface
│   ├── RevealPhase.tsx   # Answer reveal animation
│   ├── ScoringPhase.tsx  # Score calculation & display
│   ├── GameOver.tsx      # Final results
│   └── Timer.tsx         # Round timer
├── types/
│   └── game.ts           # TypeScript interfaces
└── data/
    └── cards.json        # Question cards database
```

## 🎯 Scoring Rules

### The Fox:
- Ranked #1: **5 points**
- Ranked #2 or #3: **4 points**
- Ranked #4 or #5: **3 points**
- Identified as fake: **0 points**

### Guessers:
- Correct ranking: **1 point per answer**
- Answers in 2-3 or 4-5 range count as correct
- Double-down (exact match): **+3 bonus points**

## 🎨 Customization

The game uses a warm, fox-themed color palette with oranges, ambers, and browns. Edit `src/app/globals.css` and component styles to customize the appearance.

## 📱 Responsive Design

Works on desktop and mobile devices - perfect for passing a single device around or projecting for larger groups!

## 🤝 Contributing

Feel free to add more question cards or enhance the gameplay!

## 📄 License

This is a personal project. Feel free to use and modify!

---

**Have fun trying to Outfox the Fox!** 🦊🎉
