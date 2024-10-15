import React from 'react';
import './App.css';
import Documents from './components/Documents';
import LoginForm from './components/LoginForm';

/**
 * App Component
 * Serves as the main component managing the frontend application.
 */

const [isLoggedIn, setIsLoggedIn] = useState(false);

const handleLogin = (username, password) => {
  // Here, you would usually validate the credentials with your backend
  // For demonstration, we'll just log them and set the logged-in state to true
  console.log('Logging in with:', username, password);
  setIsLoggedIn(false); // Simulate successful login
};

const App = () => {
  return (
    <div className="App">
      <div className="container">
      {isLoggedIn ? (
          <Documents />
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
        </div>
    </div>
  );
};

export default App;
