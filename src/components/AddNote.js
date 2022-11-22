import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext.js";

const AddNote = (props) => {
  const [note, setNote] = useState({ title: "", desc: "", tag: "" });

  const handleClick = (e) => {
    e.preventDefault(); // prevents reloading of screen on 'clicking' on the button
    addNote(note.title, note.desc, note.tag);
    props.showAlert("Note Added Successfully", "success");
    setNote({ title: "", desc: "", tag: "" });
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const context = useContext(noteContext);
  const { addNote } = context;
  return (
    <div className="container my-3">
      <h1 style={{textAlign:"center"}}>Add a Note</h1>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="title">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            aria-describedby="emailHelp"
            onChange={onChange}
            name="title"
            value={note.title}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="desc"
            name="desc"
            rows="3"
            onChange={onChange}
            value={note.desc}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            onChange={onChange}
            value={note.tag}
            name="tag"
          />
        </div>
        <button
          disabled={note.title.length < 5 || note.desc.length < 5}
          type="submit"
          className="btn btn-primary"
          onClick={handleClick}
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
