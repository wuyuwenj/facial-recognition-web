import React from 'react';
import logo from './logo.svg';
import './App.css';
import OpenCVComponent from './components/OpenCVComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebcamComponent from './components/WebcamComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OpenCVComponent />} />
        <Route path="/webcam" element={<WebcamComponent />} />
      </Routes>
    </Router>
  );
}


export default App;
