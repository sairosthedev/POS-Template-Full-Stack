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

const roleLower = (u) => String(u?.role || '').toLowerCase();
const RequireRole = ({ user, allow, children }) => {
  const r = roleLower(user);
  if (!r) return <Navigate to="/login" replace />;
  if (Array.isArray(allow) && allow.length > 0 && !allow.includes(r)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

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

  // Cashiers should not access the back-office dashboard.
  if (roleLower(user) === 'cashier') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
          <Route
            path="/"
            element={
              <RequireRole user={user} allow={['admin', 'manager']}>
                <DashboardHome />
              </RequireRole>
            }
          />
          <Route
            path="/reports"
            element={
              <RequireRole user={user} allow={['admin', 'manager']}>
                <Reports />
              </RequireRole>
            }
          />
          <Route
            path="/products"
            element={
              <RequireRole user={user} allow={['admin', 'manager']}>
                <ProductsManagement />
              </RequireRole>
            }
          />
          <Route
            path="/inventory"
            element={
              <RequireRole user={user} allow={['admin', 'manager']}>
                <InventoryManagement />
              </RequireRole>
            }
          />
          <Route
            path="/stores"
            element={
              <RequireRole user={user} allow={['admin']}>
                <StoreManagement />
              </RequireRole>
            }
          />
          <Route
            path="/people"
            element={
              <RequireRole user={user} allow={['admin', 'manager']}>
                <PeopleManagement />
              </RequireRole>
            }
          />
          <Route
            path="/expenses"
            element={
              <RequireRole user={user} allow={['admin', 'manager']}>
                <ExpensesManagement />
              </RequireRole>
            }
          />
          <Route
            path="/support"
            element={
              <RequireRole user={user} allow={['admin', 'manager']}>
                <Support />
              </RequireRole>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireRole user={user} allow={['admin']}>
                <SystemSettings />
              </RequireRole>
            }
          />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
