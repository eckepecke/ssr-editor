import React, { useState, useEffect } from 'react';
import CodeInput from './CodeInput';

const SERVER_URL = process.env.REACT_APP_BACKEND_BASE_URL;

/**
 * EditDocument Component
 * Renders a form to edit an existing document.
 */
const EditDocument = ({ document, onUpdate, onClose, onContentChange, currentContent }) => {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [isCodeMode, setIsCodeMode] = useState(document.is_code || false);

  useEffect(() => {
    if (currentContent !== content) {
      setContent(currentContent);
    }
  }, [currentContent]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
  };

  const handleCodeContentChange = (newContent) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  /**
   * Handles form submission to update the document.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${SERVER_URL}/post/update/${document.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: document.id, title, content }),
    });

    onUpdate(document.id, { title, content });
    onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Edit Document</h2>
        <div>
          <label htmlFor="editTitle">Title:</label>
          <input
            type="text"
            id="editTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        {isCodeMode ? (
          <>
            <CodeInput setCodeContent={handleCodeContentChange} initialCode={content} />
            <button type="button" onClick={() => setIsCodeMode(false)}>
              Exit Code Mode
            </button>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="editContent">Content:</label>
              <textarea
                id="editContent"
                value={content}
                onChange={handleContentChange}
                required
              ></textarea>
            </div>
            <button type="button" onClick={() => setIsCodeMode(true)}>
              Enter Code Mode
            </button>
          </>
        )}
        <button type="submit">Update Document</button>
        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
    </>
  );
};

export default EditDocument;
