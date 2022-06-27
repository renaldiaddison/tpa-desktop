import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase-config'

const AdminCard = ({ user, role, bool }) => {

    const p = useParams()

    const workspaceDoc = doc(db, "workspace", p.id)

    const demote = async () => {
        await updateDoc(workspaceDoc, {
            adminId: arrayRemove(user.userId),
            memberId: arrayUnion(user.userId)
        })
    }

    return (
        <ul key={user.userId} className="border rounded-lg min-w-[300px]">

            <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                <div className="w-full flex items-center justify-between p-6 space-x-6">
                    <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">

                            <h3 className="text-gray-900 text-sm font-medium truncate">{user.displayName} </h3>
                            <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                                Admin
                            </span>
                            {(role === 'Admin' && !bool) ? <svg xmlns="http://www.w3.org/2000/svg" onClick={() => demote()} className="h-4 w-4 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg> : null}
                        </div>
                        <p className="mt-1 text-gray-500 text-sm truncate">{user.email}</p>
                    </div>
                    <img className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" src={user.photoUrl} alt="" />
                </div>
                <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="w-0 flex-1 flex">
                        </div>
                        <div className="-ml-px w-0 flex-1 flex">
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    )
}

export default AdminCard