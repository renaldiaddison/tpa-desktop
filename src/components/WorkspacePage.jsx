import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Board from './Board'

const Home = () => {

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
        <div className="fixed flex">
          <Sidebar />
          <Board />
        </div>
        
        
      </div>
      
    </div>

  )
}

export default Home