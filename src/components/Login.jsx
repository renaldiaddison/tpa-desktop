import React from 'react'
import { app } from '../firebase-config';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const Login = () => {

  const auth = getAuth();
  const navigate = useNavigate();

  function signIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  function showPass() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  return (
    <div className="w-full max-w-sm border-2 items-center shadow-md rounded-lg">
      <p className='py-6 px-8 text-center text-2xl font-bold border-b-2 justify-between items-center'>
        Login
      </p>
      <form action='' onSubmit={signIn} className="bg-white rounded-lg px-8 pt-6 pb-6 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id="email" type="email" placeholder="Email"></input>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="password" id="password" type="password" placeholder="Password"></input>
        </div>
        <div className="flex mb-4">
          <input className="form-check-input h-4 w-4 border border-gray-300 rounded-lg-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" onClick={showPass} id="flexCheckDefault" name="flexCheckDefault"></input>
          <label className="form-check-label inline-block text-gray-800" htmlFor="flexCheckDefault">
            Show Password
          </label>
        </div>
        <div className="items-center justify-between">
          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" type="submit">
            Login
          </button>
          <div className='flex text-sm justify-center pt-3'>
            <p className='mr-1'>
              Not a member?
            </p>
            <p className="align-baseline font-bold text-blue-500 hover:text-blue-800">
              <Link to='/register'>Register here</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login