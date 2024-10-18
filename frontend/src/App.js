import React, { useState } from "react";
import './App.css';
import Documents from './components/Documents';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

/**
 * App Component
 * Serves as the main component managing the frontend application.
 */
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);


  return (
    <div className="App">
      <div className="container">
        {isLoggedIn ? (
          <Documents />
        ) : (
            isRegistering ? (
              <RegisterForm 
                onRegisterSuccess={() => setIsRegistering(false)}
                onAlreadyHaveAccount={() => setIsRegistering(false)}
              />
            ) : (
              <LoginForm
                onLoginSuccess={() => setIsLoggedIn(true)}
                onTryingToRegister={() => setIsRegistering(true)}
              />
            )
          )}
      </div>
    </div>
  );
};

export default App;