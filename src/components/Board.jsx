import { getAuth, onAuthStateChanged, reload } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { db } from '../firebase-config';
import AddBoard from './AddBoard'

const Board = () => {
  const p = useParams();
  const boardRef = collection(db, 'board')
  const [boardList, setBoardList] = useState([])
  const location = useLocation();

  useEffect(() => {
    const q = query(boardRef, where("workspaceId", "==", p.id))
    const onSubsribe = onSnapshot(q, (snapshot) => {
      setBoardList(snapshot.docs.map((doc) => doc))
    })

    return () => onSubsribe()
  }, [location])

  return (
    <div className="h-[90vh] flex flex-wrap border-l-2 overflow-y-auto">

      {boardList.map((board) => {
        return (
          <div key={board.id} class="w-[300px] h-[170px] rounded-xl overflow-hidden shadow-lg m-6 border">
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">{board.data().name}</div>
              <p class="text-gray-700 text-base">
                {board.data().description}
              </p>
            </div>
          </div>
        )
      })}


      <AddBoard />
    </div>


  )
}

export default Board