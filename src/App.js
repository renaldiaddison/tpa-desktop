import logo from './logo.svg';
import { app } from './firebase-config';
import './App.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
function signIn(e) {
  e.preventDefault();
  signInWithEmailAndPassword(auth, e.target.email.value, e.target.pass.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

function App() {
  return (
    <form action='' onSubmit={signIn}>
      <input type="text" name="email" className='border'></input>
      <input type="password" className='border'name="pass"></input>
      <button type="submit" name="submit" className="border">submit</button>
    </form>
  )
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
