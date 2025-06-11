import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { toast } from 'react-toastify';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the user in Firebase Auth
      console.log('Creating user in Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      console.log('User created in Firebase Auth:', userCredential.user.uid);

      // 2. Update the user's profile
      console.log('Updating user profile...');
      await updateProfile(userCredential.user, {
        displayName: form.username
      });
      console.log('User profile updated');

      // 3. Create the user document in Firestore
      console.log('Creating user document in Firestore...');
      const userData = {
        username: form.username,
        email: form.email,
        uid: userCredential.user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // 4. Save to Firestore with retry logic
      const userRef = doc(db, 'users', userCredential.user.uid);
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          await setDoc(userRef, userData);
          console.log('User document created in Firestore');
          break;
        } catch (firestoreError) {
          retryCount++;
          console.error(`Firestore write attempt ${retryCount} failed:`, firestoreError);
          
          if (retryCount === maxRetries) {
            throw firestoreError;
          }
          
          // Wait for 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 5. Success
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (error.code === 'permission-denied') {
        toast.error('Unable to create account. Please try again.');
        console.error('Firestore permission error. Please check security rules.');
      } else {
        toast.error('Failed to create account. Please try again.');
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-section">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          minLength={3}
          autoComplete="username"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
