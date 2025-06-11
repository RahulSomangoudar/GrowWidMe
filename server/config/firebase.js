const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('./firebase.json');

const app = initializeApp({
  apiKey: firebaseConfig.api_key,
  authDomain: `${firebaseConfig.project_id}.firebaseapp.com`,
  projectId: firebaseConfig.project_id,
  storageBucket: `${firebaseConfig.project_id}.appspot.com`,
  messagingSenderId: firebaseConfig.client_id,
  appId: firebaseConfig.client_id,
});

const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { app, auth, db, firebaseConfig }; 