import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { db } from '../firebase-config'
import AddList from '../components/AddList'
import NewList from './NewList'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

const List = () => {

  const p = useParams()
  const listRef = collection(db, 'list')
  const [lists, setLists] = useState([])
  const location = useLocation();
  const [refresh, setRefresh] = useState(true);

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
    return () => onSubsribe()

  }, [location])

  return (
    <DragDropContext onDragEnd={(result) => {
      onDragEnd(result, lists, setLists);
    }}>
      <div className="flex overflow-x-auto overflow-y-auto">
        {lists.map((list) => {
          return (
            <div key={list.id} className="min-w-fit min-h-[150px] rounded-xl overflow-x-hidden shadow-lg m-6 border">
              <NewList listId={list.id} listTitle={list.data().title} listDesc={list.data().description} />
            </div>
          )
        })}
        <AddList />
      </div>
    </DragDropContext>
  )
}

export default List