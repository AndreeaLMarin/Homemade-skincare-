// src/services/tutorialService.js
// A tutorial has: title, description, youtubeUrl, linkedProductIds[], published, order
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

const COL = 'tutorials'

// Extract YouTube video ID from any YouTube URL format
export const getYouTubeId = (url) => {
  if (!url) return null
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export const getThumbnailUrl = (youtubeUrl) => {
  const id = getYouTubeId(youtubeUrl)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export const getAllTutorials = async () => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getTutorialById = async (id) => {
  const snap = await getDoc(doc(db, COL, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const createTutorial = async (data) => {
  return addDoc(collection(db, COL), {
    ...data,
    published: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const updateTutorial = async (id, data) => {
  return updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const deleteTutorial = async (id) => {
  return deleteDoc(doc(db, COL, id))
}
