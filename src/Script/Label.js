import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export async function getLabel(id) {
    const ref = doc(db, "label/" + id);
    const temp = await getDoc(ref);
    return temp.data();
}