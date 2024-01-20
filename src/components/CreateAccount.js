// CreateAccountPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './CreateAccountPage.module.css'

const CreateAccountPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    try {
      // Validate that all fields are completed
      if (!username || !email || !age || !password || !confirmPassword) {
        setErrorMessage('Please complete all fields.');
        return;
      }

      // Validate that the password and confirm password match
      if (password !== confirmPassword) {
        setErrorMessage('Password and Confirm Password do not match.');
        return;
      }

      // Clear any previous error messages
      setErrorMessage('');

      await axios.post(
        'http://localhost:8080/user/create',
        {
          username,
          email,
          age,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Redirect to the Login page upon successful account creation
      handleLogin();

    } catch (error) {
      console.error('Account creation failed:', error);
      alert('Account creation failed.This user already has an account');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className={styles.CreateAccountPage}>
    <form onSubmit={handleCreateAccount}>
      <h2>Create Account</h2>
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <label>Age:</label>
      <input
        type="number"
        min="0"
        max="140"  // Adjusted to allow values up to 140
        step="1"
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value, 10))}
        required
      />      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <label>Confirm Password:</label>
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <br />
      <button type="submit" >Create Account</button>
      
      <button onClick={handleLogin}>Back to login</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <a href='/home'>Continue without an account</a>
      </form>
    </div>
    
  );
};

export default CreateAccountPage;
