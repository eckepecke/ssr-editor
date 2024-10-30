// AuthForm.js
import React from 'react';

const AuthForm = ({ email, password, setEmail, setPassword, onSubmit, buttonText }) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    onSubmit(e); // Pass the event to onSubmit
  };

  return (
    <form class="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="email">E-mail:</label>
      <input
        type="email"
        id="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />


     <button type="submit">{buttonText}</button>
    </form>
  );
};

export default AuthForm;