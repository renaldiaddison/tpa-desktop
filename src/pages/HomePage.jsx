import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Home from '../components/Home'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const HomePage = () => {

  const navigate = useNavigate()

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/")
    }
  })

  return (
    <div>
      <Navbar/>
      <div className="flex w-screen h-[90vh]">
        <Sidebar />
        <Home />
      </div>
    </div>

  )
}

export default HomePage