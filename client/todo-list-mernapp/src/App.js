import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import HomePage from "./Components/Home/HomePage";
import NavBar from "./Components/NavBar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
