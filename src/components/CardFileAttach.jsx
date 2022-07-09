import { useState } from "react";
import {
    ref,
    uploadBytes,
    listAll,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase-config";
import { useEffect } from "react";
import {
    arrayRemove,
    arrayUnion,
    doc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";

const CardFileAttach = ({role, cardId}) => {
    const [fileUpload, setfileUpload] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [fileNameList, setFileNameList] = useState([]);
    const [needRefresh, setRefresh] = useState(false);

    console.log(cardId)

    const uploadImage = () => {
        if (fileUpload == null) return;
        const imageRef = ref(
            storage,
            `card-attachments/${cardId}/${fileUpload.name}`
        );
        uploadBytes(imageRef, fileUpload).then(() => {
            setRefresh(!needRefresh);
        });
    };

    const fileRef = ref(storage, `card-attachments/${cardId}/`);

    useEffect(() => {
        listAll(fileRef).then((resp) => {
            setFileNameList(resp.items.map((item) => item.name));

            resp.items.map((item) => {
                getDownloadURL(item).then((url) => {
                    setFileList((prev) => [...prev, url]);
                });
            });
        });
    }, [fileUpload, needRefresh]);

    const [links, setLinks] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "card", cardId), (snap) => {
            if (!snap.empty) {
                setLinks(snap.data().attachlinks);
            } else {
                setLinks([]);
            }
        });
    }, []);

    return (
        <div className="relative">
            <p className="p-2 font-medium">Card Attachments</p>
            {
                <div className="flex flex-col">
                    {links?.length > 0 &&
                        links.map((link) => {
                            return (
                                <div className="flex">
                                    <a
                                        target="_blank"
                                        className="italic px-8 py-2 font-medium w-52"
                                        href={"http://" + link}
                                    >
                                        {link}
                                    </a>

                                    {role === "Admin" ? (
                                        <button
                                            onClick={() => {
                                                updateDoc(doc(db, "card", cardId), {
                                                    attachlinks: arrayRemove(link),
                                                });
                                            }}
                                            className="underline mt-2 w-1/3 text-gray-600 hover:text-gray-800 text-xs ml-5 rounded-xl"
                                        >
                                            Detach Link
                                        </button>
                                    ) : null}
                                </div>
                            );
                        })}
                    {fileNameList.map((file, index) => {
                        return (
                            <div className="flex" key={file}>
                                <div className="flex p-2 mt-1 w-52">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 stroke-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        />
                                    </svg>
                                    <a href={fileList[index]} className="ml-2">
                                        {file}
                                    </a>
                                </div>

                                {role === "Admin" ? (
                                    <button
                                        onClick={() => {
                                            const deleteRef = ref(
                                                storage,
                                                `card-attachments/${cardId}/${file}`
                                            );

                                            deleteObject(deleteRef).then(() => {
                                                setRefresh(!needRefresh);
                                            });
                                        }}
                                        className="underline mt-2 w-1/3 text-gray-600 hover:text-gray-800 text-xs ml-5 rounded-xl"
                                    >
                                        Detach File
                                    </button>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            }

            {role === "Admin" ? (
                <>
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                updateDoc(doc(db, "card", cardId), {
                                    attachlinks: arrayUnion(e.target.value.toLowerCase()),
                                });
                            }
                        }}
                        className="absolute mt-4 right-0 rounded bg-gray-200 px-4 py-1"
                        placeholder="Attach a Link"
                    />

                    <div className="ml-3 mt-4 flex flex-col mb-4">
                        <input
                            onChange={(e) => {
                                setfileUpload(e.target.files[0]);
                            }}
                            type="file"
                        />
                        <button
                            onClick={uploadImage}
                            className="mt-2 px-4 py-1 w-1/4 bg-gray-100 hover:bg-gray-200 rounded border"
                        >
                            Submit
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default CardFileAttach;