export function generateMath(seed) {
    const num1 = (seed % 20) + 5;
    const num2 = (seed % 10) + 2;
  
    const correctAnswer = num1 * num2;
  
    return {
      type: "math",
      text: `${num1} × ${num2} = ?`,
      options: [
        correctAnswer,
        correctAnswer + 5,
        correctAnswer - 3,
        correctAnswer + 2,
      ].sort(() => 0.5 - Math.random()),
      correct: correctAnswer,
    };
  }
  
  