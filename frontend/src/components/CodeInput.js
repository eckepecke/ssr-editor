import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/theme/dracula.css';

const CodeInput = ({ setCodeContent }) => {
    const editorRef = useRef(null);
    // const [code, setCode] = useState('');
    const [editorInstance, setEditorInstance] = useState(null);


    const handleExecute = async (e) => {
        console.log("executing!!")
        e.preventDefault();
        console.log(editorInstance);

        if (editorInstance) {
            const currentCode = editorInstance.getValue();
            console.log(currentCode)
            let data = {
                code: btoa(currentCode) // encode code in base64
            }

            fetch("https://execjs.emilfolino.se/code", {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            })
            .then(function (response) {
                return response.json();
            })
            .then(function(result) {
                let decodedOutput = atob(result.data);
                console.log(decodedOutput);
            });
        }
    } 

    useEffect(() => {
        if (editorRef.current && !editorInstance) {
            const cmInstance = CodeMirror(editorRef.current, {
                mode: 'javascript',
                lineNumbers: true,
                theme: 'dracula',
            });
            setEditorInstance(cmInstance);

            // Listen to changes and update the content in the parent component
            cmInstance.on('change', () => {
                const updatedCode = cmInstance.getValue();
                if (setCodeContent) {
                    setCodeContent(updatedCode); // Only call if setCodeContent is defined
                } else {
                    console.error("setCodeContent is not defined");
                }
            });
        }
    }, [editorInstance, setCodeContent]);
  
    return (
    <>
        <div id="editor" ref={editorRef}></div>
        <button onClick={handleExecute}>Execute</button>
    </>

    );
  };
  
  export default CodeInput;