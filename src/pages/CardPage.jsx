import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CardVisit from '../components/CardVisit'

const CardPage = () => {

    const p = useParams()
    const navigate = useNavigate()
    console.log(p.id)
    console.log(p.bId)

    return (
        <CardVisit role="" cardId={p.id} boardId={p.bId} ></CardVisit>
    )
}

export default CardPage