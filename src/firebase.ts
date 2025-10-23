// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTwtL1jaVtqtk268U1iDsxGU06HICtJos",
  authDomain: "putmeon-9d9cf.firebaseapp.com",
  projectId: "putmeon-9d9cf",
  storageBucket: "putmeon-9d9cf.firebasestorage.app",
  messagingSenderId: "431070890385",
  appId: "1:431070890385:web:8b021593f727ea89133230",
  measurementId: "G-9DZ1ZL764W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
