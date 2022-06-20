import { app } from './firebase-config';
import Login from './components/Login';
import Home from './pages/Home';
import Register from './components/Register';
import WorkspacePage from './pages/WorkspacePage';
import { Routes, Route } from 'react-router-dom';
import BoardPage from './pages/BoardPage';


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
    <div className="h-screen">
      <Routes>
        <Route exact path='*' element={<Layout />} />
        <Route exact path='/home/workspace/:id' element={<WorkspacePage />}></Route>
        <Route exact path='/home/board/:id' element={<BoardPage />}></Route>
        <Route exact path='/home' element={<Home />} />
      </Routes>
    </div>
  )
}

export default App;
