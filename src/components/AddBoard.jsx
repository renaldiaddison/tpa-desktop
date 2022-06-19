import React, { useState } from 'react'
import BoardModal from './BoardModal';

const AddBoard = () => {

  const [showModal, setShowModal] = useState(false);



  return (
    <div>
      <div onClick={() => setShowModal(true)} className="w-[300px] h-[170px] rounded-xl overflow-hidden shadow-lg m-6 border bg-gray-400 p-4 cursor-pointer">
        <p class="text-xl text-white italic">Create Board</p>
      </div>
      {showModal && <BoardModal closeModal = {setShowModal}/>}
    </div>

  )
}

export default AddBoard