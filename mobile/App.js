import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import Login from './src/modules/auth/Login';
import PosHome from './src/modules/pos/PosHome';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {!user ? (
        <Login onLoginSuccess={handleLogin} />
      ) : (
        <PosHome user={user} token={token} onLogout={handleLogout} />
      )}
    </>
  );
}
