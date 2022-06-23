import { getAuth, signOut } from 'firebase/auth';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import AddWorkSpace from './AddWorkspace';
import Workspace from './Workspace';

const Sidebar = () => {

  const [showModal, setShowModal] = useState(false);


  const auth = getAuth()

  const logOut = async () => {
    await signOut(auth)
  }

  return (

    <div className="min-w-[300px] max-w-[300px] ml-[-2px] overflow-y-auto overflow-x-hidden border-x-2" >
      <div className="p-6 text-center bg-white">
        <div className="text-xl">
          <div className="flex items-center rounded-md">
          </div>
          <div>
            <div className="border-2 px-2.5 py-2 mb-4 flex items-center rounded-md cursor-pointer bg-white">
              <svg className="h-5 w-5 text-slate-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="10" cy="10" r="7" />  <line x1="21" y1="21" x2="15" y2="15" /></svg>
              <input className="text-[15px] ml-2 w-full bg-transparent focus:outline-none" placeholder="Search" />
            </div>
            <Link to="/home">
              <div className=" p-2.5 mt-4 flex items-center rounded-md cursor-pointer hover:bg-gray-400 hover:text-white">
                <span className="text-[15px] ml-4">Workspace</span>
              </div>
            </Link>
            <div className="p-2.5 mt-4 flex items-center rounded-md cursor-pointer hover:bg-gray-400 hover:text-white">
              <span className="text-[15px] ml-4">Lists</span>
            </div>
            <div className="p-2.5 mt-4 mb-6 flex items-center rounded-md cursor-pointer hover:bg-gray-400 hover:text-white">
              <span className="text-[15px] ml-4">Cards</span>
            </div>
            <div className="border-t border-slate-500"></div>
            <div onClick={() => setShowModal(true)} className="p-2.5 mt-6 flex items-center rounded-none cursor-pointer" >
              <span className="text-[15px] ml-4 mr-2">Add workspace</span>
              <svg className="cursor-pointer scale-75 h-8 w-8 text-black-500 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />  <line x1="12" y1="8" x2="12" y2="16" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
            </div>
            <Workspace />
            <div onClick={logOut} className="p-2.5 mt-4 mb-100 flex items-center rounded-md cursor-pointer hover:underline text-red-600">
              <span className="text-[15px] ml-4">Logout</span>
            </div>
          </div>
        </div>
      </div>
      {showModal && <AddWorkSpace closeModal={setShowModal} />}
    </div>
  )
}

export default Sidebar