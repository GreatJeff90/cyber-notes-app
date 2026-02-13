import { useState, useEffect } from 'react';

const DB_NAME = 'NotesDB';
const STORE_NAME = 'notes';

export const useNotesDB = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize DB
  useEffect(() => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAll = store.getAll();

      getAll.onsuccess = () => {
        setNotes(getAll.result.sort((a, b) => b.id - a.id));
        setLoading(false);
      };
    };
  }, []);

  const saveNote = (note) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(note);
      
      setNotes(prev => {
        const exists = prev.find(n => n.id === note.id);
        if (exists) return prev.map(n => n.id === note.id ? note : n);
        return [note, ...prev];
      });
    };
  };

  const removeNote = (id) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    };
  };

  return { notes, saveNote, removeNote, loading };
};