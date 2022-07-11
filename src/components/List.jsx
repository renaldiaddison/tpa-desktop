import { collection, onSnapshot, query, where, doc, updateDoc, documentId, CollectionReference } from 'firebase/firestore'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase-config'
import AddList from '../components/AddList'
import NewList from './NewList'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { getAuth } from 'firebase/auth'
import { getBoardById } from '../Script/Board'
import UpdateBoardForm from './UpdateBoardForm'
import InviteBoard from './InviteBoard'
import BoardMember from './BoardMember'
import ShowBoardDetail from './ShowBoardDetail'
import LeaveBoard from './LeaveBoard'
import CloseBoard from './CloseBoard'
import UnCloseBoard from './UnCloseBoard'
import DeleteBoard from './DeleteBoard'

const List = () => {
  const p = useParams()
  const boardRef = collection(db, 'board')
  const listRef = collection(db, 'list')
  const userRef = collection(db, 'user')
  const [lists, setLists] = useState([])
  const location = useLocation();
  const [refresh, setRefresh] = useState(true);

  let role = ""
  const [member, setMember] = useState([])
  const [admin, setAdmin] = useState([])

  const [showSettings, setShowSettings] = useState(false)
  const [showMemberList, setShowMemberList] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [showClose, setShowClose] = useState(false)
  const [showSettingsMember, setShowSettingsMember] = useState(false)
  const [showLeave, setShowLeave] = useState(false)
  const [showUnClose, setShowUnClose] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const navigate = useNavigate();

  const [b, setB] = useState([])

  const addMember = (newMember) => {
    setMember((oldArray) => [...oldArray, newMember]);
  };

  const addAdmin = (newAdmin) => {
    setAdmin((oldArray) => [...oldArray, newAdmin]);
  }

  const updateCardWithId = (cardId, changes) => {
    const ref = doc(db, "card", cardId)
    return updateDoc(ref, changes)
  }

  function refreshPage() {
    if (refresh) {
      setRefresh(false);
    } else {
      setRefresh(true);
    }
  }

  function onDragEnd(result) {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    console.log(destination)
    console.log(source)
    console.log(draggableId)

    let index = 0;

    if (source.index < destination.index) {
      index = destination.index + 1
    }
    else {
      index = destination.index - 1
    }


    const cardId = draggableId;
    const changes = {
      listId: destination.droppableId,
      index: index
    };

    updateCardWithId(cardId, changes)
      .then(() => {
        refreshPage();
      })
      .catch((error) => {
        console.log("error moving card :", error);
      });
  }

  useEffect(() => {

    const q6 = query(boardRef, where(documentId(), "==", p.id))
    const onSubs = onSnapshot(q6, (snapshot) => {
      if (snapshot.docs[0]) {
        setB(snapshot.docs[0].data())
      }
    })


    const q = query(listRef, where("boardId", "==", p.id))
    const onSubsribe = onSnapshot(q, (snapshot) => {
      setLists(snapshot.docs.map((doc) => doc))
    })

    const q2 = query(boardRef, where(documentId(), "==", p.id))
    const onSubscribe2 = onSnapshot(q2, (snapshot) => {
      if (snapshot.docs[0]) {
        setMember([])
        snapshot.docs[0].data().memberId.map((memberId) => {
          const q3 = query(userRef, where("userId", "==", memberId));

          onSnapshot(q3, (snapshot2) => {
            if (snapshot2.docs[0]) {
              const currentUser = snapshot2.docs[0].data();
              addMember(currentUser);
            }
          })
        })
      }
    })

    const q4 = query(boardRef, where(documentId(), "==", p.id))
    const onSubscribe3 = onSnapshot(q4, (snapshot) => {
      if (snapshot.docs[0]) {
        setAdmin([])
        snapshot.docs[0].data().adminId.map((adminId) => {
          const q5 = query(userRef, where("userId", "==", adminId));

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
      onSubs()
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

  // const validateRole = () => {
  //   if (role === "" && b.visibility === "Private") {
  //     console.log(b.visibility)
  //     console.log(role)
  //     console.log("a")
  //   }
  // }

  return (
    <div className="overflow-hidden h-full ">
      <div className="flex pt-4 pl-6">

        {getRole()}

        {role === "" ? <div className="flex">
          <p className="font-bold text-xl pr-2">{"Board '" + b.name + "'"}</p>
          <svg onClick={() => setShowSettingsMember(true)} className="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          <svg onClick={() => setShowMemberList(true)} class="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="9" cy="7" r="4" />  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />  <path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        </div> : null}

        {/* {validateRole()} */}
        {role === "Admin" && b.closed === false ? <div className="flex">
          <p className="font-bold text-xl pr-2">{"Manage Board '" + b.name + "'"}</p>
          <svg onClick={() => setShowSettings(true)} className="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          <svg onClick={() => setShowMemberList(true)} class="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="9" cy="7" r="4" />  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />  <path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          <svg onClick={() => setShowInvite(true)} className="h-5 w-5 mt-2 text-black cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="8.5" cy="7" r="4" />  <line x1="20" y1="8" x2="20" y2="14" />  <line x1="23" y1="11" x2="17" y2="11" /></svg>
          <svg onClick={() => setShowClose(true)} class="h-6 w-6 ml-1 mt-[5px] text-black cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>

        </div> : null}

        {role === "Admin" && b.closed === true ? <div className="flex">
          <p className="font-bold text-xl pr-2">{"Manage Board '" + b.name + "'"}</p>
          <svg onClick={() => setShowSettings(true)} className="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          <svg onClick={() => setShowMemberList(true)} class="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="9" cy="7" r="4" />  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />  <path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          <svg onClick={() => setShowInvite(true)} className="h-5 w-5 mt-2 text-black cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="8.5" cy="7" r="4" />  <line x1="20" y1="8" x2="20" y2="14" />  <line x1="23" y1="11" x2="17" y2="11" /></svg>
          <svg onClick={() => setShowUnClose(true)} class="h-6 w-6 text-black mt-1 ml-1 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          <svg onClick={() => setShowDelete(true)} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1 mt-[5px] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>

        </div> : null}


        {role === "Member" ? <div className="flex">
          <p className="font-bold text-xl pr-2">{"Board '" + b.name + "'"}</p>
          <svg onClick={() => setShowSettingsMember(true)} className="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          <svg onClick={() => setShowMemberList(true)} class="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="9" cy="7" r="4" />  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />  <path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          <svg onClick={() => setShowLeave(true)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-[7px] cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
        </div> : null}
      </div>
      <DragDropContext onDragEnd={(result) => {
        onDragEnd(result, lists, setLists);
      }}>
        <div className="flex h-full pb-12 overflow-x-auto overflow-y-auto">
          {lists.map((list) => {
            return (
              <div key={list.id} className="min-w-fit min-h-[150px] rounded-xl overflow-x-hidden shadow-lg m-6 border">
                <NewList listId={list.id} listTitle={list.data().title} listDesc={list.data().description} role={role} />
              </div>
            )
          })}
          {role === "" ? null : <AddList />}
        </div>
      </DragDropContext >


      {showSettings && <UpdateBoardForm closeSettings={setShowSettings} />}
      {showInvite && <InviteBoard closeSettings={setShowInvite} admin={admin} member={member} board={b} />}
      {showMemberList && <BoardMember closeSettings={setShowMemberList} role={role} admin={admin} member={member} />}
      {showClose && <CloseBoard close={setShowClose} />}
      {showUnClose && <UnCloseBoard close={setShowUnClose} />}
      {showSettingsMember && <ShowBoardDetail closeSettings={setShowSettingsMember} />}
      {showLeave && <LeaveBoard closeLeave={setShowLeave} />}
      {showDelete && <DeleteBoard closeDelete={setShowDelete} />}

    </div >
  )
}

export default List