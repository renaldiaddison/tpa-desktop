import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import React, { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { db } from '../firebase-config'
import ClosedBoardSearch from './ClosedBoardSearch'
import HomePageSearch from './HomePageSearch'
import JoinWorkspaceLink from './JoinWorkspaceLink'


const ListClosedBoard = () => {


    const [boardList, setBoardList] = useState([])
    const [boardListMember, setBoardListMember] = useState([])

    const auth = getAuth()

    const location = useLocation()


    useEffect(() => {

        const workspaceRef = collection(db, 'workspace')
        const boardRef = collection(db, 'board')
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const q3 = query(boardRef, where("adminId", "array-contains", user.uid), where("closed", "==", true))
                onSnapshot(q3, (snapshot) => {
                    setBoardList(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                })
                const q4 = query(boardRef, where("memberId", "array-contains", user.uid), where("closed", "==", true))
                onSnapshot(q4, (snapshot) => {
                    setBoardListMember(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

                })
            }
        })

    }, [location])

    return (

        <div className="h-[90vh] w-screen overflow-y-auto">


            <div className="pt-4 px-6 pb-6">
                <ClosedBoardSearch boardAdmin={boardList} boardMember= {boardListMember}></ClosedBoardSearch>
            </div>

            {boardList.length === 0 ? null : <><div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">{"Closed Admin Boards (" + boardList.length + ")"}</p>
            </div>
                <div className="flex flex-wrap">
                    {boardList.map((workspace) => {
                        return (
                            <Link to={"/home/board/" + workspace.id} key={workspace.id}>
                                <div className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border">
                                    <div className="px-6 py-4">
                                        <div className="font-bold text-xl mb-2">{workspace.name}</div>
                                        <p className="text-gray-700 text-base">
                                            {workspace.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div></>}

            {boardListMember.length === 0 ? null : <><div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">{"Closed Member Boards (" + boardListMember.length + ")"}</p>
            </div>
                <div className="flex flex-wrap">
                    {boardListMember.map((workspace) => {
                        return (
                            <Link to={"/home/board/" + workspace.id} key={workspace.id}>
                                <div className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border">
                                    <div className="px-6 py-4">
                                        <div className="font-bold text-xl mb-2">{workspace.name}</div>
                                        <p className="text-gray-700 text-base">
                                            {workspace.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div></>}

        </div>

    )
}

export default ListClosedBoard