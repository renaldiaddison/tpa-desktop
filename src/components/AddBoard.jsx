import React, { useState } from 'react'
import BoardModal from './BoardModal';

const AddBoard = () => {

  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div onClick={() => setShowModal(true)} className="w-[270px] h-[150px] rounded-xl overflow-hidden shadow-lg m-6 px-6 py-4 border bg-gray-400 cursor-pointer">
        <p className="text-lg text-white italic">Create new board</p>
      </div>
      {showModal && <BoardModal closeModal = {setShowModal}/>}
    </div>

  )
}

export default AddBoard