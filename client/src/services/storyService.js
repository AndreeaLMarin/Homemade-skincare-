// src/services/storyService.js
// The "story" page is made of ordered sections (chapters).
// Each section has: id, order, icon, title, body (array of paragraphs), published
import {
  collection, doc, getDocs, addDoc, updateDoc,
  deleteDoc, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

const COL = 'storysections'

export const getStorySections = async () => {
  const q = query(collection(db, COL), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const createStorySection = async (data) => {
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const updateStorySection = async (id, data) => {
  return updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const deleteStorySection = async (id) => {
  return deleteDoc(doc(db, COL, id))
}
