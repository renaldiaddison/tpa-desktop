import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase-config'


const MemberCardBoard = ({ user, role }) => {
    const p = useParams()
    const boardDoc = doc(db, "board", p.id)

    const promote = async () => {

        await updateDoc(boardDoc, {
            memberId: arrayRemove(user.userId),
            adminId: arrayUnion(user.userId)
        })
    }

    const remove = async () => {
        await updateDoc(boardDoc, {
            memberId: arrayRemove(user.userId),
        })
    }


    return (
        <ul className="border rounded-lg min-w-[300px]">
            <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                <div className="w-full flex items-center justify-between p-6 space-x-6">
                    <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                            <h3 className="text-gray-900 text-sm font-medium truncate">{user.displayName}</h3>
                            <span className="flex-shrink-0 inline-block px-2 py-0.5 text-black text-xs font-medium bg-gray-200 rounded-full">
                                Member
                            </span>
                            {role === 'Admin' ? <svg xmlns="http://www.w3.org/2000/svg" onClick={() => promote()} className="h-4 w-4 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg> : null}
                            {role === "Admin" ? <svg xmlns="http://www.w3.org/2000/svg" onClick={() => remove()} className="h-4 w-4 text-red-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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

export default MemberCardBoard