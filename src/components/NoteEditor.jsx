import React, { useRef, useEffect, useState } from 'react';

const NoteEditor = ({ content, setContent, onDelete }) => {
  const editorRef = useRef(null);
  const isFirstRender = useRef(true);
  
  // State to track which styles are active
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  useEffect(() => {
    if (isFirstRender.current && editorRef.current) {
      editorRef.current.innerHTML = content;
      isFirstRender.current = false;
    }
  }, [content]);

  // Function to check and update active styles based on cursor position
  const updateActiveStyles = () => {
    setActiveStyles({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    });
  };

  const format = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
    updateActiveStyles(); // Update immediately after clicking
  };

  return (
    <div className="note-workspace">
      <div className="editor-toolbar">
        <div className="format-group">
          <button 
            className={activeStyles.bold ? 'active' : ''} 
            onClick={() => format('bold')}
          >
            B
          </button>
          <button 
            className={activeStyles.italic ? 'active' : ''} 
            onClick={() => format('italic')}
          >
            I
          </button>
          <button 
            className={activeStyles.underline ? 'active' : ''} 
            onClick={() => format('underline')}
          >
            U
          </button>
        </div>
        <button className="delete-action" onClick={onDelete}>
          Delete Note
        </button>
      </div>
      
      <div
        className="document-editor"
        contentEditable
        ref={editorRef}
        onInput={() => setContent(editorRef.current.innerHTML)}
        onKeyUp={updateActiveStyles}    // Check state when typing/moving cursor
        onMouseUp={updateActiveStyles}  // Check state when clicking
        placeholder="Start writing your thoughts..."
      />
    </div>
  );
};

export default NoteEditor;