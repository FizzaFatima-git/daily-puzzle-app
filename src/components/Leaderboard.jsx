import React from "react";

export default function Heatmap({ streak }) {
  const days = Array.from({ length: 30 }, (_, i) => i < streak);

  return (
    <div className="flex gap-1 mb-4">
      {days.map((active, idx) => (
        <div
          key={idx}
          className={`w-4 h-4 rounded ${
            active ? "bg-green-500" : "bg-gray-300"
          }`}
        ></div>
      ))}
    </div>
  );
}
