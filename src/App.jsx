

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Puzzle Component ---
function Puzzle({ title, question, solution, hint, onSolve }) {
  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const checkSolution = () => {
    if (solved) return;
    if (input.trim().toLowerCase() === solution.toLowerCase()) {
      // Play success sound
      new Audio("/correct.mp3").play();

      onSolve(100);
      setSolved(true);
      setInput("");
    } else {
      alert("Try again!");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={title}
        className={`p-4 border rounded mb-2 ${solved ? "bg-green-100" : "bg-white"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-bold">{title}</h2>
        <p className="mb-2">{question}</p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-1 mr-2"
          disabled={solved}
        />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={checkSolution}
          className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
          disabled={solved}
        >
          Submit
        </motion.button>

        {/* Hint Button */}
        <button
          onClick={() => setShowHint(!showHint)}
          className="ml-2 px-2 py-1 bg-yellow-400 text-black rounded"
        >
          Hint
        </button>

        {showHint && (
          <p className="mt-1 text-sm text-gray-700 italic">{hint}</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// --- Main App ---
function App() {
  const [points, setPoints] = useState(
    () => JSON.parse(localStorage.getItem("points")) || 0
  );
  const [streak, setStreak] = useState(
    () => JSON.parse(localStorage.getItem("streak")) || 0
  );
  const [lastReset, setLastReset] = useState(
    () => JSON.parse(localStorage.getItem("lastReset")) || new Date().toDateString()
  );

  // Daily reset logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastReset !== today) {
      setLastReset(today);
      localStorage.setItem("lastReset", JSON.stringify(today));
      setPoints(0);
      localStorage.setItem("points", JSON.stringify(0));
      setStreak(0);
      localStorage.setItem("streak", JSON.stringify(0));
      alert("Daily puzzles reset! 🔄");
    }
  }, [lastReset]);

  // Persist points & streak
  useEffect(() => {
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("streak", JSON.stringify(streak));
  }, [points, streak]);

  const handleSolve = (score) => {
    setPoints((prev) => prev + score);
    setStreak((prev) => prev + 1);
  };

  // Puzzles with hints
  const puzzles = [
    {
      title: "Puzzle 1",
      question: "What comes next in the sequence: 2, 4, 6, ?",
      solution: "8",
      hint: "Look at the pattern of even numbers increasing by 2.",
    },
    {
      title: "Puzzle 2",
      question: "Unscramble the word: 'LPAEP'",
      solution: "apple",
      hint: "It's a fruit that keeps the doctor away.",
    },
    {
      title: "Puzzle 3",
      question: "If A=1, B=2, C=3… what is D+E?",
      solution: "9",
      hint: "D=4, E=5, add them together.",
    },
    {
      title: "Puzzle 4",
      question: "What is 5 × 3?",
      solution: "15",
      hint: "Multiply 5 by 3.",
    },
    {
      title: "Puzzle 5",
      question: "I speak without a mouth and hear without ears. What am I?",
      solution: "echo",
      hint: "You hear me in caves or empty rooms.",
    },
  ];

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Logic Looper</h1>
      <h2 className="text-xl mb-4">
        🔥 Streak: {streak} days | Total Points: {points}
      </h2>

      {/* Render puzzles */}
      {puzzles.map((puzzle, idx) => (
        <Puzzle
          key={idx}
          title={puzzle.title}
          question={puzzle.question}
          solution={puzzle.solution}
          hint={puzzle.hint}
          onSolve={handleSolve}
        />
      ))}

      {/* Complete Puzzle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSolve(100)}
        className="mt-4 px-4 py-2 bg-green-500 text-white font-bold rounded"
      >
        Complete Puzzle (+100)
      </motion.button>

      <p className="mt-4 text-sm text-gray-600">
        Install as PWA on mobile/desktop for offline use.
      </p>
    </div>
  );
}

export default App;
