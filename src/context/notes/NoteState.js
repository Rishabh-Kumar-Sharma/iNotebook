import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Fetch all note
  const getNotes = async (token) => {
    // API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    const json=await response.json();
    // console.log(json);
    setNotes(json);
  }

    // Add a note
    const addNote = async (title, description, tag) => {
      // API Call
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, description, tag })
      });
      const note=await response.json();
      setNotes(notes.concat(note));
    };

    // Delete a note
    const deleteNote = async (id) => {
      // API Call
      const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            localStorage.getItem('token'),
        },
      });
      const json=await response.json();
      console.log(json);

      const newNotes = notes.filter((note) => {
        return note._id !== id;
      });
      setNotes(newNotes);
    };
    // Edit(Update) a note

    const editNote = async (id, title, description, tag) => { // Note:- 'id' is a unique property of each and every 'note'
      // API Call
      const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            localStorage.getItem('token'),
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ title, description, tag }) //A common use of JSON is to exchange data to/from a web server
                                                          // When sending data to a web server, the data has to be a string
      });
      const json = await response.json();
      console.log(json);

      let newNotes=JSON.parse(JSON.stringify(notes));   // When receiving data from a web server, the data is always a string.
                                                        // Parse the data with JSON.parse(), and the data becomes a JavaScript object.

      // Motive behind the above line(newNotes=JSON.parse(...)) is that we want React to render the page as soon as there is a change in
      // the data but if we do it like :- newNotes=notes, React won't understand it and so will not render the page on any change in the data

      // console.log(newNotes); 

      // Logic to edit in client
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        // console.log(element);
        if (element._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }
      setNotes(newNotes);
    };
    return (
      <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote,getNotes }}>
        {props.children}
      </NoteContext.Provider>
    );
  };
export default NoteState;
