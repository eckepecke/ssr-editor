// AuthForm.js
import React from 'react';

const AuthForm = ({ email, password, setEmail, setPassword, onSubmit, buttonText }) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    onSubmit(e); // Pass the event to onSubmit
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <input type="submit" value={buttonText} />
    </form>
  );
};

export default AuthForm;