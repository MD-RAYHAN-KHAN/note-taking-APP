import React from "react";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'


const NoteTakingApp = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    //update usestate 
    const [editableNote, setEditableNote] = useState({});
    const [editnode, setEditMode] = useState(false);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    //create notehandeler
    const handleAddNote = (event) => {
        event.preventDefault()
        if (title.trim() !== '' || description.trim() !== '') {
            const newNote = {
                id: Date.now() + '',//int convert to string
                title: title,
                description: description,
                isComplete: false
            };
            // setNotes([...notes,newNote]);
            fetch(`http://localhost:3000/noteList`, {
                method: "post",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(newNote)//this line use to conver javascript to jason formate
            }
            )
                .then(() => {
                    getNote()
                })
            // Clear the input fields after adding the note
            setTitle('');
            setDescription('');
        }
        else {
            alert("please filup input fild..")
            return; // Don't add empty notes
        }


    };
    //delete handeler cerate provide id(thsi id is Date.now())
    const deletehandler = (noteId) => {
        // const newNote = notes.filter(item => item.id !== noteId);
        // setNotes(newNote);
        fetch(`http://localhost:3000/noteList/${noteId}`, {
            method: "DELETE",
        })
            .then(() => {
                getNote()
            })
    };

    // edit handeler create
    const edithandler = (noteId) => {
        const toBeEditableNote = notes.find(item => item.id === noteId);
        setEditMode(true);
        setEditableNote(toBeEditableNote);
        setTitle(toBeEditableNote.title);
        setDescription(toBeEditableNote.description);
    };

    // update handeler create

    const updatehandler = (event) => {
        event.preventDefault();
        if (!editableNote) {
            // Handle the case when editableNote is null or undefined.
            return;
        }
        const toBeUpdateableNote = {
            id: editableNote.id,
            title: title,
            description: description,
            isComplete: editnode.isComplete
        }

        fetch(`http://localhost:3000/noteList/${editableNote.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(toBeUpdateableNote)
        })
            .then(() => {
                getNote();
                setEditableNote(null);
                setEditMode(false);
                setTitle('');
                setDescription('');
            });

    };

    //get data from local api
    const getNote = () => {
        fetch('http://localhost:3000/noteList')
            .then(res => res.json())
            .then(note => setNotes(note))
    }
    useEffect(() => {
        getNote();
    })


    return (
        <div className="container">
            <div className="bg-info">
                <h2 className="center text-white pb-2">Note Taking App</h2>
            </div>
            {/* <form action="" onSubmit={(event) => {
                editnode ? updatehandler(event) : handleAddNote(event);
            }}> */}

            <form action="">
                <div className="d-flex">
                    <div className="col-4">
                        <div className="ms-2 fs-5">
                            <label>Title:</label>
                        </div>
                        <div>
                            <input
                                className="form-outline"
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-6 ms-lg-3">
                        <div className="ms-2 fs-5">
                            <label>Description:</label>
                        </div>
                        <div>
                            <textarea
                                className="form-outline"
                                value={description}
                                onChange={handleDescriptionChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-2 ms-lg-3">
                        <div className="text-white fs-5">ADD</div>
                        <button onClick={(event) => {
                            editnode ? updatehandler(event) : handleAddNote(event);
                        }} className="mt-lg-1"> {editnode ? "Update Note" : "ADD Note"}</button>
                    </div>
                </div>
            </form>
            <div>
                <div className="d-flex mt-4 bg-info">
                    <h5 className="text-white p-1 col-4">NoeteTitle</h5>
                    <h5 className="text-white p-1  col-6">Description</h5>
                    <h5 className="text-white col-3 p-1">Update</h5>
                </div>
                {notes.map((note, index) => (
                    <div key={index} className="d-flex border p-2">
                        <div className="col-4 ps-2 ">
                            <p className="fw-bold">{note.title}</p>
                        </div>
                        <div className="col-6 ps-2 text-justify pe-4">
                            <p>{note.description}</p>
                        </div>
                        <div className="d-flex justify-content-between col-2">
                            <div>
                                <button onClick={() => edithandler(note.id)}> <span className="px-2">Edit</span></button>
                            </div>
                            <div>
                                <button onClick={() => deletehandler(note.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoteTakingApp;
