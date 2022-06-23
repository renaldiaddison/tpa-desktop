import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, documentId, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../firebase-config';
import AddBoard from './AddBoard'
import DeleteWorkspace from './DeleteWorkspace';
import InviteWorkspace from './InviteWorkspace';
import UpdateWorkspaceForm from './UpdateWorkspaceForm';

const Board = () => {
  const p = useParams();
  const boardRef = collection(db, 'board')
  const workspaceRef = collection(db, 'workspace')
  const userRef = collection(db, "user")
  const [boardList, setBoardList] = useState([])
  const location = useLocation();

  const [showSettings, setShowSettings] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showLeave, setShowLeave] = useState(false)
  let role = ""

  const [member, setMember] = useState([])
  const [admin, setAdmin] = useState([])

  const addMember = (newMember) => {
    setMember((oldArray) => [...oldArray, newMember]);
  };

  const addAdmin = (newAdmin) => {
    setAdmin((oldArray) => [...oldArray, newAdmin]);
  }

  useEffect(() => {

    const q = query(boardRef, where("workspaceId", "==", p.id))
    const onSubsribe = onSnapshot(q, (snapshot) => {
      setBoardList(snapshot.docs.map((doc) => doc))
    })

    const q2 = query(workspaceRef, where(documentId(), "==", p.id))
    const onSubscribe2 = onSnapshot(q2, (snapshot) => {
      if (snapshot.docs[0]) {
        snapshot.docs[0].data().memberId.map((memberId) => {
          const q3 = query(userRef, where("userId", "==", memberId));
          setMember([])
          onSnapshot(q3, (snapshot2) => {
            if (snapshot2.docs[0]) {
              const currentUser = snapshot2.docs[0].data();
              addMember(currentUser);
            }
          })
        })
      }
    })

    const q4 = query(workspaceRef, where(documentId(), "==", p.id))
    const onSubscribe3 = onSnapshot(q4, (snapshot) => {
      if (snapshot.docs[0]) {
        snapshot.docs[0].data().adminId.map((adminId) => {
          const q5 = query(userRef, where("userId", "==", adminId));
          setAdmin([])
          onSnapshot(q5, (snapshot2) => {
            if (snapshot2.docs[0]) {
              const currentUser = snapshot2.docs[0].data();
              addAdmin(currentUser);
            }
          })
        })
      }
    })

    return () => {
      setMember([])
      setAdmin([])
      onSubsribe()
      onSubscribe2()
      onSubscribe3()
    }
  }, [location])

  const getRole = () => {
    const auth = getAuth();
    for (let i = 0; i < admin.length; i++) {
      if (admin[i].userId === auth.currentUser.uid) {
        role = "Admin"
        return
      }
    }

    for (let i = 0; i < member.length; i++) {
      if (member[i].userId === auth.currentUser.uid) {
        role = "Member"
        return
      }
    }
  }

  return (
    <div className="h-[90vh] overflow-y-auto">
      {getRole()}
      <div className="flex pt-4 pl-6">
        {role === "" && boardList.length === 0 ? null : <p className="font-bold text-xl pr-2">Manage Workspace</p>}

        {role === "Admin" ? <div className="flex">
          <svg onClick={() => setShowSettings(true)} className="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          <svg onClick={() => setShowInvite(true)} className="h-5 w-5 mt-2 text-black cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="8.5" cy="7" r="4" />  <line x1="20" y1="8" x2="20" y2="14" />  <line x1="23" y1="11" x2="17" y2="11" /></svg>
          <svg onClick={() => setShowDelete(true)} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1 mt-[5px] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div> : null}
        {role === "Member" ? <svg onClick={() => setShowLeave(true)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-[5px]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg> : null}
      </div>
      <div className="flex flex-wrap">
        {boardList.map((board) => {
          return (
            <Link to={"/home/board/" + board.id} key={board.id}>
              <div className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border">
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{board.data().name}</div>
                  <p className="text-gray-700 text-base">
                    {board.data().description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
        {role === "" ? null : <AddBoard />}
      </div>

      {member.length !== 0 ? <div className="pt-4 pl-6">
        <p className="font-bold text-xl pr-2 mb-5">{"Member List (" + member.length + ")"}</p>
        <div className="flex flex-wrap gap-8">
          {member.map((user) => {
            return (
              <ul key={user.userId} className="border rounded-lg min-w-[250px]">
                <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="w-full flex items-center justify-between p-6 space-x-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-gray-900 text-sm font-medium truncate">{user.displayName}</h3>
                        <span className="flex-shrink-0 inline-block px-2 py-0.5 text-black text-xs font-medium bg-gray-200 rounded-full">
                          Member
                        </span>
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

          })
          }
        </div>
      </div> : <div className="mt-[-24px]"></div>}



      {admin.length !== 0 ? <div className="pt-10 pl-6">
        <p className="font-bold text-xl pr-2 mb-5">{"Admin List (" + admin.length + ")"}</p>
        <div className="flex flex-wrap gap-8">
          {admin.map((user) => {
            return (
              <ul key={user.userId} className="border rounded-lg min-w-[250px]">
                <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="w-full flex items-center justify-between p-6 space-x-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-gray-900 text-sm font-medium truncate">{user.displayName}</h3>
                        <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                          Admin
                        </span>
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
          })}
        </div>
      </div> : null}

      {showSettings && <UpdateWorkspaceForm closeSettings={setShowSettings} />}
      {showInvite && <InviteWorkspace closeSettings={setShowInvite} />}
      {showDelete && <DeleteWorkspace closeDelete={setShowDelete} />}
    </div>
  )
}

export default Board