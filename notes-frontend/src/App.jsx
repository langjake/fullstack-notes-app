import "./App.css";
import { useEffect } from "react";
import {useState} from "react";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/notes"
        );
        //troubleshooting
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Fetched data:", data);
        setNotes(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchNotes();
  }, [notes]);


    const handleCancel = () => {
      setTitle("");
      setContent("");
      setSelectedNote(null);
    };

    const handleUpdateNote = (event) => {
      event.preventDefault();
    
      if (!selectedNote) {
        return;
      }
  
      const updatedNote = {
        id: selectedNote.id,
        title: title,
        content: content,
      };
    
      const updatedNotesList = notes.map((note) => (note.id === selectedNote.id ? updatedNote : note));
    
      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    };


    const handleNoteClick = (note) => {
      setSelectedNote(note);
      setTitle(note.title);
      setContent(note.content);
    };
    const handleAddNote = async (event) => {
      event.preventDefault();
      try {
        const response = await fetch(
          "http://localhost:4000/api/notes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content,
            }),
          }
        );
  
        const newNote = await response.json();
  
        setNotes([newNote, ...notes]);
        setTitle("");
        setContent("");
      } catch (e) {
        console.log(e);
      }
    };
  
  
    const deleteNote = async (
      event,
      noteId
    ) => {
      event.stopPropagation();
  
      try {
        await fetch(
          `http://localhost:4000/api/notes/${noteId}`,
          {
            method: "DELETE",
          }
        );
        const updatedNotes = notes.filter(
          (note) => note.id !== noteId
        );
  
        setNotes(updatedNotes);
      } catch (e) {
        console.log(e);
      }
    };
  
    return (
      <div className="app-container">
        <form 
        onSubmit={(event) => (selectedNote ? handleUpdateNote(event) : handleAddNote(event))}
        className="note-form">
          <input 
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title" 
          required />

          <textarea 
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Content" 
          rows={10} 
          required />

          {selectedNote ? (   //if note is selected, display edit buttons
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
          ) 
          : ( //if note is not selected, create note buttons
          <button type="submit">Add Note</button>
        )}
        </form>



        <div className="notes-grid">
          {notes.map((note) => (
            <div className="note-item" key={note.id} onClick={() => handleNoteClick(note)}>
              <div className="notes-header">
                <button onClick={(event) => deleteNote(event, note.id)}>x</button>
              </div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default App;