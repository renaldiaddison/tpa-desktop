import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import React, { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { db } from '../firebase-config'
import AdminWorkspace from './AdminWorkspace'

const PublicWorkspace = () => {

    const [workspaces, setWorkspaces] = useState([])
    const [workspaceList, setWorkspaceList] = useState([])
    const [workspaceListMember, setWorkspaceListMember] = useState([])
    const auth = getAuth()

    const location = useLocation()

    useEffect(() => {
        const workspaceRef = collection(db, 'workspace')

        const q = query(workspaceRef, where("visibility", "==", "Public"))
        const onSubscribe = onSnapshot(workspaceRef, (snapshot) => {
            setWorkspaces(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        })

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

            }
        })

        return () => onSubscribe()
    }, [location])

    return (
        <div className="h-[90vh] w-screen overflow-y-auto">
            <div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">Public Workspaces</p>
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
            </div>

            <div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">Admin Workspaces</p>
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
            </div>

            <div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">Member Workspaces</p>
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
            </div>
        </div>

    )
}

export default PublicWorkspace