import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import PoopField from './pages/PoopField';
import LeaderBoard from './pages/LeaderBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/poop-field" element={<PoopField />} />
        <Route path="/leader-board" element={<LeaderBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
