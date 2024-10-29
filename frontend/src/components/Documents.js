import React, { useEffect, useState } from 'react';
import AddDocument from './AddDocument';
import EditDocument from './EditDocument';
import Document from './Document';
import AddUser from './AddUser';
import { initializeSocket, sendDocumentUpdate, disconnectSocket } from './SocketClient';

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
  const [currentDocumentContent, setCurrentDocumentContent] = useState('');
  const [roomId, setRoomId] = useState(null);

  const SERVER_URL = process.env.REACT_APP_BACKEND_BASE_URL;

  /**
   * Fetches documents from the backend API.
   */
  const fetchDocuments = async () => {
    setLoadingText('Retrieving documents..')
    const response = await fetch(`${SERVER_URL}/get/all`);
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
   * Initiates the editing process for a document and sets up the socket connection.
   * @param {Object} doc - The document to be edited.
   */
  const handleEditClick = (doc) => {
    setEditingDocument(doc);
    setRoomId(doc.id); // Set roomId for socket connection
    setCurrentDocumentContent(doc.content); // Set the initial content for the editor

    // Initialize socket connection for the selected document room
    initializeSocket(SERVER_URL, doc.id, setCurrentDocumentContent);
  };

  /**
   * Handles sending updates to the socket when the document content is changed.
   * @param {string} newContent - The new content of the document.
   */
  const handleDocumentUpdate = (newContent) => {
    setCurrentDocumentContent(newContent); // Update content locally
    sendDocumentUpdate(roomId, newContent); // Send update to other clients via socket
  };

  /**
   * Closes the edit form and disconnects the socket.
   */
  const closeEditForm = () => {
    setEditingDocument(null);
    disconnectSocket(); // Disconnect the socket when the document is no longer being edited
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
          currentContent={currentDocumentContent}
          onContentChange={handleDocumentUpdate}
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
