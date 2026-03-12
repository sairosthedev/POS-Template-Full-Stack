import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import PosScreen from './src/screens/PosScreen';

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
      <StatusBar barStyle="dark-content" />
      {!user ? (
        <LoginScreen onLoginSuccess={handleLogin} />
      ) : (
        <PosScreen user={user} token={token} onLogout={handleLogout} />
      )}
    </>
  );
}
