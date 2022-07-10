import { async } from "@firebase/util";
import {
    addDoc,
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
import { useEffect } from "react";
import { Fragment, useState } from "react";
import { db } from "../firebase-config";

const Checklist = ({ cardId, index, name, checkId, role }) => {
    const [items, setItems] = useState([]);

    const handleDelete = async () => {
        await deleteDoc(doc(db, "checklist", checkId));
    };

    const handleAdd = async () => {
        addDoc(collection(db, "item"), {
            name: "task",
            done: false,
            checklistId: checkId
        })
    };

    useEffect(() => {
        const q = query(collection(db, "item"), where("checklistId", "==", checkId))
        const unsub = onSnapshot(q, (snapshot) => {
            setItems(snapshot.docs.map((doc) => doc))
        })

        return () => {
            unsub()
        }
    }, [])

    const handleChange = (e) => {
        console.log(e.target.value);
        if (e.key === "Enter") {
            updateDoc(doc(db, "checklist", checkId), {
                name: e.target.value,
            });
        }
    }

    return (
        <Fragment>
            <div className="mt-1 px-3 flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>

                {role !== "" ? <><input className="p-3 grow" defaultValue={name} onKeyDown={(e) => {
                    handleChange(e);
                }}></input>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-1 bg-red-600 rounded text-white hover:bg-red-700"
                    >
                        Delete
                    </button></> : <><p className="p-3 grow">{name}</p>
                </>}

            </div>

            <div className="p-3">
                <Bar items={items} />
                {items &&
                    items.map((item) => {
                        return (
                            <List
                                key={item.id}
                                card={cardId}
                                item={item.data()}
                                itemId={item.id}
                                role={role}
                            />
                        );
                    })}

                {role !== "" ? <button
                    onClick={handleAdd}
                    className="p-2 w-32 mt-2 bg-blue-400 rounded text-white"
                >
                    Add Item
                </button> : null}

            </div>
        </Fragment>
    );
};

const Bar = ({ items }) => {
    const [state, setState] = useState(0);
    (async () => {

        var done = 0;
        var total = items.length
        if (items.length === 0) {
            return;
        }


        var prom = items.map(async (item) => {
            if (item.data().done === true) {
                done++
            }
        })
        Promise.all(prom).then(() => {
            const per = Math.round((done / total) * 100);
            setState(per);
        });

    })()



    return (
        <div >
            <input type="range" value={state} className="w-full"></input>
        </div>
    );
}

const List = ({ item, cardId, itemId, role }) => {

    const handleChange = (e) => {
        console.log(e.target.value);
        if (e.key === "Enter") {
            updateDoc(doc(db, "item", itemId), {
                name: e.target.value,
            });
        }
    };

    return (
        <div className="flex items-center">

            {role !== "" ? <>{item.done && (
                <svg
                    onClick={async () => {
                        const data = await getDoc(doc(db, "item", itemId));

                        const check = data.data().done

                        updateDoc(doc(db, "item", itemId), {
                            done: !check
                        });
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 absolute stroke-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            )}

                <div
                    onClick={async () => {
                        const data = await getDoc(doc(db, "item", itemId));

                        const check = data.data().done

                        updateDoc(doc(db, "item", itemId), {
                            done: !check
                        });
                    }}
                    className="w-5 h-5 bg-slate-300 rounded"
                ></div></> : <>{item.done && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 absolute stroke-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}

                <div
                    className="w-5 h-5 bg-slate-300 rounded"
                ></div></>}


            {role !== "" ? <div className="py-4 px-4 w-full relative">
                <input
                    onKeyDown={(e) => {
                        handleChange(e);
                    }}
                    defaultValue={item.name}
                    type=" text"
                    className="bg-gray-50 p-2 text-gray-600 w-1/2"
                ></input>

                <button
                    onClick={async () => {
                        await deleteDoc(doc(db, "item", itemId));
                    }}
                    className="px-4 py-1 absolute right-0 bg-red-600 rounded text-white text-sm top-6 hover:bg-red-700"
                >
                    Delete
                </button>
            </div> : <div className="py-4 px-4 w-full relative">
                <p
                    className="p-2 text-gray-600 w-1/2"
                >{item.name}</p>
            </div>}


        </div>
    );
};

export default Checklist;