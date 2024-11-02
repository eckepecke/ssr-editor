import React, { useState } from 'react';

const SERVER_URL = process.env.REACT_APP_BACKEND_BASE_URL;

/**
 * AddUser Component
 * Renders a form to edit an existing document.
 */
const AddUser = ({ document, onUpdate, onClose, onUpdateSuccess }) => {
    const [newUser, setNewUser] = useState('');
    const [loadingText, setLoadingText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');



  /**
   * Handles form submission to update the document.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('')
    setLoadingText('Updating access..'); 
    
    try {
      const response = await fetch(`${SERVER_URL}/post/update/access`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
                newUser,
                id: document.id,
                title: document.title
              })
          });

      setLoadingText('');


      if (response.ok) {
        const data = await response.json();

        onUpdate(newUser);
        onUpdateSuccess(`User ${newUser} can now edit the document.`)
        onClose();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Login failed. Please try again.');        console.error('Login failed');
      }

    } catch (error) {
        console.error('An error occurred during login:', error);
      }


  };


  return (
    <div className="edit-form-overlay">
      <form onSubmit={handleSubmit} className="edit-form">
        <h2>Add user email</h2>
        {loadingText && <p>{loadingText}</p>}
        <div>
          <label htmlFor="addNewUser">User Email:</label>
          <input
            type="text"
            id="addNewUser"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add User</button>
        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddUser;