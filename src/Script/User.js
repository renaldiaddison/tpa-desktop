import { updateProfile } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase-config";

export async function getUser(id) {
  const q = query(collection(db, "user"), where("userId", "==", id));
  return getDocs(q);
//   const data = qs.docs[0].data();
//   return data;
}
