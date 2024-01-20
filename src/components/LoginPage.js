// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post(
        'http://localhost:8080/user/login',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      
      await fetchUserData();
      
      login(userData);
      
      // Redirect to the AddBookForm page upon successful login
      navigate('/add-book');

    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    } 
};

const fetchUserData = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/user/findByUsername/${username}`
    );

    setUserData(response.data);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

  if (username) {
  fetchUserData();
}

  const handleCreateAccount = () => {
    navigate('/create-account');
  };


  return (
    <div className={styles.LoginPage}>
      <h2>Login</h2>
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleCreateAccount}>Create Account</button>
      <a href='/home'>Continue without an account</a>
    </div>
  );
};

export default LoginPage;
