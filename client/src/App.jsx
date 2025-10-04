import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Loader } from "lucide-react";
import { connectSocket, disconnectSocket } from "./lib/socket";
import { getUser, setOnlineUsers } from './Store/slices/authSlice';
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from './pages/Home';
import Profile from './pages/Profile';

const App = () => {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    console.log("Fetching User");
  }, [dispatch]);

  useEffect(() => {
    if (authUser?._id) {
      const socket = connectSocket(authUser._id);

      if (socket)
        socket.on("getOnlineUsers", (users) => {
          dispatch(setOnlineUsers(users));
        });

      return () => disconnectSocket();
    }
  }, [authUser, dispatch]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center mt-12 h-screen">
        <Loader className="size-10 mt-12 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
};

export default App;
