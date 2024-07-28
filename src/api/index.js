// src/api/index.js
export const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        return data;
      } else {
        throw new Error('Token not received');
      }
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Invalid credentials');
    }
  };
  