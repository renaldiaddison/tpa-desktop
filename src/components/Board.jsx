import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect , useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom';
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
    <div className="h-[90vh] overflow-y-auto">
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
        <AddBoard />
      </div>
    </div>
  )
}

export default Board