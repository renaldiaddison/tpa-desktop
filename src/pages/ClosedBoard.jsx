import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import PublicWorkspace from '../components/Public'
import ListClosedBoard from '../components/ListClosedBoard'

const ListBoard = () => {
    const navigate = useNavigate()

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigate("/")
        }
    })

    return (
        <div>
            <Navbar />
            <div className="flex w-screen h-[90vh]">
                <Sidebar />
                <ListClosedBoard/>
            </div>
        </div>

    )
}

export default ListBoard