import React from 'react';
import './App.css';
import Documents from './components/Documents';

/**
 * App Component
 * Serves as the main component managing the frontend application.
 */
const App = () => {
  return (
    <div className="App">
      <div className="container">
        <Documents />
      </div>
    </div>
  );
};

export default App;