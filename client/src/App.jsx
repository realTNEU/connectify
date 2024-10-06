// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Room from './pages/Room';
import './tailwind.css'; // Import Tailwind CSS

function App() {
    return (
        <Router>
            <Header />
            <main className="container mx-auto px-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/room" element={<Room />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
