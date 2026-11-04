import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBmJAGzNiaaQJrHpMK7HYyMnHYRLEZLyKs",
  authDomain: "bunker-game-200ee.firebaseapp.com",
  databaseURL:
    "https://bunker-game-200ee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bunker-game-200ee",
  storageBucket: "bunker-game-200ee.firebasestorage.app",
  messagingSenderId: "176369884985",
  appId: "1:176369884985:web:591680f6fbaa7fc94712e8",
  measurementId: "G-CDCZY510LD",
};

const app = initializeApp(firebaseConfig);

// Явно вказуємо адресу бази даних для європейського регіону
export const db = getDatabase(
  app,
  "https://bunker-game-200ee-default-rtdb.firebaseio.com/",
);
