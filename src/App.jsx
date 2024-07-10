import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AIProfiler from './components/AIProfiler';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/report/:prolificID" element={<AIProfiler />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;