import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase";
import dayjs from "dayjs";

import Heatmap from "./components/Heatmap";
import { generateDailyPuzzles } from "./utils/puzzleGenerator";
import { savePuzzleProgress, getDailyActivity } from "./utils/db";

// --- Puzzle Component ---
function Puzzle({ puzzleId, title, question, options, correct, difficulty, onSolve, hintsLeft, setHintsLeft }) {
  const [selected, setSelected] = useState("");
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!solved) {
      const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [solved]);

  const checkSolution = async () => {
    if (solved) return;
    if (selected === correct) {
      const score = 50 * difficulty;
      setSolved(true);
      onSolve(puzzleId, score, difficulty);
      await savePuzzleProgress(dayjs().format("YYYY-MM-DD"), puzzleId, score, difficulty, timer);
      new Audio("/correct.mp3").play();
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
        <p className="mb-1 text-sm text-gray-500">Timer: {timer}s</p>
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(opt)}
            className={`m-1 px-3 py-1 border rounded ${selected === opt ? "bg-[#7752FE] text-white" : "bg-[#F6F5F5] text-[#190482]"}`}
            disabled={solved}
          >
            {opt}
          </button>
        ))}
        <div className="mt-2">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={checkSolution}
            className="px-3 py-1 bg-[#190482] text-white rounded disabled:bg-gray-400 mr-2"
            disabled={solved}
          >
            Submit
          </motion.button>
          <button onClick={handleHint} className="px-3 py-1 bg-[#7752FE] text-white rounded">Hint</button>
        </div>
        {showHint && <p className="mt-2 text-sm text-[#414BEA] italic">The correct answer is somewhere among the options 😉</p>}
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
  const [solvedPuzzles, setSolvedPuzzles] = useState({});

  const todayStr = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, provider); } 
    catch (error) { console.error(error); }
  };
  const handleLogout = async () => {
    try { await signOut(auth); } 
    catch (error) { console.error(error); }
  };

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastReset !== today) {
      setLastReset(today);
      localStorage.setItem("lastReset", JSON.stringify(today));
      setPoints(0);
      setStreak(0);
      setHintsLeft(3);
      setSolvedPuzzles({});
      localStorage.setItem("points", JSON.stringify(0));
      localStorage.setItem("streak", JSON.stringify(0));
    }
  }, [lastReset]);

  useEffect(() => {
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("streak", JSON.stringify(streak));
  }, [points, streak]);

  const handleSolve = async (puzzleId, score, difficulty) => {
    if (solvedPuzzles[todayStr]?.includes(puzzleId)) return;
    setPoints(prev => prev + score);
    setStreak(prev => prev + 1);
    setSolvedPuzzles(prev => ({
      ...prev,
      [todayStr]: [...(prev[todayStr] || []), puzzleId],
    }));
  };

  useEffect(() => {
    async function loadActivity() {
      const data = await getDailyActivity();
      setSolvedPuzzles(data);
    }
    loadActivity();
  }, []);

  const puzzles = useMemo(() => generateDailyPuzzles(todayStr), [todayStr]);

  if (loading) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#F6F5F5] to-[#7752FE]">
        <div className="bg-white p-10 rounded-xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-6 text-[#190482]">Welcome to Logic Looper!</h1>
          <p className="mb-6 text-[#414BEA]">Solve daily puzzles and boost your streak 🔥</p>
          <button onClick={handleLogin} className="flex items-center justify-center gap-3 px-6 py-3 bg-[#7752FE] text-white text-lg font-semibold rounded shadow-lg hover:bg-[#414BEA] transition">
            <img src="/google-icon.png" alt="Google" className="w-6 h-6" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // --- Simulated leaderboard data (replace with real DB/backend later) ---
  const leaderboard = [
    { uid: user.uid, name: user.displayName, points: points }, // current user
    { uid: "2", name: "Bob", points: 200 },
    { uid: "3", name: "Charlie", points: 100 },
    { uid: "4", name: "David", points: 50 },
    { uid: "5", name: "Eve", points: 30 },
    { uid: "6", name: "Frank", points: 20 },
    { uid: "7", name: "Grace", points: 10 },
  ].sort((a, b) => b.points - a.points); // sort descending

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#190482]">Welcome, {user.displayName}</span>
        <button onClick={handleLogout} className="px-3 py-1 bg-[#7752FE] text-white rounded hover:bg-[#414BEA]">Logout</button>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-[#190482]">Logic Looper</h1>
      <h2 className="text-xl mb-2 text-[#414BEA]">🔥 Streak: {streak} | Total Points: {points}</h2>
      <h3 className="text-md mb-4 text-[#7752FE]">Hints Remaining: {hintsLeft}</h3>

      <Heatmap streak={streak} />

      {puzzles.map(p => (
        <Puzzle key={p.id} puzzleId={p.id} {...p} onSolve={handleSolve} hintsLeft={hintsLeft} setHintsLeft={setHintsLeft} />
      ))}

      
{/* --- Leaderboard --- */}
<div className="mt-4 border-t pt-2">
  <h3 className="font-bold mb-2 text-[#F05537]">Leaderboard</h3>
  <div className="max-h-40 overflow-y-auto border rounded bg-[#F8EDFF] shadow-sm p-2">
    <ul>
      {leaderboard.map((userEntry, idx) => (
        <li
          key={userEntry.uid}
          className={`p-2 mb-1 flex justify-between items-center rounded ${
            user.uid === userEntry.uid
              ? "bg-[#F05537] text-white font-semibold"
              : "text-[#F05537]"
          }`}
        >
          <span>{idx + 1}. {userEntry.name}</span>
          <span>{userEntry.points} pts</span>
        </li>
      ))}
    </ul>
  </div>
</div>
      <p className="mt-4 text-sm text-[#414BEA]">Install as PWA on mobile/desktop for offline use.</p>
    </div>
  );
}

export default App;

