import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect , useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { db } from '../firebase-config';
import AddBoard from '../components/AddBoard'

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
    <div className="h-[90vh]  overflow-y-auto">
      <div className="flex flex-wrap">
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
    </div>
  )
}

export default Board