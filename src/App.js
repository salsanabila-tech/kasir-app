// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import TransactionPage from './pages/TransactionPage';
import TransactionHistory from './pages/TransactionHistory';
import Login from './auth/login';
import Register from './auth/register';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transaksi" element={<TransactionPage />} />
        <Route path="/riwayat" element={<TransactionHistory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
