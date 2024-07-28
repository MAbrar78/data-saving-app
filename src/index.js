// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Create a root
const root = createRoot(rootElement);

// Render the application
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
