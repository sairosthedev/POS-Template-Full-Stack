import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ProductsManagement from './modules/products/ProductsPage';
import Reports from './modules/reports/ReportsPage';
import InventoryManagement from './modules/inventory/InventoryPage';
import StoreManagement from './modules/stores/StoresPage';
import PeopleManagement from './modules/users/UsersPage';
import ExpensesManagement from './modules/expenses/ExpensesPage';
import SystemSettings from './modules/settings/SettingsPage';
import Support from './modules/support/SupportPage';
import Login from './modules/auth/Login';
import Signup from './modules/auth/Signup';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return null;

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <DashboardLayout onLogout={handleLogout} user={user}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/products" element={<ProductsManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/stores" element={<StoreManagement />} />
          <Route path="/people" element={<PeopleManagement />} />
          <Route path="/expenses" element={<ExpensesManagement />} />
          <Route path="/support" element={<Support />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
