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
      <div ref={menuRef} class="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border-2" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
        <p class="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:underline" role="menuitem" tabindex="-1" id="user-menu-item-0">View Profile</p>
        <p class="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:underline" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</p>
        <p onClick={logOut} class="cursor-pointer block px-4 py-2 text-sm text-red-600 hover:underline" role="menuitem" tabindex="-1" id="user-menu-item-2">Logout</p>
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

  // const returnButton = () => {
  //   return (
  //     <button
  //       className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
  //       <Link to="/">Login</Link>
  //     </button>
  //   )
  // }

  return (
    <div className="relative bg-white">
      <div className="flex  h-[10vh] w-screen justify-between items-center mx-auto px-10 border-b-2">
        <h1 className="w-full text-3xl font-bold">CHello</h1>
        <ul className="flex">
          <li className="p-4 hover:underline">
            <Link to="/">Home</Link>
          </li>
          <li className="p-4 hover:underline">
            <Link to="/">Workspace</Link>
          </li>
          <li className="p-4 hover:underline">
            <Link to="/">About</Link>
          </li>
        </ul>
        <div class="ml-4 relative flex-shrink-0">
          <div onClick={handleDropdown}>
            <button type="button" class="bg-gray-500 flex text-sm rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
              <span class="sr-only">Open user menu</span>
              <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixqx=nkXPoOrIl0&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80" alt=""></img>
            </button>
          </div>
          {profileDropdown ? returnDropdown() : null}
        </div>
      </div>
    </div>
  )
}

export default Navbar
