import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import List from '../components/List'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const BoardPage = () => {

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
          <List/>
      </div>
    </div>
  )
}

export default BoardPage