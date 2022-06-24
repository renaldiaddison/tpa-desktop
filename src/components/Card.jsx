import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase-config';
import CardModel from './CardModel';
import UpdateCardModal from './UpdateCardModal';

const Card = ({ listId }) => {

    const cardRef = collection(db, "card")
    const auth = getAuth()
    const [cardList, setCardList] = useState([])
    const location = useLocation()

    useEffect(() => {
        const q = query(cardRef, where("listId", "==", listId))
        const unSubscribe = onSnapshot(q, (snapshot) => {
            setCardList(snapshot.docs.map((doc) => doc))
        })

        return () => unSubscribe()
    }, [])

    return (
        <div>
            {cardList.map((card, index) => {
                return (
                    <div key={card.id}>
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
                                        <CardModel card={card} />
                                        {/* {<CardDetail />} */}
                                    </div>
                                );
                            }}
                        </Draggable>

                    </div>
                )
            })}

        </div>
    )
}

export default Card