import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { toastError } from '../Script/Toast';
import { getWorkspaceById } from '../Script/Workspace';

const AcceptInvite = () => {

    const p = useParams()
    const [ws, setWs] = useState([]);
    const location = useLocation()
    const navigate = useNavigate()
    let userId = ""

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        userId = user.uid
        if (!user) {
            navigate("/")
        }
        if(ws.adminId.includes(user.uid) || ws.memberId.includes(user.uid)) {
            navigate("/home/workspace/" + p.id)
            toastError("You already in the workspace")
        }
    })

    useEffect(() => {
        getWorkspaceById(p.id).then((ws, id) => {
            setWs(ws)
        });

    }, [location])

    const updateWorkspace = async () => {
        console.log(userId)
        const workspaceDoc = doc(db, "workspace", p.id)
        await updateDoc(workspaceDoc, {
            memberId: arrayUnion(userId)
        })
    }

    return (
        <div tabIndex="-1" aria-hidden="true" className="fixed overflow-y-auto overflow-x-hidden w-full md:inset-0 md:h-full bg-white bg-opacity-30 h-full flex justify-center items-center">
            <div className="fixed p-4 w-full max-w-2xl h-full md:h-auto">
                <div className="bg-white rounded-lg shadow dark:bg-gray-700 border-2 relative">
                    <div className="py-6 px-6 lg:px-8">
                        <p className="mb-3 text-center">{"You have been invited to join "}<span className="italic">{"'" + ws.name + "'"}</span></p>
                        <div className="addWorkspace space-y-3">
                            <button onClick={() => updateWorkspace()} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Accept Invite</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AcceptInvite