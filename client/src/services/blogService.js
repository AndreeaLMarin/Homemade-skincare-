// src/services/blogService.js
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'recipes'

export const getAllRecipes = async () => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getRecipeById = async (id) => {
  const snap = await getDoc(doc(db, COLLECTION, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const createRecipe = async (data) => {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    published: true,
    createdAt: serverTimestamp(),
  })
}

export const updateRecipe = async (id, data) => {
  return updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() })
}

export const deleteRecipe = async (id) => {
  return deleteDoc(doc(db, COLLECTION, id))
}
