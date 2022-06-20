import React, { useState } from 'react'
import CardModal from './CardModal';

const AddCard = ({listId}) => {

    const [showModal, setShowModal] = useState(false);

    return (
        <div>
        <div className="w-fit flex items-center rounded-none cursor-pointer mt-2" onClick={() => setShowModal(true)}>
            <p className="px-1 text-base text-black mr-1">
                Add Card
            </p>
            <svg className="h-5 w-5 text-gray-600"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M14 3v4a1 1 0 0 0 1 1h4" />  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  <line x1="12" y1="11" x2="12" y2="17" />  <line x1="9" y1="14" x2="15" y2="14" /></svg>
        </div>
        {showModal && <CardModal closeModal = {setShowModal} listId = {listId}/>}
        </div>
    )
}

export default AddCard