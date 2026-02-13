export function generatePatternMatching(seed) {
    const patterns = [
      { pattern: "⬛⬜⬛⬜⬛", answer: "⬜" },
      { pattern: "▲▲▼▲▲", answer: "▼" },
    ];
    const selected = patterns[seed % patterns.length];
    return {
      type: "pattern",
      text: `Next in pattern: ${selected.pattern}`,
      options: [selected.answer],
      correct: selected.answer,
    };
  }
  