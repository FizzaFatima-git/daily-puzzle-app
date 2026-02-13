import React from "react";

export default function HintCounter({ hintsLeft }) {
  return (
    <div className="mb-2 text-sm text-gray-600">
      Hints Remaining: {hintsLeft}
    </div>
  );
}
