// Firebase Firestore - Free tier (1GB storage)
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Save user data
export const saveUserToFirestore = async (userData: any) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding user:", error)
    throw error
  }
}

// Save user activity
export const saveActivityToFirestore = async (activity: any) => {
  try {
    const docRef = await addDoc(collection(db, "activities"), {
      ...activity,
      timestamp: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding activity:", error)
    throw error
  }
}

// Get user data
export const getUserFromFirestore = async (email: string) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data()
    }
    return null
  } catch (error) {
    console.error("Error getting user:", error)
    throw error
  }
}
