import { app } from './firebase-config';
import Login from './components/Login';
import Home from './pages/Home';
import Register from './components/Register';
import WorkspacePage from './pages/WorkspacePage';
import { Routes, Route } from 'react-router-dom';
import BoardPage from './pages/BoardPage';
import { ToastContainer } from 'react-toastify';
import AcceptInvite from './pages/AcceptInvite';
import { UserAuthContextProvider } from './Script/AuthContext';


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
      <ToastContainer limit={1}></ToastContainer>
      <UserAuthContextProvider>

      <Routes>
        <Route exact path='*' element={<Layout />} />
        <Route exact path='/home/workspace/:id' element={<WorkspacePage />}></Route>
        <Route exact path='/home/board/:id' element={<BoardPage />}></Route>
        <Route exact path='/invite-link/:id' element={<AcceptInvite/>}></Route>
        <Route exact path='/home' element={<Home />} />
      </Routes>
      </UserAuthContextProvider>
    </div>
  )
}

export default App;
