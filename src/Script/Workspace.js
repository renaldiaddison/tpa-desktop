import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export async function getWorkspaceById(id) {
    const ref = doc(db, "workspace", id);
    const temp = await getDoc(ref);
    return temp.data();
}