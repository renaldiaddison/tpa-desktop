import React, { useState } from 'react'
import UpdateCardModal from './UpdateCardModal'

const   CardModel = ({ card }) => {

    

    const [showModal, setShowModal] = useState(false);
    return (
        <div >
            <div className="items-center rounded-md mt-2 flex">
                <p className="w-full px-1 text-base text-black outline-none">{card.data().title}</p>
                <svg onClick={() => setShowModal(true)} className="h-5 w-5 text-gray-600 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>

            </div>
            {showModal && <UpdateCardModal closeModal={setShowModal} cardId={card.id} />}
        </div>
    )
}

export default CardModel