import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase";
import axios from "axios";

// --- Puzzle Component ---
function Puzzle({ title, question, solution, hint, onSolve }) {
  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const checkSolution = () => {
    if (solved) return;
    if (input.trim().toLowerCase() === solution.toLowerCase()) {
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
        className={`p-4 border rounded mb-4 ${solved ? "bg-green-100" : "bg-white"} shadow-md`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="mb-2">{question}</p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 mr-2 rounded w-2/3"
          disabled={solved}
        />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={checkSolution}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
          disabled={solved}
        >
          Submit
        </motion.button>

        <button
          onClick={() => setShowHint(!showHint)}
          className="ml-2 px-2 py-1 bg-yellow-400 text-black rounded"
        >
          Hint
        </button>

        {showHint && <p className="mt-2 text-sm text-gray-700 italic">{hint}</p>}
      </motion.div>
    </AnimatePresence>
  );
}

// --- Main App ---
function App() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(() => JSON.parse(localStorage.getItem("points")) || 0);
  const [streak, setStreak] = useState(() => JSON.parse(localStorage.getItem("streak")) || 0);
  const [lastReset, setLastReset] = useState(() => JSON.parse(localStorage.getItem("lastReset")) || new Date().toDateString());

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // Send user info to backend
      if (currentUser) {
        try {
          await axios.post("http://localhost:5000/api/users", {
            uid: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
          });
          console.log("User saved to backend ✅");
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

  // Daily reset
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

  const puzzles = [
    { title: "Puzzle 1", question: "2, 4, 6, ?", solution: "8", hint: "Even numbers increase by 2" },
    { title: "Puzzle 2", question: "Unscramble 'LPAEP'", solution: "apple", hint: "Fruit that keeps doctor away" },
    { title: "Puzzle 3", question: "If A=1, B=2, C=3, what is D+E?", solution: "9", hint: "D=4, E=5, add them" },
    { title: "Puzzle 4", question: "5 × 3?", solution: "15", hint: "Multiply 5 by 3" },
    { title: "Puzzle 5", question: "I speak without a mouth and hear without ears. What am I?", solution: "echo", hint: "Heard in caves or empty rooms" },
  ];

  // --- Login Screen ---
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="bg-white p-10 rounded-xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-6">Welcome to Logic Looper!</h1>
          <p className="mb-6 text-gray-700">Solve daily puzzles and boost your streak 🔥</p>
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded shadow-lg hover:bg-red-600 transition"
          >
            <img src="/google-icon.png" alt="Google" className="w-6 h-6" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // --- Puzzle Screen ---
  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span>Welcome, {user.displayName}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4">Logic Looper</h1>
      <h2 className="text-xl mb-4">🔥 Streak: {streak} days | Total Points: {points}</h2>

      {puzzles.map((puzzle, idx) => (
        <Puzzle key={idx} {...puzzle} onSolve={handleSolve} />
      ))}

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

