import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { db } from '../firebase-config'
import AddList from '../components/AddList'
import { async } from '@firebase/util'
import NewList from './NewList'

const List = () => {

  const p = useParams()
  const listRef = collection(db, 'list')
  const [lists, setLists] = useState([])
  const location = useLocation();

  useEffect(() => {
    const q = query(listRef, where("boardId", "==", p.id))
    const onSubsribe = onSnapshot(q, (snapshot) => {
      setLists(snapshot.docs.map((doc) => doc))
    })
    return () => onSubsribe()

  }, [location])

  return (
    <div className="h-[90vh] overflow-y-auto">
      <div className="flex flex-wrap">
        {lists.map((list) => {
          return (
            <div key={list.id} className="w-[260px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 border">
              <NewList listId = {list.id} listTitle = {list.data().title} listDesc = {list.data().description}/>
            </div>
          )
        })}
        <AddList />
      </div>
    </div>
  )
}

export default List