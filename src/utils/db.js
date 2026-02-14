// DB utilities for daily activity using IndexedDB
import { openDB } from "idb";

const DB_NAME = "dailyPuzzleDB";
const STORE_NAME = "dailyActivity";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "date" });
      }
    },
  });
}

// Save activity for a day
export async function saveDailyActivity(activity) {
  const db = await initDB();
  await db.put(STORE_NAME, activity);
}

// Fetch all activity as a dictionary { date: activity }
export async function getDailyActivity() {
  const db = await initDB();
  const all = await db.getAll(STORE_NAME);

  const activityDict = {};
  all.forEach((item) => {
    activityDict[item.date] = item;
  });

  return activityDict;
}
