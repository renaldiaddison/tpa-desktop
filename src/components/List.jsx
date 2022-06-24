import { collection, onSnapshot, query, where, doc, updateDoc, documentId, CollectionReference } from 'firebase/firestore'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { db } from '../firebase-config'
import AddList from '../components/AddList'
import NewList from './NewList'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { getAuth } from 'firebase/auth'

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

    const cardId = draggableId;
    const changes = {
      listId: destination.droppableId,
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
    const q = query(listRef, where("boardId", "==", p.id))
    const onSubsribe = onSnapshot(q, (snapshot) => {
      setLists(snapshot.docs.map((doc) => doc))
    })

    const q2 = query(boardRef, where(documentId(), "==", p.id))
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

    const q4 = query(boardRef, where(documentId(), "==", p.id))
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
    <div className="overflow-hidden h-full ">
      <div className="flex pt-4 pl-6">
        <p className="font-bold text-xl pr-2">Manage Board</p>
        {getRole()}
        {role === "Admin" ? <div className="flex">
          <svg className="h-5 w-5 text-black mt-2 mr-2 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="3" />  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          <svg className="h-5 w-5 mt-2 text-black cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />  <circle cx="8.5" cy="7" r="4" />  <line x1="20" y1="8" x2="20" y2="14" />  <line x1="23" y1="11" x2="17" y2="11" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1 mt-[5px] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div> : null}

        {role === "Member" ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-[5px]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg> : null}
      </div>
      <DragDropContext onDragEnd={(result) => {
        onDragEnd(result, lists, setLists);
      }}>
        <div className="flex h-full pb-12 overflow-x-auto overflow-y-auto">
          {lists.map((list) => {
            return (
              <div key={list.id} className="min-w-fit min-h-[150px] rounded-xl overflow-x-hidden shadow-lg m-6 border">
                <NewList listId={list.id} listTitle={list.data().title} listDesc={list.data().description} />
              </div>
            )
          })}
          {role === "" ?  null : <AddList /> }
        </div>
      </DragDropContext >
    </div >
  )
}

export default List