// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuzufjeOBPT5Ay5XM-pPY8I5l72hirOu4",
  authDomain: "solartracker-83159.firebaseapp.com",
  databaseURL:
    "https://solartracker-83159-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "solartracker-83159",
  storageBucket: "solartracker-83159.appspot.com",
  messagingSenderId: "832053054584",
  appId: "1:832053054584:web:2824f17ee407f63b04f18d",
  measurementId: "G-RYSD09DV3G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
