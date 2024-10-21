import React, { useState } from 'react';
import CodeInput from './CodeInput';


/**
 * AddDocument Component
 * Renders a form to add a new document.
 */
const AddDocument = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false)
  console.log('AddDocument rendered, isCodeMode:', isCodeMode);


  /**
   * Generates a unique ID for the new document.
   */
  const generateUniqueID = () => {
    return Date.now();
  };

  /**
   * Handles form submission to add a new document.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newId = generateUniqueID();

    const response = await fetch('/post/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newId, title, content }),
    });

    const data = await response.json();

    if (response.ok) {
      setTitle('');
      setContent('');
      onAdd({ id: newId, title, content, created_at: new Date().toISOString() });
    }
  };

  return (
    <>
    {isCodeMode ? (
        <>
        <CodeInput />
        <button onClick={() => setIsCodeMode(false)}>
            Exit Code Mode
        </button>
        </>

    ) : (
    <>
        <form onSubmit={handleSubmit}>
        <h2>Add Document</h2>
        <div>
          <label htmlFor="documentTitle">Title:</label>
          <input
            type="text"
            id="documentTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter document title..."
          />
        </div>
        <div>
          <label htmlFor="documentContent">Content:</label>
          <textarea
            id="documentContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Enter document content..."
          />
        </div>
        <button type="submit">Add Document</button>

        </form>
        <button onClick={() => setIsCodeMode(true)}>
            Activate Code Mode
        </button>
    </>

    )}

    </>

  );
};

export default AddDocument;
