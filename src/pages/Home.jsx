import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

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
        <Sidebar />
      </div>
      
    </div>

  )
}

export default Home