import { addDoc, arrayUnion, collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase-config";
import { useUserAuth } from "../Script/AuthContext";
import Comment from "./Comment";

const CommentRenderer = ({ role, cardId }) => {
    const [comments, setComments] = useState([]);
    const colRef = collection(db, "comment");

    const { user, userData } = useUserAuth();

    useEffect(() => {
        const q = query(colRef, where("cardId", "==", cardId))
        const onSub = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map((doc) => doc));
        }
        )

        return () => {
            onSub()
        }

    }, [])

    const submitComment = (e) => {
        e.preventDefault();
        addDoc(colRef, {
            comment: e.target.text.value,
            userId: user.uid,
            cardId: cardId
        });

        e.target.text.value = ""
    };

    return (
        <>
            <p className="p-2 text-md mb-2 mt-10 font-medium">Card Comments</p>

            {role !== "" ? (
                <div className="group relative">
                    <form onSubmit={submitComment}>
                        <textarea
                            name="text"
                            className="border-2 p-2 border-gray-200 shadow rounded-md w-full h-28 resize-none"
                            type="text"
                            placeholder="Write a comment..."
                        ></textarea>
                        <button className="mt-2 left-3 px-2 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600">
                            Comment
                        </button>
                    </form>
                </div>
            ) : null}

            {comments.map((comment) => {
                return (
                    <Comment
                        key={comment.id}
                        comment={comment.data().comment}
                        userId={comment.data().userId}
                        cardId={comment.data().cardId}
                        commentId={comment.id}
                    />
                );
            })}
        </>
    );
};

export default CommentRenderer;