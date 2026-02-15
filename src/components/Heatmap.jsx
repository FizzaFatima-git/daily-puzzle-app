import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { getDailyActivity } from "../utils/db";

dayjs.extend(isLeapYear);

const intensityMap = {
  0: "bg-[#F8EDFF]", // Not played
  1: "bg-[#BFCFE7]", // Easy
  2: "bg-[#DDF2FD]", // Medium
  3: "bg-[#75C7F0]", // Hard
  4: "bg-[#41A6F1]", // Perfect
};

const HeatmapCell = React.memo(({ intensity, isToday, title }) => (
  <motion.div
    className={`w-5 h-5 rounded ${intensityMap[intensity] || intensityMap[0]}`}
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

  useEffect(() => {
    async function fetchActivity() {
      const data = await getDailyActivity();
      setActivity(data);
    }
    fetchActivity();
  }, []);

  const weeks = useMemo(() => {
    const days = [];
    const yearDays = startOfYear.isLeapYear() ? 366 : 365;

    for (let i = 0; i < yearDays; i++) {
      const date = startOfYear.add(i, "day").format("YYYY-MM-DD");
      const dayData = activity[date] || { solved: false, difficulty: 0, score: 0 };
      let intensity = 0;

      if (dayData.solved) intensity = Math.min(dayData.difficulty + 1, 4);
      if (i < streak) intensity = Math.min(i + 1, 4);

      days.push({
        date,
        intensity,
        isToday: date === todayStr,
        title: `${date} | Score: ${dayData.score} | Difficulty: ${dayData.difficulty}`,
      });
    }

    // Split into weekly columns
    const weekCols = [];
    for (let i = 0; i < days.length; i += 7) {
      weekCols.push(days.slice(i, i + 7));
    }
    return weekCols;
  }, [activity, streak, todayStr, startOfYear]);

  return (
    <div className="overflow-x-auto mb-4">
      <div className="flex gap-1">
        {weeks.map((week, wIdx) => (
          <div key={`week-${wIdx}`} className="flex flex-col gap-1">
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

