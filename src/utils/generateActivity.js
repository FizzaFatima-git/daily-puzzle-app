import dayjs from "dayjs";
import { saveActivity, getActivityByDate } from "./db.js";

// Difficulty levels: 1 = Easy, 2 = Medium, 3 = Hard
const randomDifficulty = () => Math.floor(Math.random() * 3) + 1;

// Score calculation based on difficulty
const scoreFromDifficulty = (difficulty) => difficulty * 100;

// Generate activity for a given date
export const generateDailyActivity = async (date = dayjs()) => {
  const isoDate = date.format("YYYY-MM-DD");

  // Check if activity already exists
  const existing = await getActivityByDate(isoDate);
  if (existing) return existing;

  // Generate activity
  const difficulty = randomDifficulty();
  const solved = Math.random() > 0.2; // 80% chance user solved puzzle
  const timeTaken = solved ? Math.floor(Math.random() * 60) + 1 : 0; // in minutes
  const score = solved ? scoreFromDifficulty(difficulty) : 0;

  const activity = {
    date: isoDate,
    solved,
    score,
    timeTaken,
    difficulty,
    synced: false,
  };

  await saveActivity(activity);
  return activity;
};
