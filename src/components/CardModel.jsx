import React, { Fragment, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import CardDetail from './CardDetail';
import UpdateCardModal from './UpdateCardModal'

const CardModel = ({ card, role, index }) => {

    const [showModal, setShowModal] = useState(false);
    return (

        <>
            {role === "" ? <div >

                <div
                    style={{
                        userSelect: "none",
                        padding: "16",
                        margin: "0 0 8px 0",
                        minHeight: "50px",
                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                        color: "black",
                        verticalAlign: "middle",
                    }}
                >
                    <div className="items-center rounded-md mt-2 flex">
                        <p className="w-full px-1 text-base text-black outline-none">{card.data().title}</p>
                        {role === "" ? null : <svg onClick={() => setShowModal(true)} className="h-5 w-5 text-gray-600 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
                    </div>
                </div>

            </div> : <div >

                <Draggable draggableId={card.id} index={index}>
                    {(provided, snapshot) => {
                        return (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                    userSelect: "none",
                                    padding: "16",
                                    margin: "0 0 8px 0",
                                    minHeight: "50px",
                                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                                    backgroundColor: snapshot.isDragging
                                        ? "white"
                                        : "white",
                                    color: "black",
                                    verticalAlign: "middle",
                                    ...provided.draggableProps.style,
                                }}
                            >
                                <div className="items-center rounded-md mt-2 flex">
                                    <p className="w-full px-1 text-base text-black outline-none">{card.data().title}</p>
                                    {role === "" ? null : <svg onClick={() => setShowModal(true)} className="h-5 w-5 text-gray-600 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
                                </div>
                            </div>
                        );
                    }}
                </Draggable>

                {showModal && <CardDetail role={role} cardId={card.id} closeSettings={setShowModal} />}
            </div>}
        </>

    )
}

export default CardModel