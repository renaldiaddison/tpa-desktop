import { collection, doc, documentId, onSnapshot, query, where } from 'firebase/firestore';
import React, { Fragment, useEffect, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { db } from '../firebase-config';
import CardDetail from './CardDetail';
import UpdateCardModal from './UpdateCardModal'

const CardModel = ({ card, role, index }) => {
    const [cardLabel, setCardLabel] = useState([])


    const [showModal, setShowModal] = useState(false);

    const colRef = doc(db, "card", card.id);

    useEffect(() => {
        // const unsub = onSnapshot(colRef, (snapshot) => {
        //     setCardLabel([])
        //     snapshot.data().labels.map((label) => {
        //         const q = query(collection(db, "label"), where(documentId(), "==", label))
        //         onSnapshot(q, (snapshot) => {
        //             if (snapshot.docs[0]) {
        //                 setCardLabel(oldArray => [...oldArray, snapshot.docs[0].data().color])
        //             }
        //         })
        //     })
        // });

        const q10 = query(collection(db, "label"), where("card", "array-contains", card.id))
        const unsub = onSnapshot(q10, (snapshot) => {
            if (snapshot) {
                setCardLabel(snapshot.docs.map((doc) => doc))
            }
        })



        return () => {
            unsub();
            setCardLabel([])
        }

    }, [])

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
                        {cardLabel.length !== 0 ? (
                            <div className="flex">
                                {cardLabel.map((label) => {
                                    return (
                                        <div
                                            key={label}
                                            className={`h-2 w-10 ${label} rounded-md mt-1 ml-3`}
                                        ></div>

                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                    <svg onClick={() => setShowModal(true)} className="h-4 w-4 text-black cursor-pointer ml-1" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </div>
                {showModal && <CardDetail role={role} cardId={card.id} closeSettings={setShowModal} />}

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
                                    <p className="w-fit px-1 text-base text-black outline-none">{card.data().title}</p>

                                    {cardLabel.length !== 0 ? (
                                        <div className="flex">
                                            {cardLabel.map((label) => {
                                                return (
                                                    <div
                                                        key={label.id}
                                                        className={`h-2 w-10 ${label.data().color} rounded-md mt-1 ml-3`}
                                                    ></div>

                                                );
                                            })}
                                        </div>
                                    ) : null}

                                </div>
                                {role === "" ? null : <svg onClick={() => setShowModal(true)} className="h-4 w-4 text-black cursor-pointer ml-1" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}


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