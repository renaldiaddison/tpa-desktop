import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export async function getBoardById(id) {
    const ref = doc(db, "board/" + id);
    const temp = await getDoc(ref);
    return temp.data();
}