import React, { useState } from 'react'
import BoardModal from './BoardModal';

const AddBoard = () => {

  const [showModal, setShowModal] = useState(false);



  return (
    <div>
      <div onClick={() => setShowModal(true)} className="relative w-[300px] h-[170px] rounded-xl overflow-hidden shadow-lg m-6 border bg-gray-400 cursor-pointer">
        <p class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-white italic">Create new board</p>
      </div>
      {showModal && <BoardModal closeModal = {setShowModal}/>}
    </div>

  )
}

export default AddBoard