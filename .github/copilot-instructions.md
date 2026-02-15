# Copilot Instructions for Outfox the Fox

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js party game called "Outfox the Fox" with the following characteristics:

- **Game Type**: Turn-based party game where one player is the "Fox" who creates a fake answer
- **Technology**: Next.js 15+ with TypeScript, React, and Tailwind CSS
- **Theme**: Fox-themed with playful, fun UI elements
- **Gameplay**: Players rank Top 5 lists with one fake answer inserted by the Fox
- **Local Multiplayer**: Single device, pass-and-play style

## Game Rules
1. One player is the Fox who selects a question card
2. Fox reads 5 real answers + inserts 1 fake answer at position marked [The Fox]
3. Other players collaborate to rank all 6 answers
4. Players can "double down" on one answer for bonus points
5. Fox scores based on how highly their fake answer is ranked
6. Players score for correct rankings and double-down bonuses

## Code Style
- Use TypeScript for type safety
- Tailwind CSS for styling with fox-themed colors (oranges, browns, warm tones)
- Component-based architecture
- Fun animations and transitions
