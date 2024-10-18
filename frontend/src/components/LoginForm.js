import React, { useState } from 'react';
import AuthForm from './AuthForm';


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

      // Send login data to the server using fetch (or axios)
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      setLoadingText('');   

      // If login is successful
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful wihoo:', data);

        // Call the function passed as prop to set the login state in App component
        onLoginSuccess();
      } else {
        const errorData = await response.json(); // Assuming the server sends back error details
        setErrorMessage(errorData.message || 'Login failed. Please try again.');        console.error('Login failed');
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

