import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import React, { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { db } from '../firebase-config'
import HomePageSearch from './HomePageSearch'
import JoinWorkspaceLink from './JoinWorkspaceLink'

const Home = () => {


    const [workspaces, setWorkspaces] = useState([])
    const [workspaceList, setWorkspaceList] = useState([])
    const [workspaceListMember, setWorkspaceListMember] = useState([])
    const [boardList, setBoardList] = useState([])
    const [boardListMember, setBoardListMember] = useState([])

    const [showJoin, setShowJoin] = useState(false)
    const auth = getAuth()

    const location = useLocation()


    useEffect(() => {

        const workspaceRef = collection(db, 'workspace')
        const boardRef = collection(db, 'board')
        onAuthStateChanged(auth, (user) => {
            if (user) {

                const q = query(workspaceRef, where("adminId", "array-contains", user.uid))
                onSnapshot(q, (snapshot) => {
                    setWorkspaceList(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                })

                const q2 = query(workspaceRef, where("memberId", "array-contains", user.uid))
                onSnapshot(q2, (snapshot) => {
                    setWorkspaceListMember(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                })

                const q3 = query(boardRef, where("adminId", "array-contains", user.uid), where("closed", "==", false))
                onSnapshot(q3, (snapshot) => {
                    setBoardList(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                })

                const q4 = query(boardRef, where("memberId", "array-contains", user.uid), where("closed", "==", false))
                onSnapshot(q4, (snapshot) => {
                    setBoardListMember(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                })

            }
        })

    }, [location])


    return (
        <div className="h-[90vh] w-screen overflow-y-auto">

            <div className="pt-4 px-6 pb-6">
                {/* <div className="border-2 px-2.5 py-2 mb-4 flex items-center rounded-md cursor-pointer bg-white">
                    <svg className="h-5 w-5 text-slate-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="10" cy="10" r="7" />  <line x1="21" y1="21" x2="15" y2="15" /></svg>
                    <input className="text-[15px] ml-2 bg-transparent focus:outline-none w-full" placeholder="Search" />
                </div> */}

                <HomePageSearch boardMember={boardListMember} boardAdmin={boardList} workspaceAdmin={workspaceList} workspaceMember={workspaceListMember} />
            </div>
            {workspaceList.length === 0 ? null : <><div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">{"Admin Workspaces (" + workspaceList.length + ")"}</p>
            </div>
                <div className="flex flex-wrap">
                    {workspaceList.map((workspace) => {
                        return (
                            <Link to={"/home/workspace/" + workspace.id} key={workspace.id}>
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


            {workspaceListMember.length === 0 ? null : <><div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">{"Member Workspaces (" + workspaceListMember.length + ")"}</p>
            </div>
                <div className="flex flex-wrap">
                    {workspaceListMember.map((workspace) => {
                        return (
                            <Link to={"/home/workspace/" + workspace.id} key={workspace.id}>
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

            {boardList.length === 0 ? null : <><div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">{"Admin Boards (" + boardList.length + ")"}</p>
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
                <p className="font-bold text-xl pr-2">{"Member Boards (" + boardListMember.length + ")"}</p>
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
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setShowJoin(true)} className="h-9 w-9 absolute right-8 bottom-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>

            {showJoin && <JoinWorkspaceLink closeModal={setShowJoin} />}

        </div>
    )
}

export default Home