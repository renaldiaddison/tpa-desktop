import { addDoc, collection } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase-config'

const AddList = () => {

  const p = useParams()
  const listRef = collection(db, 'list')

  const addForm = (e) => {
    e.preventDefault()
    addDoc(listRef, {
      title: "List title",
      description: "List description",
      boardId: p.id,
    })
  }

  // useEffect(() => {
  //   const addForm = document.querySelector('.addBoard')
  //   addForm.addEventListener('submit', (e) => {
  //     e.preventDefault()
  //     addDoc(listRef, {
  //       name: "List title",
  //       description: "List description",
  //       boardId: p.id,
  //     })
  //   })
  // }, [])

  return (
    <div>
      <div onClick={addForm} className="w-[260px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 px-6 py-4 border bg-gray-400 cursor-pointer">
        <p className="text-lg text-white italic">Create new list</p>
      </div>
      {/* {showModal && <BoardModal closeModal = {setShowModal}/>} */}
    </div>
  )
}

export default AddList