import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import EditNotePage from './pages/EditNotePage';
import AddNotePage from "./pages/AddNotePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<AddNotePage />} />
        <Route path="/edit/:id" element={<EditNotePage />} />
      </Routes>
    </Router>
  );
}

export default App;