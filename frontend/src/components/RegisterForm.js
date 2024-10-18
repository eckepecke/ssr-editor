import React, { useState } from 'react';
import AuthForm from './AuthForm';


const RegisterForm = ({ onRegisterSuccess, onAlreadyHaveAccount }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const [loadingText, setLoadingText] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        setErrorMessage('');
        setLoadingText('Trying to register..');   

        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        setLoadingText('');   

        if (response.ok) {
          const data = await response.json();
          console.log('Registration successful:', data);
  
          onRegisterSuccess(data.data.message);
        } else {
          const errorData = await response.json();
          console.log(errorData.errors.detail);
          setErrorMessage(errorData.errors.detail || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('An error occurred during registration:', error);
      }
    };
  
    return (
      <div>
        <h2>Register</h2>
        <AuthForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onSubmit={handleSubmit}
            buttonText="Register"
        />

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {loadingText && <p>{loadingText}</p>}

        <button onClick={onAlreadyHaveAccount}>
          Login here
        </button>
      </div>
    );
  };
  
  export default RegisterForm;
  