import React from 'react';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";



const Register = () => {

  const auth = getAuth();
  function signUp(e) {
    e.preventDefault();
    if(e.target.password.value === e.target.confPassword.value) {
      createUserWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
      .then((userCredential) => {
      const user = userCredential.user;
      })
      .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
    }
    else {
      console.log('salah');
    }

  }

  return (
    <div className="w-full max-w-md border-2 item-center shadow-md rounded">
      <p className='py-6 px-8 text-center text-2xl font-bold border-b-2 justify-between items-center'>
        Register
      </p>
      <form action='' onSubmit={signUp} className="bg-white rounded px-8 pt-6 pb-6 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id="email" type="email" placeholder="Email"></input>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" id="name" type="text" placeholder="Name"></input>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="password" id="password" type="password" placeholder="Password"></input>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confPassword">
            Confirm Password
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="confPassword" id="confPassword" type="password" placeholder="Confirm Password"></input>
        </div>
        <div className="items-center justify-between">
          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Register
          </button>
          <div className='flex text-sm justify-center pt-3'>
            <p className='mr-1'>
                Already a member?
            </p>
            <p className="align-baseline font-bold text-blue-500 hover:text-blue-800">
              <Link to='/'>Login here</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register