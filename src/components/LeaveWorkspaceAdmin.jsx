import { arrayRemove, collection, collectionGroup, deleteDoc, doc, documentId, query, updateDoc, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase-config'
import { useUserAuth } from '../Script/AuthContext'
import { toastError, toastSuccess } from '../Script/Toast'
import { getWorkspaceById } from '../Script/Workspace'
import DeleteWorkspace from './DeleteWorkspace'

const LeaveWorkspaceAdmin = ({ closeLeave }) => {

    const p = useParams()
    const navigate = useNavigate()
    // const [ws, setWs] = useState([])
    const [showDelete, setShowDelete] = useState(false)

    const { user, userData } = useUserAuth()

    const deleteWorkspace = () => {
        
        const workspaceDoc = doc(db, "workspace", p.id)
        deleteDoc(workspaceDoc)
    
    }

    const leaveWorkspace = () => {

        getWorkspaceById(p.id).then((ws, id) => {
            console.log(ws)
            if (ws.adminId.length !== 1) {
                const workspaceDoc = doc(db, "workspace", p.id)
                updateDoc(workspaceDoc, {
                    adminId: arrayRemove(user.uid)
                })
                toastSuccess("Successfully left workspace")
                navigate("/home")
            }
            else if (ws.adminId.length === 1 && ws.memberId.length > 0) {
                navigate("/home/workspace/" + p.id)
                closeLeave(false)
                toastError("You must grant a member to leave workspace")
            }
            else if (ws.adminId.length === 1 && ws.memberId.length === 0) {
                deleteWorkspace()
                toastSuccess("Successfully left workspace")
                navigate("/home")
            }

        })




    }

    const handleClick = () => {
        leaveWorkspace()
        
    }


    return (
        <div tabIndex="-1" aria-hidden="true" className="fixed overflow-y-auto overflow-x-hidden w-full md:inset-0 md:h-full bg-gray-500 bg-opacity-30 h-full flex justify-center items-center">
            <div className="fixed p-4 w-[500px] max-w-2xl h-full md:h-auto">
                <div className="bg-white rounded-lg shadow dark:bg-gray-700 border-2 relative">
                    <button onClick={() => closeLeave(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                    <div className="py-6 px-6 lg:px-8">
                        <h3 className="mb-3 text-xl font-medium text-gray-900 dark:text-white">Leave Workspace</h3>
                        <p className="mb-3">Are you sure to leave this workspace?</p>
                        <div className="updateWorkspace space-y-3">
                            <div>
                                <button onClick={() => handleClick()} className="text-white bg-red-700 hover:bg-red-800 mr-3 focus:outline-none font-medium rounded-lg text-sm py-[6px] px-4 text-center border border-red-700">Yes</button>
                                <button onClick={() => closeLeave(false)} className="text-black bg-white focus:outline-none font-medium rounded-lg text-sm py-[6px] px-4 text-center border border-gray-400">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showDelete && <DeleteWorkspace closeDelete={setShowDelete} />}
        </div>
    )
}

export default LeaveWorkspaceAdmin