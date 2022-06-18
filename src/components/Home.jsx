import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Home = () => {

  const navigate = useNavigate()

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if(user) {
      const uid = user.uid
      console.log(uid)
    }
    else {
      navigate('/')
    }
  })

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
    </div>
    
  )
}

export default Home