import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Puzzle({ title, question, options, correct, onSolve, hintsLeft, setHintsLeft }) {
  const [selected, setSelected] = useState("");
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const checkSolution = () => {
    if (solved) return;
    if (selected === correct) {
      new Audio("/correct.mp3").play();
      onSolve(100); // Pass score
      setSolved(true);
      setSelected("");
    } else {
      alert("Try again!");
    }
  };

  const handleHint = () => {
    if (hintsLeft > 0) {
      setShowHint(!showHint);
      setHintsLeft(prev => prev - 1);
    } else {
      alert("No hints remaining today!");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={title}
        className={`p-4 border rounded mb-4 ${solved ? "bg-[#F6F5F5]" : "bg-white"} shadow-md`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-bold text-lg text-[#190482]">{title}</h2>
        <p className="mb-2 text-[#414BEA]">{question}</p>

        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(opt)}
            className={`m-1 px-3 py-1 border rounded ${
              selected === opt ? "bg-[#7752FE] text-white" : "bg-[#F6F5F5] text-[#190482]"
            }`}
            disabled={solved}
          >
            {opt}
          </button>
        ))}

        <div className="mt-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={checkSolution}
            className="px-3 py-1 bg-[#190482] text-white rounded disabled:bg-gray-400 mr-2"
            disabled={solved}
          >
            Submit
          </motion.button>

          <button
            onClick={handleHint}
            className="px-3 py-1 bg-[#7752FE] text-white rounded"
          >
            Hint
          </button>
        </div>

        {showHint && (
          <p className="mt-2 text-sm text-[#414BEA] italic">
            The correct answer is somewhere among the options 😉
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

