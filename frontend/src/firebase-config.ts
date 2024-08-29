// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWNhgEH2FIZO4mpn8KEaPbLvKDJr1qL78",
  authDomain: "xwtracker.firebaseapp.com",
  projectId: "xwtracker",
  storageBucket: "xwtracker.appspot.com",
  messagingSenderId: "602884172081",
  appId: "1:602884172081:web:49261bdc49a5a1ad2f6810",
  measurementId: "G-QGQ5K85BS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
connectAuthEmulator(auth, "http://localhost:9099")