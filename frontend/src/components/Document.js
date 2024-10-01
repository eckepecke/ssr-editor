import React from 'react';

/**
 * Document Component
 * Represents a single document with edit functionality.
 */
const Document = ({ document, onEdit }) => {
  /**
   * Initiates the editing process for the document.
   */
  const handleEdit = () => {
    onEdit(document);
  };

  return (
    <li>
      <strong>{document.title}</strong>{document.content}
      <div>
        <button onClick={handleEdit} style={{ marginLeft: '10px' }}>
          Edit
        </button>
      </div>
    </li>
  );
};

export default Document;
