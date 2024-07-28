// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Home from './components/Home';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <Login show={showLogin} onClose={handleCloseLogin} />
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
