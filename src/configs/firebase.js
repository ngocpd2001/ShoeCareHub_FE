// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaurk7KzbFYPCLiFa2A2bhFh1S2Bwh-O4",
  authDomain: "shoecarehub-4dca3.firebaseapp.com",
  databaseURL:
    "https://shoecarehub-4dca3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shoecarehub-4dca3",
  storageBucket: "shoecarehub-4dca3.firebasestorage.app",
  messagingSenderId: "392950352566",
  appId: "1:392950352566:web:147ae20cfaad118604b417",
  measurementId: "G-TRTZGNL0V7",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
const realtimedb = getDatabase(app);
export { realtimedb };
