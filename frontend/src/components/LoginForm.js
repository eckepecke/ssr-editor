import React, { useState } from 'react';
import AuthForm from './AuthForm';

const SERVER_URL = process.env.REACT_APP_BACKEND_BASE_URL;


const LoginForm = ({ onLoginSuccess, onTryingToRegister, successMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingText, setLoadingText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setErrorMessage('')
        setLoadingText('Trying to login..');   
        const response = await fetch(`${SERVER_URL}/auth/login`, {
            method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      setLoadingText('');   

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <AuthForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={handleSubmit}
        buttonText="Login"
      />

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loadingText && <p>{loadingText}</p>}

      <button onClick={onTryingToRegister}>Register here</button>

    </div>
  );
};

export default LoginForm;

