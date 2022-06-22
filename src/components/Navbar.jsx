import { async } from '@firebase/util';
import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const [profileDropdown, setProfileDropdown] = useState(false);

  const auth = getAuth();
  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (menuRef.current == null) return;
      if (!menuRef.current.contains(e.target)) setProfileDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const logOut = async () => {
    await signOut(auth)
  }


  const returnDropdown = () => {
    return (
      <div ref={menuRef} className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border-2" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
        <p className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:underline" role="menuitem" tabIndex="-1" id="user-menu-item-0">View Profile</p>
        {/* <p className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:underline" role="menuitem" tabIndex="-1" id="user-menu-item-1">Settings</p> */}
        <p onClick={logOut} className="cursor-pointer block px-4 py-2 text-sm text-red-600 hover:underline" role="menuitem" tabIndex="-1" id="user-menu-item-2">Logout</p>
      </div>
    )
  }

  const handleDropdown = () => {
    if (profileDropdown === true) {
      setProfileDropdown(false)
    }
    else {
      setProfileDropdown(true)
    }
  }

  return (
      <div className="h-[65px]">
        <div className="fixed h-[65px] bg-white flex w-screen justify-between items-center px-10 border-b-2">
          <h1 className="w-full text-3xl font-bold cursor-pointer"><Link to={"/home"}>CHello</Link></h1>
          {/* <ul className="flex">
            <li className="p-4 hover:underline">
              <Link to="/">Home</Link>
            </li>
            <li className="p-4 hover:underline">
              <Link to="/">Workspace</Link>
            </li>
            <li className="p-4 hover:underline">
              <Link to="/">About</Link>
            </li>
          </ul> */}
          <div className="profile px-5">
            <div onClick={handleDropdown}>
              <button type="button" className="bg-gray-500 flex text-sm rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <span className="sr-only">Open user menu</span>
                <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixqx=nkXPoOrIl0&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80" alt=""></img>
              </button>
            </div>
            {profileDropdown ? returnDropdown() : null}
          </div>
        </div>
      </div>

  )
}

export default Navbar
