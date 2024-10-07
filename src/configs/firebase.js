// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy-al115WBd1uMolxKgU1jhyEvn54Es_c",
  authDomain: "careconnect-2d494.firebaseapp.com",
  projectId: "careconnect-2d494",
  storageBucket: "careconnect-2d494.appspot.com",
  messagingSenderId: "594446058865",
  appId: "1:594446058865:web:f5f55822bdfda6f671a2d0",
  measurementId: "G-M1CDX438XG"
};
// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
