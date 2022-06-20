import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { db } from '../firebase-config';

const Card = ({ listId }) => {

    const cardRef = collection(db, "card")
    const auth = getAuth()
    const [cardList, setCardList] = useState([])
    const location = useLocation()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const q = query(cardRef, where("listId", "==", listId))
                onSnapshot(q, (snapshot) => {
                    setCardList(snapshot.docs.map((doc) => doc))
                })

            }
        })


    }, [location])

    return (
        <div>
            {cardList.map((card) => {
                return (
                    <div key = {card.id} className="items-center rounded-none mt-2 group">
                        <input spellCheck="false" className="w-full px-1 text-base text-black outline-none" defaultValue={card.data().title}>

                        </input>
                    </div>
                )
            })}

        </div>
    )
}

export default Card