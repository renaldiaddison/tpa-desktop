import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { getWorkspaceById } from '../Script/Workspace';
import AddBoard from './AddBoard'
import InviteWorkspace from './InviteWorkspace';
import UpdateWorkspaceForm from './UpdateWorkspaceForm';

const Board = () => {
  const p = useParams();
  const boardRef = collection(db, 'board')
  const [boardList, setBoardList] = useState([])
  const location = useLocation();

  const [showSettings, setShowSettings] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  useEffect(() => {
    const q = query(boardRef, where("workspaceId", "==", p.id))
    const onSubsribe = onSnapshot(q, (snapshot) => {
      setBoardList(snapshot.docs.map((doc) => doc))
    })
    return () => onSubsribe()
  }, [location])

  return (
    <div className="h-[90vh] overflow-y-auto">
      <div className="flex pt-4 pl-6">
        <p className="font-bold text-xl pr-2">Manage Workspace</p>
        <svg onClick={() => setShowSettings(true)} className="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        <svg onClick={() => setShowInvite(true)} class="h-5 w-5 mt-2 text-black cursor-pointer"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="8.5" cy="7" r="4" />  <line x1="20" y1="8" x2="20" y2="14" />  <line x1="23" y1="11" x2="17" y2="11" /></svg>
      </div>
      <div className="flex flex-wrap">
        {boardList.map((board) => {
          return (
            <div key={board.id} className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border">
              <Link to={"/home/board/" + board.id}>
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{board.data().name}</div>
                  <p className="text-gray-700 text-base">
                    {board.data().description}
                  </p>
                </div>
              </Link>
            </div>
          )
        })}
        <AddBoard />
      </div>

      {showSettings && <UpdateWorkspaceForm closeSettings = {setShowSettings}/>}
      {showInvite && <InviteWorkspace closeSettings = {setShowInvite}/>}
    </div>
  )
}

export default Board