import { useState } from "react";
import { puzzles } from "./puzzles";

function App() {
  // Mock login
  const [user, setUser] = useState(null);

  // Current puzzle index
  const [currentIndex, setCurrentIndex] = useState(new Date().getDate() % puzzles.length);

  const todayKey = "daily-" + currentIndex;
  const question = puzzles[currentIndex];

  const [selected, setSelected] = useState(localStorage.getItem(todayKey) || null);
  const [result, setResult] = useState(localStorage.getItem(todayKey + "-result") || "");

  function checkAnswer(option) {
    if (selected !== null) return;
    setSelected(option);
    const res = option === question.correct ? "✅ Correct!" : "❌ Wrong answer";
    setResult(res);

    localStorage.setItem(todayKey, option);
    localStorage.setItem(todayKey + "-result", res);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Login */}
      <div className="mb-6">
        {!user ? (
          <button
            onClick={() => setUser({ name: "Demo User" })}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Hello, {user.name}</span>
            <button
              onClick={() => setUser(null)}
              className="bg-red-500 text-white py-1 px-3 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Puzzle */}
      {user ? (
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">🧩 Daily Puzzle</h1>
          <p className="text-center mb-6 text-lg">{question.text}</p>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt) => {
              let style = "bg-blue-100 hover:bg-blue-200";
              if (selected !== null) {
                if (opt === question.correct) style = "bg-green-200";
                else if (opt === selected) style = "bg-red-200";
              }
              return (
                <button
                  key={opt}
                  onClick={() => checkAnswer(opt)}
                  disabled={selected !== null}
                  className={`${style} py-2 rounded-lg font-semibold`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {result && <p className="text-center mt-4 font-semibold text-xl">{result}</p>}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => {
                const prev = (currentIndex - 1 + puzzles.length) % puzzles.length;
                setCurrentIndex(prev);
                setSelected(localStorage.getItem("daily-" + prev) || null);
                setResult(localStorage.getItem("daily-" + prev + "-result") || "");
              }}
              className="bg-gray-200 py-1 px-3 rounded-lg font-semibold"
            >
              ◀ Previous
            </button>
            <span className="font-semibold">
              Puzzle {currentIndex + 1} of {puzzles.length}
            </span>
            <button
              onClick={() => {
                const next = (currentIndex + 1) % puzzles.length;
                setCurrentIndex(next);
                setSelected(localStorage.getItem("daily-" + next) || null);
                setResult(localStorage.getItem("daily-" + next + "-result") || "");
              }}
              className="bg-gray-200 py-1 px-3 rounded-lg font-semibold"
            >
              Next ▶
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">Please login to attempt today’s puzzle.</p>
      )}
    </div>
  );
}

export default App;


