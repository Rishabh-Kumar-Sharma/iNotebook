import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import About from './components/About';
import Home from './components/Home';
import NoteState from './context/notes/NoteState';

function App() {
  return (
    <>
    <NoteState>
      <Router>
        <Navbar/>
        <Routes>
        <Route exact path="/about" element={<About />}></Route>
        <Route exact path="/home" element={<Home />}></Route>
        <Route exact path="/" element={<Home />}></Route>
        </Routes>
      </Router>
      </NoteState>
    </>
  );
}

export default App;
