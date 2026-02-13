import { deterministicShuffle } from "../utils/shuffle";

export function generateWordScramble(seed) {
  const words = ["function", "variable", "array", "object", "react"];
  const word = words[seed % words.length];
  return {
    type: "wordScramble",
    text: `Unscramble this word: ${deterministicShuffle(word.split(""), seed).join("")}`,
    options: [word], // only one correct answer for now
    correct: word,
  };
}

  