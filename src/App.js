import { app } from './firebase-config';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


function App() {

  const Layout = () => {
    return (
      <div className='h-full flex justify-center items-center'>
        <Routes>
          <Route exact path='/' element={<Login/>}/>
          <Route exact path='/register' element={<Register/>}/>
        </Routes>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="h-screen">
        {/* <Navbar /> */}
        <Routes>
          <Route exact path='*' element={<Layout />}/>
          <Route exact path='/home' element={<Home/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
