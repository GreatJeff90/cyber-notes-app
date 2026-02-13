import React, { useRef, useEffect, useState } from 'react';

const NoteEditor = ({ content, setContent, onDelete }) => {
  const editorRef = useRef(null);
  const isFirstRender = useRef(true);
  
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  // Load content once and focus the editor
  useEffect(() => {
    if (isFirstRender.current && editorRef.current) {
      editorRef.current.innerHTML = content;
      isFirstRender.current = false;
      
      // Professional touch: Auto-focus the end of the content
      editorRef.current.focus();
    }
  }, [content]);

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
    updateActiveStyles();
  };

  return (
    <div className="editor-wrapper">
      <div className="editor-toolbar">
        <div className="format-group">
          <button 
            type="button"
            className={activeStyles.bold ? 'active' : ''} 
            onClick={() => format('bold')}
            title="Bold"
          >
            B
          </button>
          <button 
            type="button"
            className={activeStyles.italic ? 'active' : ''} 
            onClick={() => format('italic')}
            title="Italic"
          >
            I
          </button>
          <button 
            type="button"
            className={activeStyles.underline ? 'active' : ''} 
            onClick={() => format('underline')}
            title="Underline"
          >
            U
          </button>
        </div>

        <button 
          type="button"
          className="delete-action" 
          onClick={onDelete}
        >
          Delete Note
        </button>
      </div>
      
      <div
        className="document-editor"
        contentEditable
        ref={editorRef}
        onInput={() => setContent(editorRef.current.innerHTML)}
        onKeyUp={updateActiveStyles}
        onMouseUp={updateActiveStyles}
        placeholder="Start writing your thoughts..."
        spellCheck="true"
      />
    </div>
  );
};

export default NoteEditor;