import React, { useEffect, useState } from 'react';
import AddDocument from './AddDocument';
import EditDocument from './EditDocument';
import Document from './Document';

/**
 * Documents Component
 * Fetches and displays a list of documents. Integrates add and edit functionalities.
 */
const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [editingDocument, setEditingDocument] = useState(null);

  /**
   * Fetches documents from the backend API.
   */
  const fetchDocuments = async () => {
    const response = await fetch('/get/all');
    const data = await response.json();
    setDocuments(data.data);
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
      {documents.length === 0 ? (
        <p>No documents available.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <Document key={doc.id} document={doc} onEdit={handleEditClick} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Documents;
