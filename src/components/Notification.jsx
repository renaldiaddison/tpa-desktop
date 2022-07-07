import React, { useEffect, useState } from "react";
import { getUser } from "../Script/User";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, documentId, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { toastSuccess } from "../Script/Toast";
import { db } from "../firebase-config";
import { getWorkspaceById, getWorkspaceById2 } from "../Script/Workspace";

function classNames(...classes) {
    return classes.filter(Boolean).join("");
}

const Notification = ({ notification }) => {


    const [currUser, setCurrUser] = useState([])
    const [user, setUser] = useState([]);

    const navigate = useNavigate();

    const deleteNotification = async () => {
        const notifDoc = doc(db, "notification", notification.id)
        await deleteDoc(notifDoc)
        navigate("/home/workspace/" + notification.wsId)
        toastSuccess("Successfully join workspace")
    }

    useEffect(() => {
        getUser(notification.senderId).then((snap) => {
            setCurrUser(snap.docs[0].data());
        });

        getUser(notification.receiveId).then((snap) => {
            setUser(snap.docs[0].data());
        });

    }, []);

    return (
        <>
            <NotificationType notification={notification} currUser={currUser} user={user} />
        </>
    )
}

const NotificationType = ({ notification, currUser, user }) => {

    const navigate = useNavigate()
    const [member, setMember] = useState([]);
    const [admin, setAdmin] = useState([]);
    const location = useLocation();
    const [wsName, setWsName] = useState("")

    const updateWorkspaceDelete = async () => {

        const workspaceDoc = doc(db, "workspace", notification.wsId)
        await updateDoc(workspaceDoc, {
            deleteConf: arrayUnion(notification.receiveId),
        })

        getWorkspaceById2(notification.wsId).then((ws) => {
            const workspace = ws.data()
            if (workspace.adminId.length === workspace.deleteConf.length) {
                deleteWorkspace()
            }
        })
    }


    const handleClickAccept = () => {
        updateWorkspace()
        sendAllNotification()
        deleteNotification()
        navigate("/home/workspace/" + notification.wsId)
        toastSuccess("Successfully join workspace")
    }

    const handleClickDecline = () => {
        updateWorkspace2()
        deleteNotification()
    }

    const deleteWorkspace = async () => {
        const workspaceDoc = doc(db, "workspace", notification.wsId)
        await deleteDoc(workspaceDoc)
    }

    const handleClickAcceptDelete = () => {
        updateWorkspaceDelete()
        deleteNotification()
    }

    const handleClickDeclineDelete = () => {
        deleteNotification()
    }

    const deleteNotification = async () => {
        const notifDoc = doc(db, "notification", notification.id)
        await deleteDoc(notifDoc)

    }

    const addMember = (newMember) => {
        setMember((oldArray) => [...oldArray, newMember]);
    };

    const addAdmin = (newAdmin) => {
        setAdmin((oldArray) => [...oldArray, newAdmin]);
    }

    useEffect(() => {

        const workspaceRef = collection(db, 'workspace')
        const userRef = collection(db, "user")


        const q2 = query(workspaceRef, where(documentId(), "==", notification.wsId))
        const onSubscribe2 = onSnapshot(q2, (snapshot) => {
            if (snapshot.docs[0]) {
                setWsName(snapshot.docs[0].data().name)
                snapshot.docs[0].data().memberId.map((memberId) => {
                    const q3 = query(userRef, where("userId", "==", memberId));
                    setMember([])
                    onSnapshot(q3, (snapshot2) => {
                        if (snapshot2.docs[0]) {
                            const currentUser = snapshot2.docs[0].data();
                            addMember(currentUser);
                        }
                    })
                })
            }
        })

        const q4 = query(workspaceRef, where(documentId(), "==", notification.wsId))
        const onSubscribe3 = onSnapshot(q4, (snapshot) => {
            if (snapshot.docs[0]) {
                setWsName(snapshot.docs[0].data().name)
                snapshot.docs[0].data().adminId.map((adminId) => {
                    const q5 = query(userRef, where("userId", "==", adminId));
                    setAdmin([])
                    onSnapshot(q5, (snapshot2) => {
                        if (snapshot2.docs[0]) {
                            const currentUser = snapshot2.docs[0].data();
                            addAdmin(currentUser);
                        }
                    })
                })
            }
        })

        return () => {
            setMember([])
            setAdmin([])
            onSubscribe2()
            onSubscribe3()
        }
    }, [location])


    const sendAllNotification = () => {
        for (let i = 0; i < member.length; i++) {
            sendNotif(member[i].userId)
        }

        for (let i = 0; i < admin.length; i++) {
            sendNotif(admin[i].userId)
        }
    }

    const sendNotif = (id) => {
        const notifRef = collection(db, "notification")
        return addDoc(notifRef, {
            title: "Announcement!",
            content: user.displayName + " has joined '" + wsName + "' workspace",
            senderId: "CHello.com",
            receiveId: id,
            type: "announce",
            wsId: notification.wsId
        })
    }

    const updateWorkspace = async () => {
        const workspaceDoc = doc(db, "workspace", notification.wsId)
        await updateDoc(workspaceDoc, {
            memberId: arrayUnion(notification.receiveId),
            invitedId: arrayRemove(notification.receiveId)
        })

    }

    const updateWorkspace2 = async () => {
        const workspaceDoc = doc(db, "workspace", notification.wsId)
        await updateDoc(workspaceDoc, {
            invitedId: arrayRemove(notification.receiveId)
        })

    }


    if (notification.type === "offer") {
        return (<React.Fragment>
            <Menu.Item>
                {({ active }) => (
                    <div
                        className={
                            (active ? "bg-gray-800" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer")
                        }
                    >
                        <h1 className="font-bold mb-1 italic">{currUser ? currUser.displayName : ""}</h1>
                        <p> {notification.title}</p>
                        <p> {notification.content}</p>
                        <div className="mt-1">
                            <p onClick={() => handleClickAccept()} className="w-fit inline-flex items-center px-2 mr-2 py-1 mb-3 border border-transparent text-base font-medium justify-center rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none cursor-pointer">
                                Accept
                            </p>
                            <p onClick={() => handleClickDecline()} className="w-fit inline-flex items-center px-2 py-1 mb-3 border border-transparent text-base font-medium justify-center rounded-md shadow-sm text-white bg-red-500 hover:bg-red-700 focus:outline-none cursor-pointer">
                                Decline
                            </p>
                        </div>

                    </div>
                )}
            </Menu.Item>
        </React.Fragment>)
    }
    else if (notification.type === "offerBoard") {
        return (<React.Fragment>
            <Menu.Item>
                {({ active }) => (
                    <div
                        className={
                            (active ? "bg-gray-800" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer")
                        }
                    >
                        <h1 className="font-bold mb-1 italic">{currUser ? currUser.displayName : ""}</h1>
                        <p> {notification.title}</p>
                        <p> {notification.content}</p>
                        <div className="mt-1">
                            <p onClick={() => handleClickAcceptBoard()} className="w-fit inline-flex items-center px-2 mr-2 py-1 mb-3 border border-transparent text-base font-medium justify-center rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none cursor-pointer">
                                Accept
                            </p>
                            <p onClick={() => handleClickDecline()} className="w-fit inline-flex items-center px-2 py-1 mb-3 border border-transparent text-base font-medium justify-center rounded-md shadow-sm text-white bg-red-500 hover:bg-red-700 focus:outline-none cursor-pointer">
                                Decline
                            </p>
                        </div>

                    </div>
                )}
            </Menu.Item>
        </React.Fragment>)
    }
    else if (notification.type === "announce") {
        return (<React.Fragment>
            <Menu.Item>
                {({ active }) => (
                    <div
                        onClick={() => {
                            deleteNotification();
                        }}
                        className={
                            (active ? "bg-gray-800" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer")
                        }
                    >
                        <h1 className="font-bold mb-1 italic">{currUser ? currUser.displayName : ""}</h1>
                        <p> {notification.title}</p>
                        <p> {notification.content}</p>
                    </div>
                )}
            </Menu.Item>
        </React.Fragment>)
    }
    else if (notification.type === "confirmation") {
        return (<React.Fragment>
            <Menu.Item>
                {({ active }) => (
                    <div
                        className={
                            (active ? "bg-gray-800" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer")
                        }
                    >
                        <h1 className="font-bold mb-1 italic">{currUser ? currUser.displayName : ""}</h1>
                        <p> {notification.title}</p>
                        <p> {notification.content}</p>
                        <div className="mt-1">
                            <p onClick={() => handleClickAcceptDelete()} className="w-fit inline-flex items-center px-2 mr-2 py-1 mb-3 border border-transparent text-base font-medium justify-center rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none cursor-pointer">
                                Accept
                            </p>
                            <p onClick={() => handleClickDeclineDelete()} className="w-fit inline-flex items-center px-2 py-1 mb-3 border border-transparent text-base font-medium justify-center rounded-md shadow-sm text-white bg-red-500 hover:bg-red-700 focus:outline-none cursor-pointer">
                                Decline
                            </p>
                        </div>

                    </div>
                )}
            </Menu.Item>
        </React.Fragment>)
    }
}

export default Notification