import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase";
import axios from "axios";

// --- Puzzle Component ---
function Puzzle({ title, question, options, correct, onSolve, hintsLeft, setHintsLeft }) {
  const [selected, setSelected] = useState("");
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const checkSolution = () => {
    if (solved) return;
    if (selected === correct) {
      new Audio("/correct.mp3").play();
      onSolve(100);
      setSolved(true);
      setSelected("");
    } else {
      alert("Try again!");
    }
  };

  const handleHint = () => {
    if (hintsLeft > 0) {
      setShowHint(!showHint);
      setHintsLeft((prev) => prev - 1);
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

// --- Main App ---
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [points, setPoints] = useState(() => JSON.parse(localStorage.getItem("points")) || 0);
  const [streak, setStreak] = useState(() => JSON.parse(localStorage.getItem("streak")) || 0);
  const [lastReset, setLastReset] = useState(() => JSON.parse(localStorage.getItem("lastReset")) || new Date().toDateString());
  const [hintsLeft, setHintsLeft] = useState(3);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        try {
          await axios.post("http://localhost:5000/api/users", {
            uid: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
          });
        } catch (err) {
          console.error("Failed to save user:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastReset !== today) {
      setLastReset(today);
      localStorage.setItem("lastReset", JSON.stringify(today));
      setPoints(0);
      setStreak(0);
      setHintsLeft(3);
      localStorage.setItem("points", JSON.stringify(0));
      localStorage.setItem("streak", JSON.stringify(0));
    }
  }, [lastReset]);

  useEffect(() => {
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("streak", JSON.stringify(streak));
  }, [points, streak]);

  const handleSolve = (score) => {
    setPoints((prev) => prev + score);
    setStreak((prev) => prev + 1);
  };

  const puzzles = [
    {
      title: "Puzzle 1",
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correct: "Mars",
    },
    {
      title: "Puzzle 2",
      question: "Unscramble this word: 'tca'",
      options: ["cat", "act", "tac", "cta"],
      correct: "cat",
    },
    {
      title: "Puzzle 3",
      question: "Sequence: 2, 4, 6, ?",
      options: ["8", "10", "12", "14"],
      correct: "8",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#F6F5F5] to-[#7752FE]">
        <div className="bg-white p-10 rounded-xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-6 text-[#190482]">Welcome to Logic Looper!</h1>
          <p className="mb-6 text-[#414BEA]">Solve daily puzzles and boost your streak 🔥</p>
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-[#7752FE] text-white text-lg font-semibold rounded shadow-lg hover:bg-[#414BEA] transition"
          >
            <img src="/google-icon.png" alt="Google" className="w-6 h-6" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#190482]">Welcome, {user.displayName}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-[#7752FE] text-white rounded hover:bg-[#414BEA]"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-[#190482]">Logic Looper</h1>
      <h2 className="text-xl mb-2 text-[#414BEA]">🔥 Streak: {streak} | Total Points: {points}</h2>
      <h3 className="text-md mb-4 text-[#7752FE]">Hints Remaining: {hintsLeft}</h3>

      {puzzles.map((puzzle, idx) => (
        <Puzzle
          key={idx}
          {...puzzle}
          onSolve={handleSolve}
          hintsLeft={hintsLeft}
          setHintsLeft={setHintsLeft}
        />
      ))}

      <div className="mt-4 border-t pt-2">
        <h3 className="font-bold mb-2 text-[#190482]">Leaderboard</h3>
        <ul className="text-[#414BEA]">
          <li>Fizza - {points} pts</li>
          <li>Shubham - 200 pts</li>
          <li>Onkar - 100 pts</li>
        </ul>
      </div>

      <p className="mt-4 text-sm text-[#414BEA]">
        Install as PWA on mobile/desktop for offline use.
      </p>
    </div>
  );
}

export default App;





