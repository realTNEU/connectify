import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Signup from "./pages/signup"
import Login from './pages/Login'
import "./tailwind.css";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<Room />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/Login' element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
