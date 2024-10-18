import React, { useState } from 'react';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login data to the server using fetch (or axios)
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

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
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          placeholder="E-mail"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />

        <input type="submit" value="Login user" />
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default LoginForm;

