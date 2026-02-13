import React, { useState } from 'react';
import './index.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import NoteEditor from './components/NoteEditor';
import Sidebar from './components/Sidebar';

function App() {
  const [notes, setNotes] = useLocalStorage('group9-notes', [
    { id: Date.now(), body: 'Welcome to your dashboard!' }
  ]);
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle state

  const activeNote = notes.find(n => n.id === activeNoteId);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSelectNote = (id) => {
    setActiveNoteId(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const addNote = () => {
    const newNote = { id: Date.now(), body: '' };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsSidebarOpen(false);
  };

  const deleteNote = (id) => {
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (activeNoteId === id) {
      setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Menu Toggle Button */}
      <button className="mobile-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile to close sidebar when clicking outside */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      <Sidebar 
        notes={notes}
        activeNoteId={activeNoteId}
        setActiveNoteId={handleSelectNote}
        addNote={addNote}
        deleteNote={deleteNote}
      />

      <main className="main-content">
        {activeNote ? (
          <div className="editor-wrapper">
             <NoteEditor 
                key={activeNote.id}
                content={activeNote.body}
                setContent={(content) => updateNote(activeNote.id, content)}
                onDelete={() => deleteNote(activeNote.id)}
              />
          </div>
        ) : (
          <div className="empty-state">
            <p>No note selected</p>
            <button className="btn-primary" onClick={addNote}>Create New Note</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;