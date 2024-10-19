import React, { useEffect, useState } from 'react';
import AddDocument from './AddDocument';
import EditDocument from './EditDocument';
import Document from './Document';
import AddUser from './AddUser';


/**
 * Documents Component
 * Fetches and displays a list of documents. Integrates add and edit functionalities.
 */
const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [editingDocument, setEditingDocument] = useState(null);
  const [editingAccess, setEditingAccess] = useState(null);
  const [loadingText, setLoadingText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Fetches documents from the backend API.
   */
  const fetchDocuments = async () => {
    setLoadingText('Retrieving documents..')
    const response = await fetch('/get/all');
    const data = await response.json();
    setDocuments(data.data);
    setLoadingText('')
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  /**
   * Handles adding a new document.
   * @param {Object} newDoc - The newly added document.
   */
  const handleAddDocument = (newDoc) => {
    setDocuments([...documents, newDoc]);
  };

  /**
   * Handles updating an existing document.
   * @param {number} id - The ID of the updated document.
   * @param {Object} updatedFields - The updated fields of the document.
   */
  const handleUpdateDocument = (id, updatedFields) => {
    const updatedDocuments = documents.map(doc =>
      doc.id === id ? { ...doc, ...updatedFields } : doc
    );
    setDocuments(updatedDocuments);
  };

  /**
   * Initiates the editing process for a document.
   * @param {Object} doc - The document to be edited.
   */
  const handleEditClick = (doc) => {
    setEditingDocument(doc);
  };

  /**
   * Closes the edit form.
   */
  const closeEditForm = () => {
    setEditingDocument(null);
  };

    /**
   * Initiates the editing process for a add user form.
   * @param {Object} doc - The document to be edited.
   */
    const handleUpdateAccess = (doc) => {
        setEditingAccess(doc);
      };

    const handleUpdateSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 5000);
      };

      /**
   * Closes the edit form.
   */
  const closeAccessForm = () => {
    setEditingAccess(null);
  };

  return (
    <div>
      <h2>Documents</h2>
      <AddDocument onAdd={handleAddDocument} />
      {editingDocument && (
        <EditDocument
          document={editingDocument}
          onUpdate={handleUpdateDocument}
          onClose={closeEditForm}
        />
      )}
      {editingAccess && (
        <AddUser
          document={editingAccess}
          onUpdate={handleUpdateAccess}
          onUpdateSuccess={handleUpdateSuccess}
          onClose={closeAccessForm}
        />
      )}
      {loadingText && <p>{loadingText}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {documents.length === 0 ? (
        <p>No documents available.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
          <Document key={doc.id} 
          document={doc} 
          onEdit={handleEditClick} 
          onUpdateAccess={handleUpdateAccess} />
            ))}
        </ul>
      )}
    </div>
  );
};

export default Documents;
