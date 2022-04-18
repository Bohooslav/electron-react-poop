import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import PoopField from './pages/PoopField';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/index.html" element={<Menu />} />
        <Route path="/poop-field" element={<PoopField />} />
      </Routes>
    </Router>
  );
}

export default App;
