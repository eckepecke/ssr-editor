import React, { useState } from 'react';

/**
 * Document Component
 * Represents a single document with edit functionality.
 */
const Document = ({ document, onEdit, onUpdateAccess}) => {
    console.log('hej');

  /**
   * Initiates the editing process for the document.
   */
  const handleEdit = () => {
    onEdit(document);
  };

  const handleAddUser = () => {
    onUpdateAccess(document);
  };

  return (
    <>
        <li>
        <strong>{document.title}</strong>{document.content}
        <div>
        <button onClick={handleAddUser} style={{ marginLeft: '10px' }}>
            Edit Access
            </button>
            <button onClick={handleEdit} style={{ marginLeft: '10px' }}>
            Edit
            </button>
        </div>
        </li>

    </>
  );
};

export default Document;
