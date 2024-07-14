import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const { setCustomUser } = useAuth();
  const navigate = useNavigate();

  const fixedUsername = 'Muhammad Abrar';
  const fixedPassword = 'M.Abrar101';

  async function handleSubmit(e) {
    e.preventDefault();

    const enteredUsername = usernameRef.current.value;
    const enteredPassword = passwordRef.current.value;

    try {
      setLoading(true);

      if (enteredUsername === fixedUsername && enteredPassword === fixedPassword) {
        setCustomUser({ username: enteredUsername });
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      toast.error('Failed to log in: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Log In</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            ref={usernameRef}
            placeholder="Enter your username"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            ref={passwordRef}
            placeholder="Enter your password"
            required
          />
        </Form.Group>
        <Button
          disabled={loading}
          className="w-100 mt-3"
          type="submit"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default Login;
