export function generateSequence(seed) {
    const start = (seed % 10) + 1;
    const step = (seed % 5) + 2;
    const sequence = [start, start + step, start + step * 2, start + step * 3];
    const correctAnswer = start + step * 4;
    return {
      type: "sequence",
      text: `${sequence.join(", ")}, ?`,
      options: [correctAnswer, correctAnswer + step, correctAnswer - step, correctAnswer + 2].sort(() => 0.5 - Math.random()),
      correct: correctAnswer,
    };
  }
  
