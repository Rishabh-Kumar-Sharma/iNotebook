const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE_1: Get all the notes using: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchUser, async(req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE_2: Adds all the notes using: POST "/api/notes/addnote". Login required
router.post(
    "/addnote",
    fetchUser, [
        body("title", "Enter a valid title").isLength({ min: 3 }),
        body("description", "Description must be of atleast 5 characters").isLength({ min: 5 }),
    ],
    async(req, res) => {
        try {
            const { title, description, tag } = req.body;

            const errors = validationResult(req);
            // if there's any error, handle it with 'Bad Response(status code: 400)'
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Notes({
                title,
                description,
                tag,
                user: req.user.id,
            });
            const savedNote = await note.save();
            res.json(savedNote);
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

// ROUTE_3: Updates the note using: PUT "/api/notes/updatenotes". Login required
router.put("/updatenotes/:id", fetchUser, async(req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a new note object 
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found!");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed!");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE_4: Deletes the note using: DELETE "/api/notes/deletenotes". Login required
router.delete("/deletenotes/:id", fetchUser, async(req, res) => {
    try {
        // find the note to be deleted
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found!");
        }
        // allow deletion if the user is authenticate
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed!");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "success": "Notes has been deleted", note: note });
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;