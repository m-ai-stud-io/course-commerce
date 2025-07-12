import './App.css';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { CartProvider } from './context/CartContext'; // Import CartProvider
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

function App() {
  return (
    <Router>
      <CartProvider> {/* Wrap MainLayout with CartProvider */}
        <MainLayout />
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </CartProvider>
    </Router>
  );
}

export default App;
