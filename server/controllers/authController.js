const { db, firebaseConfig } = require('../config/firebase');
const User = require('../models/User');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create user in Firebase Auth using REST API
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.api_key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message);
    }

    // Create user in Firestore
    await User.create({
      username,
      email,
      uid: data.localId
    });

    res.status(201).json({ token: data.idToken });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Sign in with email and password using Firebase Auth REST API
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.api_key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message);
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ token: data.idToken, username: user.username, email: user.email });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(400).json({ error: 'Invalid credentials' });
  }
};

module.exports = { signup, login };
