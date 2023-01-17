const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const { findById, findByIdAndUpdate } = require("../models/Note");

//Router 1:  get all note using using :GET "/api/auth/createUser" No login required dosent require auth
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occured");
  }
});

//Router 2:  Add a new note using using :POST "/api/notes/addnote" login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 charcters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
     //if there are errors return bad request
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

    try {
      const { title, description, tag } = req.body;
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      return res.json(savedNote);
    } catch (error) {
      return res.status(500).send("Internal error occured");
    }
  }
);


//Router 3:  Update a note using :PUT "/api/notes/addnote" login required
router.put( "/updatenote/:id",fetchuser,  async (req, res) => {

        const {title,description,tag}=req.body;

        try {
            //create newNote object
        const newNote={};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};

        //Find the note to be updated and update it
        let note =await Note.findById(req.params.id);
        if(!note){ return res.status(404).send("Not found")}
        
        //note.user.toString gives id of this note
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note =await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
        res.json({note});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal error occured");
        }
        
    })


//Router 4:  Delete a note using :PUT "/api/notes/deletenote" login required
router.delete( "/deletenote/:id",fetchuser,  async (req, res) => {        
        try {
             //Find the note to be deleted and delete it
        let note =await Note.findById(req.params.id);
        if(!note){ return res.status(404).send("Not found")}
        
        //Allow deletion only if user owns this Note
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note =await Note.findByIdAndDelete(req.params.id)
        res.json({"sucess": "Note has been deleted",note: note});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal error occured");
        }
       
    })

module.exports = router;
