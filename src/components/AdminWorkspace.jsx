import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot } from 'firebase/firestore'
import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { db } from '../firebase-config'

const AdminWorkspace = () => {

    const [wsAdmin, setWsAdmin] = useState([])
    const location = useLocation()
    const currUser = useRef()
    const [workspaces, setWorkspaces] = useState([])

    const addWsAdmin = (newAdminWs) => {
        setWsAdmin((oldArray) => [...oldArray, newAdminWs]);
    }

    const validateAdminWorkspaces = (user) => {
        console.log("masukwda")
        console.log(workspaces.length)
        for (let i = 0; i < workspaces.length; i++) {
            if (workspaces[i].adminId.includes(user.uid)) {
                console.log("awd")
                addWsAdmin(workspaces[i])
            }
        }
    }

    useEffect(() => {

        const workspaceRef = collection(db, 'workspace')
        const onSubscribe = onSnapshot(workspaceRef, (snapshot) => {
            setWorkspaces(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        })

        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                validateAdminWorkspaces(user)
            }
        })

        return () => {
            setWsAdmin([])
        }

    }, [location])

    return (
        <div className="flex flex-wrap">
            {wsAdmin.map((wsAdm) => {
                return (
                    <Link to={"/home/workspace/" + wsAdm.id} key={wsAdm.id}>
                        <div className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border">
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">{wsAdm.name}</div>
                                <p className="text-gray-700 text-base">
                                    {wsAdm.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default AdminWorkspace