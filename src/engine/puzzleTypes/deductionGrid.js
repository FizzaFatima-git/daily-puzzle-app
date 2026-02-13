export function generateDeductionGrid(seed) {
    return {
      type: "deduction",
      text: "If A>B and B>C, who is biggest?",
      options: ["A", "B", "C"],
      correct: "A",
    };
  }
  
  