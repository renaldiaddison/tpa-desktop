import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase-config";

export async function getBoardById(id) {
    const ref = doc(db, "board/" + id);
    const temp = await getDoc(ref);
    return temp.data();
}

export async function getBoardById2(id) {
    const ref = doc(db, "board/" + id);
    const temp = await getDoc(ref);
    return temp;
}

export async function getBoardByWsId(id) {
    const ref = collection(db, "board")
    const q = query(ref, where("workspaceId", "==", id))
    return getDocs(q)
}

export async function closeBoard(id) {
    const ref = doc(db, "board/" + id);
    await updateDoc(ref, {
        closed: true
    })
}