import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDZJMNuQb3_8PUiA0W9HmPfJNURGOT-dCc",
  authDomain: "chello-63523.firebaseapp.com",
  projectId: "chello-63523",
  storageBucket: "chello-63523.appspot.com",
  messagingSenderId: "711078245252",
  appId: "1:711078245252:web:d5bee48d19b324afb823d1",
  measurementId: "G-MDLNDNKBBB"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore()
export default app