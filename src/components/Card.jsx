import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase-config';
import CardModel from './CardModel';
import UpdateCardModal from './UpdateCardModal';

const Card = ({ listId, role }) => {

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

    useEffect(() => {
        if (cardList) {
            cardList.sort(compare)
        }
    })

    function compare(a, b) {
        if (a.data().index < b.data().index) {
            return -1;
        }
        else if (a.data().index > b.data().index) {
            return 1;
        }
        return 0;
    }

    return (
        <div>
            {role === "" ?

                <>
                    {cardList.map((card, index) => {
                        return (
                            <div key={card.id}>
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
                                    <CardModel card={card} role={role} />
                                </div>
                            </div>
                        )
                    })}</>
                :
                <>{cardList.map((card, index) => {
                    return (
                        <div key={card.id}>
                            <CardModel card={card} role={role} index={index} />
                        </div>
                    )
                })}</>}


        </div>
    )
}

export default Card