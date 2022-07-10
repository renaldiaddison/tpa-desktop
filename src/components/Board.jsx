import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { arrayRemove, arrayUnion, collection, doc, documentId, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { useUserAuth } from '../Script/AuthContext';
import AddBoard from './AddBoard'
import AdminCard from './AdminCard';
import DeleteWorkspace from './DeleteWorkspace';
import InviteWorkspace from './InviteWorkspace';
import LeaveWorkspace from './LeaveWorkspace';
import LeaveWorkspaceAdmin from './LeaveWorkspaceAdmin';
import MemberCard from './MemberCard';
import ShowWorkspaceDetail from './ShowWorkspaceDetail';
import UpdateWorkspaceForm from './UpdateWorkspaceForm';

const Board = () => {

  const p = useParams();
  const boardRef = collection(db, 'board')
  const workspaceRef = collection(db, 'workspace')
  const favoriteRef = collection(db, "favorite")
  const userRef = collection(db, "user")
  const [boardList, setBoardList] = useState([])
  const location = useLocation();

  const [ws, setWs] = useState([])
  const [favorite, setFavorite] = useState([])

  const [showSettings, setShowSettings] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showSettingsMember, setShowSettingsMember] = useState(false)
  const [showLeave, setShowLeave] = useState(false)
  const [showLeaveAdmin, setShowLeaveAdmin] = useState(false)

  let role = ""

  const [member, setMember] = useState([])
  const [admin, setAdmin] = useState([])
  const [wsName, setWsName] = useState("")
  const [invited, setInvited] = useState([])

  const auth = getAuth()

  const { user, userData, userId } = useUserAuth()

  const addMember = (newMember) => {
    setMember((oldArray) => [...oldArray, newMember]);
  };

  const addAdmin = ((newAdmin) => {
    setAdmin((oldArray) => [...oldArray, newAdmin]);
  })

  const addInvited = ((newInvited) => {
    setInvited((oldArray) => [...oldArray, newInvited])
  })

  useEffect(() => {

    const q6 = query(workspaceRef, where(documentId(), "==", p.id))
    const onSubs = onSnapshot(q6, (snapshot) => {
      if (snapshot.docs[0]) {
        setWs(snapshot.docs[0].data())
      }
    })

    const q = query(boardRef, where("workspaceId", "==", p.id))
    const onSubsribe = onSnapshot(q, (snapshot) => {
      setBoardList(snapshot.docs.map((doc) => doc))
    })

    const q2 = query(workspaceRef, where(documentId(), "==", p.id))
    const onSubscribe2 = onSnapshot(q2, (snapshot) => {
      if (snapshot.docs[0]) {
        setWsName(snapshot.docs[0].data().name)
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
        setWsName(snapshot.docs[0].data().name)
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

    const q5 = query(workspaceRef, where(documentId(), "==", p.id))
    const onSubscribe4 = onSnapshot(q5, (snapshot) => {
      if (snapshot.docs[0]) {
        setWsName(snapshot.docs[0].data().name)
        snapshot.docs[0].data().invitedId.map((invitedId) => {
          const q6 = query(userRef, where("userId", "==", invitedId));
          setInvited([])
          onSnapshot(q6, (snapshot2) => {
            if (snapshot2.docs[0]) {
              const currentUser = snapshot2.docs[0].data();
              addInvited(currentUser);
            }
          })
        })
      }
    })

    onAuthStateChanged(auth, (user) => {
      const q7 = query(favoriteRef, where("userId", "==", user.uid))
      onSnapshot(q7, (snapshot) => {
        if (snapshot.docs[0]) {
          setFavorite(snapshot.docs[0])
        }
      })
    })


    return () => {
      setMember([])
      setAdmin([])
      setInvited([])
      onSubs()
      onSubsribe()
      onSubscribe2()
      onSubscribe3()
      onSubscribe4()
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

  const favoriteHandle = (e, boardId) => {

    // if (userData.favorite.includes(boardId)) {
    //   console.log("masuk")
    //   updateDoc(doc(db, "user", userId), {
    //     favorite: arrayRemove(boardId)
    //   })
    // }
    // else if (userData.favorite.includes(boardId) === false) {
    //   console.log("masuk2")

    //   updateDoc(doc(db, "user", userId), {
    //     favorite: arrayUnion(boardId)
    //   })
    // }
    // setMember(member)
    // setAdmin(admin)




  }

  return (
    <div className="h-[90vh] overflow-y-auto">
      {getRole()}
      <div className="flex pt-4 pl-6">
        {role === "" && boardList.length === 0 ? null : <p className="font-bold text-xl pr-2 mt-[3px]">{"Manage Workspace '" + ws.name + "'"}</p>}

        {role === "Admin" ? <div className="flex">
          <svg onClick={() => setShowSettings(true)} className="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          <svg onClick={() => setShowInvite(true)} className="h-5 w-5 mt-2 text-black cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="8.5" cy="7" r="4" />  <line x1="20" y1="8" x2="20" y2="14" />  <line x1="23" y1="11" x2="17" y2="11" /></svg>
          <svg onClick={() => setShowLeaveAdmin(true)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-[7px] ml-2 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <svg onClick={() => setShowDelete(true)} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1 mt-[5px] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>

        </div> : null}
        {role === "Member" ? <div className="flex">
          <svg onClick={() => setShowSettingsMember(true)} className="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          <svg onClick={() => setShowLeave(true)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-[7px] cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
        </div> : null}

        {role === "" ? <div className="flex">
          <svg onClick={() => setShowSettingsMember(true)} className="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        </div> : null}
      </div>
      <div className="flex flex-wrap">
        {boardList.map((board) => {

          const auth = getAuth()
          if (board.data().visibility === "Public") {
            return (

              <>

                <div className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border relative" key={board.id}>

                  {favorite && favorite.data().boardId.includes(board.id) ? <svg onClick={() => {
                    if (favorite.data().boardId && favorite.data().boardId.includes(board.id)) {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayRemove(board.id)
                      })
                    }
                    else {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayUnion(board.id)
                      })
                    }
                  }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute cursor-pointer right-1" fill="" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg> : <svg onClick={() => {
                    if (favorite.data().boardId && favorite.data().boardId.includes(board.id)) {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayRemove(board.id)
                      })
                    }
                    else {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayUnion(board.id)
                      })
                    }
                  }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute cursor-pointer right-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>}

                  <Link to={"/home/board/" + board.id}>
                    <div className="px-6 py-4 h-full">
                      <div className="font-bold text-xl mb-2">{board.data().name}</div>
                      <p className="text-gray-700 text-base">
                        {board.data().description}
                      </p>
                    </div>
                  </Link>

                </div>
              </>

            )
          }
          else if (board.data().visibility === "Workspace" && role != "") {
            return (
              <>

                <div className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border relative" key={board.id}>

                  {favorite.data().boardId && favorite.data().boardId.includes(board.id) ? <svg onClick={() => {
                    if (favorite.data().boardId && favorite.data().boardId.includes(board.id)) {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayRemove(board.id)
                      })
                    }
                    else {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayUnion(board.id)
                      })
                    }
                  }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute cursor-pointer right-1" fill="" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg> : <svg onClick={() => {
                    if (favorite.data().boardId && favorite.data().boardId.includes(board.id)) {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayRemove(board.id)
                      })
                    }
                    else {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayUnion(board.id)
                      })
                    }
                  }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute cursor-pointer right-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>}

                  <Link to={"/home/board/" + board.id}>
                    <div className="px-6 py-4 h-full">
                      <div className="font-bold text-xl mb-2">{board.data().name}</div>
                      <p className="text-gray-700 text-base">
                        {board.data().description}
                      </p>
                    </div>
                  </Link>

                </div>
              </>
            )
          }
          else if (board.data().memberId.includes(auth.currentUser.uid) === true || board.data().adminId.includes(auth.currentUser.uid) === true) {
            return (
              <>

                <div className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border relative" key={board.id}>

                  {favorite.data().boardId && favorite.data().boardId.includes(board.id) ? <svg onClick={() => {
                    if (favorite.data().boardId && favorite.data().boardId.includes(board.id)) {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayRemove(board.id)
                      })
                    }
                    else {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayUnion(board.id)
                      })
                    }
                  }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute cursor-pointer right-1" fill="" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg> : <svg onClick={() => {
                    if (favorite.data().boardId && favorite.data().boardId.includes(board.id)) {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayRemove(board.id)
                      })
                    }
                    else {
                      updateDoc(doc(db, "favorite", favorite.id), {
                        boardId: arrayUnion(board.id)
                      })
                    }
                  }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute cursor-pointer right-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>}

                  <Link to={"/home/board/" + board.id}>
                    <div className="px-6 py-4 h-full">
                      <div className="font-bold text-xl mb-2">{board.data().name}</div>
                      <p className="text-gray-700 text-base">
                        {board.data().description}
                      </p>
                    </div>
                  </Link>

                </div>
              </>
            )
          }
        })}
        {role === "" ? null : <AddBoard />}
      </div>

      {member.length !== 0 ? <div className="pt-4 pl-6">
        <p className="font-bold text-xl pr-2 mb-5">{"Member List (" + member.length + ")"}</p>
        <div className="flex flex-wrap gap-8">
          {member.map((user) => {

            return (
              <MemberCard key={user.userId} user={user} role={role} />
            )

          })
          }
        </div>
      </div> : <div className="mt-[-24px]"></div>}



      {admin.length !== 0 ? <div className="pt-10 pl-6">

        <p className="font-bold text-xl pr-2 mb-5">{"Admin List (" + admin.length + ")"}</p>
        <div className="flex flex-wrap gap-8">
          {admin.map((user) => {

            const auth = getAuth()
            var bool = false
            if (user.userId === auth.currentUser.uid) {
              bool = true;
            }

            return (
              <AdminCard user={user} role={role} bool={bool} />
            )
          })}
        </div>
      </div> : null}

      {showSettings && <UpdateWorkspaceForm closeSettings={setShowSettings} />}
      {showInvite && <InviteWorkspace closeSettings={setShowInvite} admin={admin} member={member} wsName={wsName} invited={invited} />}
      {showDelete && <DeleteWorkspace closeDelete={setShowDelete} />}
      {showSettingsMember && <ShowWorkspaceDetail closeSettings={setShowSettingsMember} />}
      {showLeave && <LeaveWorkspace closeLeave={setShowLeave} />}
      {showLeaveAdmin && <LeaveWorkspaceAdmin closeLeave={setShowLeaveAdmin} />}
    </div>
  )
}

export default Board