import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBJuGUtpcaBg7xwd7QcGfIkqsf8z3aODgs",
    authDomain: "grow-wid-me.firebaseapp.com",
    databaseURL: "https://grow-wid-me-default-rtdb.firebaseio.com",
    projectId: "grow-wid-me",
    storageBucket: "grow-wid-me.firebasestorage.app",
    messagingSenderId: "261773585239",
    appId: "1:261773585239:web:09830f512e69806eceec12",
    measurementId: "G-VXHKH2J7G2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

// Log initialization
console.log('Firebase initialized with project:', firebaseConfig.projectId);

export { auth, db }; 