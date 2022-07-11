import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import React, { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { db } from '../firebase-config'
import JoinWorkspaceLink from './JoinWorkspaceLink'
import PublicSearch from './PublicSearch'

const Public = () => {

    const [workspaces, setWorkspaces] = useState([])
    const [boards, setBoards] = useState([])
    const auth = getAuth()

    const location = useLocation()
    const [favorite, setFavorite] = useState()
    const favoriteRef = collection(db, "favorite")

    useEffect(() => {
        const workspaceRef = collection(db, 'workspace')

        const boardRef = collection(db, 'board')

        const q3 = query(workspaceRef, where("visibility", "==", "Public"))
        const onSubscribe = onSnapshot(q3, (snapshot) => {
            setWorkspaces(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        })

        const q4 = query(boardRef, where("visibility", "==", "Public"), where("closed", "==", false))
        const onSubscribe2 = onSnapshot(q4, (snapshot) => {
            setBoards(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        })

        onAuthStateChanged(auth, (user) => {
            const q7 = query(favoriteRef, where("userId", "==", user.uid))
            onSnapshot(q7, (snapshot) => {
                if (snapshot.docs[0]) {
                    setFavorite(snapshot.docs[0])
                }
            })
        })


        return () => {
            onSubscribe()
            onSubscribe2()

        }
    }, [location])

    return (
        <div className="h-[90vh] w-screen overflow-y-auto">

            <div className="pt-4 px-6 pb-6">
                <PublicSearch board={boards} workspace={workspaces}></PublicSearch>
            </div>
            {workspaces.length === 0 ? null : <><div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">{"Public Workspaces (" + workspaces.length + ")"}</p>
            </div>
                <div className="flex flex-wrap">
                    {workspaces.map((workspace) => {
                        return (
                            <Link to={"/home/workspace/" + workspace.id} key={workspace.id}>{
                                workspace.visibility === "Public" ?
                                    <div className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border">
                                        <div className="px-6 py-4">
                                            <div className="font-bold text-xl mb-2">{workspace.name}</div>
                                            <p className="text-gray-700 text-base">
                                                {workspace.description}
                                            </p>
                                        </div>
                                    </div> : null}
                            </Link>
                        )
                    })}
                </div></>}


            {boards.length === 0 ? null : <><div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">{"Public Boards (" + boards.length + ")"}</p>
            </div>
                <div className="flex flex-wrap">
                    {boards.map((board) => {
                        return (
                            <>

                                <div className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border relative" key={board.id}>
                                    {favorite?.data().boardId && favorite.data().boardId.includes(board.id) ? <svg onClick={() => {
                                        if (favorite.data().boardId && favorite.data().boardId.includes(board.id)) {
                                            updateDoc(doc(db, "favorite", favorite.id), {
                                                boardId: arrayRemove(board.id)
                                            })
                                        }
                                        else {
                                            updateDoc(doc(db, "favorite", favorite.id), {
                                                boardId: arrayUnion(board.id)
                                            })
                                        }
                                    }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute cursor-pointer right-1" fill="" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg> : <svg onClick={() => {
                                        if (favorite.data().boardId && favorite.data().boardId.includes(board.id)) {
                                            updateDoc(doc(db, "favorite", favorite.id), {
                                                boardId: arrayRemove(board.id)
                                            })
                                        }
                                        else {
                                            updateDoc(doc(db, "favorite", favorite.id), {
                                                boardId: arrayUnion(board.id)
                                            })
                                        }
                                    }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute cursor-pointer right-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>}

                                    <Link to={"/home/board/" + board.id}>
                                        <div className="px-6 py-4 h-full">
                                            <div className="font-bold text-xl mb-2">{board.name}</div>
                                            <p className="text-gray-700 text-base">
                                                {board.description}
                                            </p>
                                        </div>
                                    </Link>

                                </div>
                            </>
                        )
                    })}
                </div></>}





        </div>

    )
}

export default Public