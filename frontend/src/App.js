import React, { useState } from "react";
import './App.css';
import Documents from './components/Documents';
import LoginForm from './components/LoginForm';


/**
 * App Component
 * Serves as the main component managing the frontend application.
 */
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <div className="container">
        {isLoggedIn ? (
          <Documents />
        ) : (
          <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
      </div>
    </div>
  );
};

export default App;