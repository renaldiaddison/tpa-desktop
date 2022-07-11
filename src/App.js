import { app } from "./firebase-config";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";
import Register from "./components/Register";
import WorkspacePage from "./pages/WorkspacePage";
import { Routes, Route } from "react-router-dom";
import BoardPage from "./pages/BoardPage";
import { ToastContainer } from "react-toastify";
import AcceptInvite from "./pages/AcceptInvite";
import { UserAuthContextProvider } from "./Script/AuthContext";
import AcceptInviteBoard from "./pages/AcceptInviteBoard";
import ListWorkspace from "./pages/Public";
import ListBoard from "./pages/ClosedBoard";
import CardPage from "./pages/CardPage";
import FavoriteBoard from "./pages/FavoriteBoard";
import Shortcut from "./components/Shortcut";

function App() {
  const Layout = () => {
    return (
      <div className="h-full flex justify-center items-center">
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  };

  return (
    <div className="h-screen">
      <ToastContainer></ToastContainer>
      <UserAuthContextProvider>
        <Shortcut>
          <Routes>
            <Route exact path="*" element={<Layout />} />
            <Route
              exact
              path="/home/workspace/:id"
              element={<WorkspacePage />}
            ></Route>
            <Route exact path="/home/board/:id" element={<BoardPage />}></Route>
            <Route
              exact
              path="/invite-link/:id"
              element={<AcceptInvite />}
            ></Route>
            <Route
              exact
              path="/invite-link-board/:id"
              element={<AcceptInviteBoard />}
            ></Route>
            <Route exact path="/home" element={<HomePage />} />
            <Route exact path="/public" element={<ListWorkspace />} />
            <Route exact path="/closedBoards" element={<ListBoard />} />
            <Route exact path="/favoriteBoard" element={<FavoriteBoard />} />

            <Route exact path="/card/:bId/:id/" element={<CardPage />}></Route>
          </Routes>
        </Shortcut>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
