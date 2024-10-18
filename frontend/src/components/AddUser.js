import React, { useState } from 'react';

/**
 * AddUser Component
 * Renders a form to edit an existing document.
 */
const AddUser = ({ document, onUpdate, onClose }) => {
    const [newUser, setNewUser] = useState('');

  /**
   * Handles form submission to update the document.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`/post/update/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUser, id: document.id
         })
      });

      onUpdate(newUser);
      onClose();
  };


  return (
    <div className="edit-form-overlay">
      <form onSubmit={handleSubmit} className="edit-form">
        <h2>Add user email</h2>
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