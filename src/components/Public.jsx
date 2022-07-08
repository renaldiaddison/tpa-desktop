import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
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
                    {boards.map((workspace) => {
                        return (
                            <Link to={"/home/board/" + workspace.id} key={workspace.id}>{
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





        </div>

    )
}

export default Public