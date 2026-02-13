import React, { useState, useEffect } from 'react';
import './index.css';
import { useNotesDB } from './hooks/useNotesDB';
import NoteEditor from './components/NoteEditor';
import Sidebar from './components/Sidebar';

function App() {
  const { notes, saveNote, removeNote, loading } = useNotesDB();
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set first note as active once DB loads
  useEffect(() => {
    if (!loading && notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, [loading, notes, activeNoteId]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const addNote = () => {
    const newNote = { id: Date.now(), body: '' };
    saveNote(newNote);
    setActiveNoteId(newNote.id);
    setIsSidebarOpen(false);
  };

  const updateNote = (id, newBody) => {
    const updatedNote = { id, body: newBody };
    saveNote(updatedNote);
  };

  const deleteNote = (id) => {
    removeNote(id);
    if (activeNoteId === id) {
      const nextNote = notes.find(n => n.id !== id);
      setActiveNoteId(nextNote ? nextNote.id : null);
    }
  };

  if (loading) return <div className="loading-screen">Loading your workspace...</div>;

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <Sidebar 
        notes={notes}
        activeNoteId={activeNoteId}
        setActiveNoteId={(id) => { setActiveNoteId(id); setIsSidebarOpen(false); }}
        addNote={addNote}
        deleteNote={deleteNote}
      />

      <main className="main-content">
        {activeNote ? (
          <NoteEditor 
            key={activeNote.id}
            content={activeNote.body}
            setContent={(content) => updateNote(activeNote.id, content)}
            onDelete={() => deleteNote(activeNote.id)}
          />
        ) : (
          <div className="empty-state">
            <p>Your workspace is empty.</p>
            <button className="btn-primary" onClick={addNote}>Create First Note</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;