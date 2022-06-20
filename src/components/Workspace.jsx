import userEvent from '@testing-library/user-event'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase-config'
import { Link, useLocation } from 'react-router-dom'

const Workspace = () => {

  const workspaceRef = collection(db, 'workspace')
  const [workspaceList, setWorkspaceList] = useState([])
  const [workspaceListMember, setWorkspaceListMember] = useState([])
  const auth = getAuth();
  let userID = useRef("");
  const location = useLocation();


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userID.current = user.uid;

        const q = query(workspaceRef, where("adminId", "array-contains", userID.current))
        onSnapshot(q, (snapshot) => {
          setWorkspaceList(snapshot.docs.map((doc) => doc))
        })

        const q2 = query(workspaceRef, where("memberId", "array-contains", userID.current))
        onSnapshot(q2, (snapshot) => {
          setWorkspaceListMember(snapshot.docs.map((doc) => doc))
        })

      }
    })

    
  }, [location])

  return (
    <div className="workspace">
      {workspaceList.map((workspace) => {
        return (
          <Link to={"/home/workspace/" + workspace.id} key={workspace.id}>
          <div className="p-2.5 mt-4 flex items-center rounded-md cursor-pointer hover:underline">
            <svg className="ml-3 cursor-pointer scale-75 h-8 w-8 text-black-500 opacity-50"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="8.5" cy="7" r="4" />  <line x1="20" y1="8" x2="20" y2="14" />  <line x1="23" y1="11" x2="17" y2="11" /></svg>
            <span className="text-[15px] ml-3">{workspace.data().name}</span>
          </div>
          </Link>
        )
      })}

      {workspaceListMember.map((workspace) => {
        return (
          <Link to={"/home/workspace/" + workspace.id} key={workspace.id}>
          <div className="p-2.5 mt-4 flex items-center rounded-none cursor-pointer hover:underline">
            <svg className="ml-3 cursor-pointer scale-75 h-8 w-8 text-black-500 opacity-50"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="8.5" cy="7" r="4" />  <line x1="23" y1="11" x2="17" y2="11" /></svg>
            <span className="text-[15px] ml-3">{workspace.data().name}</span>
          </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Workspace