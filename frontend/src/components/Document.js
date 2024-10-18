import React, { useState } from 'react';
import AddUser from './AddUser.js'

/**
 * Document Component
 * Represents a single document with edit functionality.
 */
const Document = ({ document, onEdit, onUpdate }) => {
    const [showAddUser, setShowAddUser] = useState(false);

  /**
   * Initiates the editing process for the document.
   */
  const handleEdit = () => {
    onEdit(document);
  };

  /**
   * Toggles the AddUser form visibility.
   */
  const addUser = () => {
        setShowAddUser(true);
    };

  const handleCloseAddUser = () => {
    setShowAddUser(false);
  };


  return (
    <li>
      <strong>{document.title}</strong>{document.content}
      <div>
      <button onClick={addUser} style={{ marginLeft: '10px' }}>
          Edit Access
        </button>
        <button onClick={handleEdit} style={{ marginLeft: '10px' }}>
          Edit
        </button>
      </div>
      {showAddUser && (
        <AddUser
          document={document}
          onUpdate={onUpdate}
          onClose={handleCloseAddUser}
        />
      )}
    </li>
  );
};

export default Document;
