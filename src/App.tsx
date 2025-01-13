import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ShopDetail from './pages/ShopDetail';
import Search from './pages/Search';
import CreateShop from './pages/CreateShop';
import Auth from './pages/Auth';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-amber-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/create-shop" element={<CreateShop />} />
            <Route path="/shop/:id" element={<ShopDetail />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
