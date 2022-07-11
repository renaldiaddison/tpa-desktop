import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../firebase-config";

const LabelColor = ({ color, labels, cardId, labelName, labelId }) => {
    var stringClass = `w-52 h-6 ${color} rounded-sm hover:border-2 hover:border-gray-300 relative text-white px-2`;
    // var stringClass = `w-52 h-6 bg-[#EB1D36] rounded-sm hover:border-2 hover:border-gray-300 relative`;

    const colRef = doc(db, "card", cardId);

    const ref2 = useRef()
    const [name, setName] = useState(labelName)
    // const labelRef = useRef(labelName)
    const colors = ["bg-green-400", "bg-yellow-400", "bg-orange-400", "bg-red-400", "bg-blue-400", "bg-cyan-400", "bg-purple-400", "bg-stone-400"]
    let selectedColor = color

    const handleCreateLabel = () => {
        updateDoc(doc(db, "label", labelId), {
            name: name,
            color: selectedColor,
        })

        console.log(labels)
        if (!(labels && labels.includes(labelId))) {
            updateDoc(colRef, {
                labels: arrayUnion(labelId),
            });
            updateDoc(colRef, {
                labels: arrayRemove(labelId),
            });

        }
        else {
            updateDoc(colRef, {
                labels: arrayRemove(labelId),
            });
            updateDoc(colRef, {
                labels: arrayUnion(labelId),
            });
        }

        // if (!(labels && labels.includes(labelId))) {
        //     updateDoc(colRef, {
        //         labels: arrayUnion(labelId),
        //     });

        // }
        // else {
        //     updateDoc(colRef, {
        //         labels: arrayRemove(labelId),
        //     });
        // }
        ref2.current.classList.toggle("hidden");
    }

    const handleDeleteLabel = () => {
        deleteDoc(doc(db, "label", labelId))
        ref2.current.classList.toggle("hidden");
    }

    const back = () => {
        ref2.current.classList.toggle("hidden");
    }

    const handleClick = (color) => {
        if (selectedColor !== color) {
            selectedColor = color;
            console.log(selectedColor)
        }
    }

    const handleChange = (e) => {
        setName(e.target.value)
    }

    return (
        <>
            <div className="px-2 py-1 flex items-center justify-center cursor-pointer">
                <div
                    onClick={() => {
                        if (!(labels && labels.includes(labelId))) {
                            updateDoc(colRef, {
                                labels: arrayUnion(labelId),
                            });
                            const newData = {
                                card: arrayUnion(cardId)
                            }
                            updateDoc(doc(db, "label", labelId), newData)

                        }
                        else {
                            updateDoc(colRef, {
                                labels: arrayRemove(labelId),
                            });
                            const newData = {
                                card: arrayRemove(cardId)
                            }
                            updateDoc(doc(db, "label", labelId), newData)
                        }
                    }}
                    className={stringClass}
                >
                    {labelName}
                    {labels && labels.includes(labelId) ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 stroke-white absolute right-1 top-[1px]"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    ) : null}
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 flex grow "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    onClick={() => {
                        back()
                    }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                </svg>

                <div
                    ref={ref2}
                    className=" hidden z-50 !CUSTOM_LABEL bg-white border-gray-50 border rounded drop-shadow-xl h-52 absolute  w-64  flex-col  text-xs"
                >
                    <svg
                        onClick={() => {
                            back()
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
                        Change Label
                    </p>
                    <label className="px-3 py-1" htmlFor="">
                        Name
                    </label>
                    <div className="px-3">
                        <input
                            className="p-3 w-full h-[2rem] border-2 rounded "
                            name="nama"
                            type="text"
                            defaultValue={labelName}
                            onChange={handleChange}
                        ></input>
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
                            Save
                        </button>
                        <button onClick={() => handleDeleteLabel()} className="px-3 py-2 bg-red-500 rounded text-white absolute bottom-2 right-2">
                            Delete
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default LabelColor;