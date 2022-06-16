import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="relative bg-white">
      <div className='flex w-screen justify-between items-center h-24 mx-auto px-10 border-b-2'>
        <h1 className='w-full text-3xl font-bold'>CHello</h1>
          <ul className='flex'>
            <li className='p-4 hover:underline'><Link to='/'>Home</Link></li>
            <li className='p-4 hover:underline'><Link to='/'>Workspace</Link></li>
            <li className='p-4 hover:underline'><Link to='/'>About</Link></li>
          </ul>
        <button className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        <Link to='/'>Login</Link>
        </button>
      </div>
    </div>
  )
}

export default Navbar