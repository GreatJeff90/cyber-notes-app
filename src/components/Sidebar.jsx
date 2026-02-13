import React from 'react';

const Sidebar = ({ notes, activeNoteId, setActiveNoteId, addNote, deleteNote }) => {
  
  const getTitle = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent.trim();
    return text.substring(0, 25) || "Untitled Note";
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <span className="logo">N</span>
          <h2>Notes.io</h2>
        </div>
        <button className="btn-add" onClick={addNote} title="New Note">+</button>
      </div>
      
      <nav className="note-list-sidebar">
        {notes.map(note => (
          <div 
            key={note.id} 
            className={`sidebar-item ${activeNoteId === note.id ? 'active' : ''}`}
            onClick={() => setActiveNoteId(note.id)}
          >
            <div className="sidebar-item-content">
              <div className="item-title">{getTitle(note.body)}</div>
              <div className="item-date">{new Date(note.id).toLocaleDateString()}</div>
            </div>
            
            <button 
              className="sidebar-delete-btn" 
              onClick={(e) => {
                e.stopPropagation(); // Prevents selecting the note while deleting it
                deleteNote(note.id);
              }}
              title="Delete Note"
            >
              &times;
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;