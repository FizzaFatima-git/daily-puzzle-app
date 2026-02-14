import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { getDailyActivity } from "../utils/db";

// Brand color intensity map
const intensityMap = {
  0: "bg-[#F8EDFF]", // Not played
  1: "bg-[#BFCFE7]", // Solved Easy
  2: "bg-[#DDF2FD]", // Solved Medium
  3: "bg-[#75C7F0]", // Solved Hard
  4: "bg-[#41A6F1]", // Perfect
  default: "bg-[#F8EDFF]", // fallback
};

// Individual cell
const HeatmapCell = React.memo(({ intensity, isToday, title }) => (
  <motion.div
    className={`w-5 h-5 rounded ${intensityMap[intensity] || intensityMap.default}`}
    title={title}
    whileHover={{ scale: 1.2 }}
    animate={isToday ? { scale: [1, 1.5, 1] } : {}}
    transition={{ duration: 0.6 }}
  />
));

export default function Heatmap({ streak }) {
  const [activity, setActivity] = useState({});

  const todayStr = dayjs().format("YYYY-MM-DD");
  const startOfYear = dayjs().startOf("year");

  // Fetch activity from IndexedDB
  useEffect(() => {
    async function fetchActivity() {
      const data = await getDailyActivity();
      setActivity(data);
    }
    fetchActivity();
  }, []);

  // Prepare 7-row weekly grid
  const weeks = useMemo(() => {
    const days = [];
    for (let i = 0; i < 365; i++) {
      const date = startOfYear.add(i, "day").format("YYYY-MM-DD");
      const dayData = activity[date] || { solved: false, difficulty: 0, score: 0 };
      let intensity = 0;

      // Use activity intensity
      if (dayData.solved) intensity = Math.min(dayData.difficulty + 1, 4);

      // Highlight streak
      if (i < streak) intensity = Math.min(i + 1, 4);

      days.push({
        date,
        intensity,
        isToday: date === todayStr,
        title: `${date} | Score: ${dayData.score} | Difficulty: ${dayData.difficulty}`,
      });
    }

    // Split into week columns
    const weekCols = [];
    for (let i = 0; i < days.length; i += 7) {
      weekCols.push(days.slice(i, i + 7));
    }
    return weekCols;
  }, [activity, streak]);

  return (
    <div className="overflow-x-auto mb-4">
      <div className="flex gap-1">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((day) => (
              <HeatmapCell
                key={day.date}
                intensity={day.intensity}
                isToday={day.isToday}
                title={day.title}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-2 mt-2 text-sm items-center">
        <span className="w-5 h-5 rounded bg-[#F8EDFF] border" /> Not Played
        <span className="w-5 h-5 rounded bg-[#BFCFE7] border" /> Easy
        <span className="w-5 h-5 rounded bg-[#DDF2FD] border" /> Medium
        <span className="w-5 h-5 rounded bg-[#75C7F0] border" /> Hard
        <span className="w-5 h-5 rounded bg-[#41A6F1] border" /> Perfect
      </div>
    </div>
  );
}


