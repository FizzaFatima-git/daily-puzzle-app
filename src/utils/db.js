import { openDB } from "idb";

const DB_NAME = "dailyPuzzleDB";
const STORE_NAME = "dailyActivity";

// Initialize DB
export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

// Save a puzzle progress for a specific day
export async function savePuzzleProgress(date, puzzleId, score, difficulty, time) {
  const db = await initDB();
  const activity = { id: `${date}-${puzzleId}`, date, puzzleId, score, difficulty, time };
  await db.put(STORE_NAME, activity);
}

// Fetch all activity as a dictionary { date: [activities] }
export async function getDailyActivity() {
  const db = await initDB();
  const all = await db.getAll(STORE_NAME);

  const activityDict = {};
  all.forEach((item) => {
    if (!activityDict[item.date]) activityDict[item.date] = [];
    activityDict[item.date].push(item.puzzleId);
  });

  return activityDict;
}

