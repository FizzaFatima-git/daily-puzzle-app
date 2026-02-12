import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDchZx6e6euzQn4e5wTf7h7Mz2Y9qsjMvY",
  authDomain: "daily-puzzle-app-e1971.firebaseapp.com",
  projectId: "daily-puzzle-app-e1971",
  storageBucket: "daily-puzzle-app-e1971.firebasestorage.app",
  messagingSenderId: "821508733051",
  appId: "1:821508733051:web:eb0829c70d87b2b8d04ade"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
