import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import { db } from "../firebase-config";
import Checklist from "./Checklist";

const CheckListRender = ({ cardId }) => {
    const [checklists, setChecklists] = useState([]);



    useEffect(() => {
        // const colRef = doc(db, "card", cardId);
        const checkRef = collection(db, "checklist")
        const q = query(checkRef, where("cardId", "==", cardId))
        const unsub = onSnapshot(q, (snapshot) => {
            setChecklists(snapshot.docs.map((doc) => doc));
        });

        return unsub;
    }, []);

    return (
        <>
            <div className="flex flex-col">
                {checklists.map((checklist, index) => {
                    return (
                        <Checklist
                            key={checklist.id}
                            cardId={cardId}
                            name={checklist.data().name}
                            checkId = {checklist.id}
                            index={index}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default CheckListRender;