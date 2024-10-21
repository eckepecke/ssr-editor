import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/theme/dracula.css';

const CodeInput = () => {
    const editorRef = useRef(null);
  
    useEffect(() => {
      if (editorRef.current) {
        CodeMirror(editorRef.current, {
          mode: 'javascript',
          lineNumbers: true,
          theme: 'dracula',
        });
      }
    }, []);
  
    return (
    <>
        <div id="editor" ref={editorRef}></div>
        <button>Execute</button>
    </>

    );
  };
  
  export default CodeInput;