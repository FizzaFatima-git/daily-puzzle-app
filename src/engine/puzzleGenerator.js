import { generateSequence } from "./puzzleTypes/sequence";
import { generateWordScramble } from "./puzzleTypes/wordScramble";
import { generateTrivia } from "./puzzleTypes/trivia";

export function generateDailyPuzzle(seed) {
  const types = [generateSequence, generateWordScramble, generateTrivia];
  const typeIndex = seed % types.length;
  return types[typeIndex](seed);
}

