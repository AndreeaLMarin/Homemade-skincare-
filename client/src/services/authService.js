// src/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

export const registerUser = async ({ name, email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(userCredential.user, { displayName: name })
  try {
  await sendEmailVerification(userCredential.user)
  console.log('Verification email sent successfully')
} catch (error) {
  console.error('Email verification error:', error.code, error.message)
}

  // Store user profile in Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    uid: userCredential.user.uid,
    name,
    email,
    role: 'customer', // Default role
    createdAt: serverTimestamp(),
  })

  return userCredential.user
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