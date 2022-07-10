import {
    arrayRemove,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { useUserAuth } from "../Script/AuthContext";

const Comment = ({ comment, userId, cardId, commentId }) => {
    const [state, setState] = useState([]);
    const { user, userData } = useUserAuth();

    console.log(userId)

    useEffect(() => {

        const q = query(collection(db, "user"), where("userId", "==", userId))

        const unSub = onSnapshot(q, (snap) => {
            if (snap.docs[0]) {
                setState(snap.docs[0].data())
            };
        });

        return () => {
            unSub()
        }
    }, []);

    const handleKeyDown = (e) => {
        const commentDoc = doc(db, "comment", commentId)

        updateDoc(commentDoc, {
            comment: e.target.value
        })
    }

    return (
        <div className="relative mt-4">
            <div className="px-3 font-semibold text-blue-500">
                {state.displayName}
            </div>
            <div className="absolute top-0 right-0 px-3 font-semibold text-red-500 text-sm cursor-pointer">
                {user.uid === userId && (
                    <p
                        onClick={async () => {
                            const colRef = doc(db, "comment", commentId);
                            await deleteDoc(colRef);
                        }}
                    >
                        Delete Comment
                    </p>
                )}
            </div>

            {user.uid === userId ? <input onKeyDown={(e) => {
                handleKeyDown(e)
            }} className="text-sm mb-1 mt-1 w-full text-gray-700 border-gray-200 border-2 rounded-sm px-3 py-1" defaultValue={comment}>
            </input> : <div className="text-sm mb-1 mt-1 w-full text-gray-700 border-gray-200 border-2 rounded-sm px-3 py-1">
                {comment}
            </div>}


        </div>
    );
};

export default Comment;