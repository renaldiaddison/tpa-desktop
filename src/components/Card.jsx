import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
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
            {cardList.map((card) => {
                return (
                    <CardModel key={card.id} card={card} />
                )
            })}

        </div>
    )
}

export default Card