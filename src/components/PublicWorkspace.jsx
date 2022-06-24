import { collection, onSnapshot } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { db } from '../firebase-config'

const PublicWorkspace = () => {

    const [workspaces, setWorkspaces] = useState([])
    const location = useLocation()

    useEffect(() => {
        const workspaceRef = collection(db, 'workspace')
        const onSubscribe = onSnapshot(workspaceRef, (snapshot) => {
            setWorkspaces(snapshot.docs.map(doc => doc))
        })

        return () => onSubscribe()

    }, [location])


    return (
        <div className="h-[90vh] overflow-y-auto">
            <div className="flex pt-4 pl-6">
                <p className="font-bold text-xl pr-2">Public Workspaces</p>


            </div>
            <div className="flex flex-wrap">
                {workspaces.map((workspace) => {
                    return (
                        <Link to={"/home/workspace/" + workspace.id} key={workspace.id}>{
                            workspace.data().visibility === "Public" ?
                                <div className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border">
                                    <div className="px-6 py-4">
                                        <div className="font-bold text-xl mb-2">{workspace.data().name}</div>
                                        <p className="text-gray-700 text-base">
                                            {workspace.data().description}
                                        </p>
                                    </div>

                                </div> : null}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default PublicWorkspace