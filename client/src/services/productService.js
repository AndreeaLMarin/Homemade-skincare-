// src/services/productService.js
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, where, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'products'

export const getAllProducts = async () => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getProductById = async (id) => {
  const snap = await getDoc(doc(db, COLLECTION, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const getProductsByCategory = async (category) => {
  const q = query(collection(db, COLLECTION), where('category', '==', category))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const createProduct = async (data) => {
  return addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() })
}

export const updateProduct = async (id, data) => {
  return updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() })
}

export const deleteProduct = async (id) => {
  return deleteDoc(doc(db, COLLECTION, id))
}
