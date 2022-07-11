import { useEffect, useLayoutEffect } from "react";
import LabelColor from "./LabelColor";
import { db } from "../firebase-config";
import { useState } from "react";
import {
    addDoc,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    documentId,
    getDoc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { useRef } from "react";
import CheckListRender from "./ChecklistRender";
import React from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import CardFileAttach from "./CardFileAttach";
import { useParams } from "react-router-dom";
import { getLabel } from "../Script/Label";
import CardLink from "./CardLink";
import DueDate from "./DueDate";
import CommentRenderer from "./CommentRenderer";
// import CommentRenderer from "./CommentRenderer";

const CardVisit = ({ cardId, role, boardId }) => {
    const colors = ["bg-green-400", "bg-yellow-400", "bg-orange-400", "bg-red-400", "bg-blue-400", "bg-cyan-400", "bg-purple-400", "bg-stone-400"]

    let selectedColor = "bg-green-400"
    const labelRef = useRef()

    const [cardLabel, setCardLabel] = useState([])

    const modules = {
        toolbar: [["bold", "italic", "underline", "strike"]],
    };
    const { quill, quillRef } = useQuill({ modules });
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);
    var card = data;

    const p = boardId

    var ref = useRef();
    var ref2 = useRef();
    var array = useRef([]);

    const colRef = doc(db, "card", cardId);

    useEffect(() => {
        const unsub = onSnapshot(colRef, (snapshot) => {
            setData(snapshot.data());
            setCardLabel([])
            snapshot.data().labels.map((label) => {
                const q = query(collection(db, "label"), where(documentId(), "==", label))
                onSnapshot(q, (snapshot) => {
                    if (snapshot.docs[0]) {
                        setCardLabel(oldArray => [...oldArray, snapshot.docs[0].data().color])
                    }
                })
            })
        });

        const labelRef = collection(db, "label")
        const q = query(labelRef, where("boardId", "==", p))

        const unSub2 = onSnapshot(q, (snapshot) => {
            setLabels(snapshot.docs.map((doc) => doc))
        })

        return () => {
            unsub();
            unSub2()
            setCardLabel([])
        }
    }, []);

    const handleChangeTitle = (e) => {
        if (e.key === "Enter") {
            updateDoc(doc(db, "card", cardId), {
                title: e.target.value,
            });
        }
    };

    useEffect(() => {
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(
                card.description ? card.description : "Add card description"
            );
        }
    });

    useEffect(() => {
        if (quill) {
            quill.on("text-change", (e) => {
                if (e.ops[1].insert && e.ops[1].insert === "\n") {
                    updateDoc(doc(db, "card", cardId), {
                        description: quill.root.innerHTML,
                    });
                }
            });
        }
    }, [quill]);

    // const description = data.description;

    const handleCreateLabel = () => {
        addDoc(collection(db, "label"), {
            name: labelRef.current.value,
            color: selectedColor,
            boardId: p
        })

        labelRef.current.value = "";
        selectedColor = "bg-green-400"
        ref.current.classList.toggle("hidden");
        ref2.current.classList.toggle("hidden");
    }

    const handleClick = (color) => {
        if (selectedColor !== color) {
            selectedColor = color;
        }
    }

    const getBg = (duedate, done) => {
        if (duedate === true && done === false) {
            return "bg-red-400"
        }
        else if (duedate === false && done === false) {
            return "bg-yellow-400"
        }
        else {
            return "bg-green-400"
        }
    }


    let opt = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

    return (
        <>
            <div className="backdrop-blur-sm z-[100] inset-0 bg-black bg-opacity-30 h-screen flex justify-center  overflow-y-scroll p-28 fixed">
                <div className="bg-white p-10 rounded w-2/3 min-h-[33rem] h-fit relative">
                    <div className="!DIVIDER flex">
                        <div className="!LEFT flex flex-col grow">
                            {role !== "" ? (
                                <input
                                    onKeyDown={(e) => {
                                        handleChangeTitle(e, card);
                                    }}
                                    defaultValue={card.title}
                                    className="p-2 text-2xl"
                                ></input>
                            ) : (
                                <div className="p-2 text-2xl">{card.title}</div>
                            )}

                            {data.duedate ?
                                <div onClick={async () => {
                                    if (role !== "") {
                                        await updateDoc(doc(db, "card", cardId), {
                                            duedate: [data.duedate[0], !data.duedate[1]]
                                        })
                                    }

                                }} className={"absolute text-sm font-medium right-[14.5rem] top-[2.5rem] px-4 py-4 rounded " + getBg((new Date(new Date().getTime()) >= new Date(data.duedate[0])), data.duedate[1])}>
                                    <div>Due Dates</div>
                                    <p>
                                        {new Date(data.duedate[0]).toLocaleTimeString("en-US", opt)}
                                    </p>
                                </div>
                                : null}

                            {cardLabel ? (
                                <div className="flex">
                                    {cardLabel.map((label) => {
                                        return (
                                            <>
                                                <div
                                                    key={label}
                                                    className={`h-2 w-10 ${label} rounded-md mt-1 ml-3`}
                                                ></div>
                                            </>

                                        );
                                    })}
                                </div>
                            ) : null}
                            <p className="p-2 text-md font-medium">Card Description</p>
                            {role !== "" ? (
                                <div className="mb-12" style={{ width: "100%", height: 125 }}>
                                    <div className="bg-gray-100 " ref={quillRef} />
                                </div>
                            ) : (
                                <p className="min-h-[3rem] bg-blue-100 rounded-md p-3">
                                    {data.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: data.description }} />
                                    ) : (
                                        "No Card Description"
                                    )}
                                </p>
                            )}
                            <CheckListRender cardId={cardId} role={role} />
                            <CardFileAttach
                                role={role}
                                cardId={cardId}
                            />
                            <CommentRenderer
                                role={role}
                                cardId={cardId}
                            />
                        </div>

                        {role !== "" ? (
                            <div className="ml-8 !RIGHT w-40 text-sm text-gray-600  ">
                                <p className="p-2"> Add to Card</p>
                                <div
                                    onClick={() => {
                                        ref.current.classList.toggle("hidden");
                                    }}
                                    className="!LABEL relative p-2 flex bg-gray-100 rounded-sm hover:bg-gray-200 cursor-pointer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 "
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="#4b5563"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    <p className="ml-2">Labels</p>
                                </div>

                                <div
                                    ref={ref}
                                    className="hidden z-30 !CLICKED_LABEL bg-white border-gray-50 border rounded drop-shadow-xl h-fit absolute w-64"
                                >
                                    <p className="w-full text-center p-3">Labels</p>

                                    {labels.map((label) => {
                                        return (<>
                                            <LabelColor
                                                cardId={cardId}
                                                labels={card.labels}
                                                color={label.data().color}
                                                labelName={label.data().name}
                                                labelId={label.id}
                                                ref={ref}
                                            />

                                        </>
                                        )
                                    })}

                                    <div className="py-3 px-2  text-gray-500">
                                        <button
                                            onClick={() => {
                                                ref.current.classList.toggle("hidden");
                                                ref2.current.classList.toggle("hidden");
                                            }}
                                            className="bg-gray-50 w-full rounded h-8 hover:bg-gray-200"
                                        >
                                            Create a new label
                                        </button>
                                    </div>
                                </div>

                                <div
                                    ref={ref2}
                                    className=" hidden z-50 !CUSTOM_LABEL bg-white border-gray-50 border rounded drop-shadow-xl h-52 absolute  w-64  flex-col  text-xs"
                                >
                                    <svg
                                        onClick={() => {
                                            ref.current.classList.toggle("hidden");
                                            ref2.current.classList.toggle("hidden");
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 absolute w-4 top-4 left-2 cursor-pointer"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                    <p className="w-full text-center p-3 text-sm">
                                        Create a new Label
                                    </p>
                                    <label className="px-3 py-1" htmlFor="">
                                        Name
                                    </label>
                                    <div className="px-3">
                                        <input
                                            className="p-3 w-full h-[2rem] border-2 rounded "
                                            type="text"
                                            ref={labelRef}
                                        />
                                    </div>
                                    <p className="px-3 py-1 mt-1">Select a color</p>
                                    <div className="px-3 w-full flex flex-wrap">
                                        {colors.map((color) => {
                                            return (
                                                <div
                                                    id="favcolor"
                                                    name="favcolor"
                                                    onClick={() => handleClick(color)}
                                                    className={"py-2 px-4 mx-1 my-[2px] w-3 h-3 cursor-pointer " + color}
                                                >
                                                </div>
                                            )

                                        })}

                                    </div>

                                    <div className="px-3">
                                        <button onClick={() => handleCreateLabel()} className="px-3 py-2 bg-blue-500 rounded text-white absolute bottom-2">
                                            Create
                                        </button>
                                    </div>
                                </div>

                                <div
                                    onClick={async () => {
                                        addDoc(collection(db, "checklist"), {
                                            name: "Checklist",
                                            cardId: cardId
                                        })
                                    }}
                                    className="!CHECKLIST relative p-2 mt-2 flex bg-gray-100 rounded-sm hover:bg-gray-200 cursor-pointer"
                                >
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
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                        />
                                    </svg>
                                    <p className="ml-2">Checklist</p>
                                </div>

                                <div
                                    onClick={() => {
                                        deleteDoc(doc(db, "card", cardId));
                                    }}
                                    className="!ARCHIVE relative p-2 mt-2 flex bg-gray-100 rounded-sm hover:bg-gray-200 cursor-pointer"
                                >
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
                                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                        />
                                    </svg>
                                    <p className="ml-2">Delete</p>
                                </div>

                                <CardLink cardId={cardId} />
                                <DueDate cardId={cardId} cardName={data.title} />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardVisit;