import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import CartAlternate from './pages/CartAlternate';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route 
          path="/cart" 
          element={<CartAlternate onNavigate={(path) => window.location.href = path} />} 
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;