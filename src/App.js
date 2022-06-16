import { app } from './firebase-config';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddWorkSpace from './components/AddWorkspace';


function App() {

  const Layout = () => {
    return (
      <div className='h-full flex justify-center items-center'>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
        </Routes>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="h-screen">
        <Routes>
          <Route exact path='*' element={<Layout />} />
          <Route exact path='/home' element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
    // <AddWorkSpace />
  )
}

export default App;
