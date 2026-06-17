// src/services/authService.js
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export const registerUser = async ({ name, email, password }) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed')
  }

  return data
}

export const loginUser = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  if (!userCredential.user.emailVerified) {
    await signOut(auth)
    throw new Error('Please verify your email before logging in.')
  }
  return userCredential.user
}

export const logoutUser = () => signOut(auth)

export const getUserProfile = async (uid) => {
  const docSnap = await getDoc(doc(db, 'users', uid))
  return docSnap.exists() ? docSnap.data() : null
}