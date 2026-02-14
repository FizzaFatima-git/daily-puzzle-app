import dayjs from "dayjs";

// Seeded RNG
function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(48271, h) % 0x7fffffff;
    return (h & 0x7fffffff) / 0x7fffffff;
  };
}

// Shuffle array
function shuffleArray(array, randomFunc) {
  return array
    .map((a) => [randomFunc(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

export function generateDailyPuzzles() {
  const today = dayjs().format("YYYY-MM-DD");
  const rand = seededRandom(today);

  // --- Math puzzle (arithmetic sequence) ---
  const start = Math.floor(rand() * 50) + 1;
  const step = Math.floor(rand() * 5) + 2;
  const mathQuestion = `${start}, ${start + step}, ${start + 2 * step}, ?`;
  const correctMath = `${start + 3 * step}`;
  const mathOptions = shuffleArray(
    [correctMath, `${start + 3 * step + 1}`, `${start + 3 * step - 1}`, `${start + 3 * step + 2}`],
    rand
  );

  // --- Unscramble puzzle ---
  const words = ["diamond", "planet", "quantum", "matrix", "galaxy"];
  const word = words[Math.floor(rand() * words.length)];
  const scrambled = shuffleArray(word.split(""), rand).join("");
  const unscrambleOptions = shuffleArray(
    [word, word.split("").reverse().join(""), word.slice(1) + word[0], word[0] + word.slice(1, -1)],
    rand
  );

  // --- GK puzzle ---
  const gkQuestions = [
    { q: "Which planet is known as the Red Planet?", correct: "Mars", options: ["Mars", "Venus", "Earth", "Jupiter"] },
    { q: "Largest ocean on Earth?", correct: "Pacific", options: ["Atlantic", "Indian", "Pacific", "Arctic"] },
    { q: "Fastest land animal?", correct: "Cheetah", options: ["Lion", "Tiger", "Cheetah", "Leopard"] },
  ];
  const gk = gkQuestions[Math.floor(rand() * gkQuestions.length)];
  const gkOptions = shuffleArray(gk.options, rand);

  // --- Pattern puzzle ---
  const patternStart = Math.floor(rand() * 20) + 1;
  const patternStep = Math.floor(rand() * 5) + 2;
  const patternQuestion = `${patternStart}, ${patternStart + patternStep}, ${patternStart + 2 * patternStep}, ?`;
  const patternCorrect = `${patternStart + 3 * patternStep}`;
  const patternOptions = shuffleArray(
    [patternCorrect, `${patternStart + 3 * patternStep + 1}`, `${patternStart + 3 * patternStep - 1}`, `${patternStart + 3 * patternStep + 2}`],
    rand
  );

  // --- Logic puzzle ---
  const logicOptionsSet = [
    { question: "Which Blue animal is in the box? Options: Cat, Dog, Rabbit", correct: "Cat", options: ["Cat", "Dog", "Rabbit"] },
    { question: "Which Red fruit is in the basket? Options: Apple, Banana, Cherry", correct: "Apple", options: ["Apple", "Banana", "Cherry"] },
  ];
  const logic = logicOptionsSet[Math.floor(rand() * logicOptionsSet.length)];
  const logicOptions = shuffleArray(logic.options, rand);

  return [
    { title: `Math - ${today}`, question: `Complete the sequence: ${mathQuestion}`, options: mathOptions, correct: correctMath },
    { title: `Unscramble - ${today}`, question: `Unscramble this word: '${scrambled}'`, options: unscrambleOptions, correct: word },
    { title: `GK - ${today}`, question: gk.q, options: gkOptions, correct: gk.correct },
    { title: `Pattern - ${today}`, question: `Complete the pattern: ${patternQuestion}`, options: patternOptions, correct: patternCorrect },
    { title: `Logic - ${today}`, question: logic.question, options: logicOptions, correct: logic.correct },
  ];
}

