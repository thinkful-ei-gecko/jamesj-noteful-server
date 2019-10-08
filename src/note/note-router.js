const express = require('express');
const xss = require('xss');
const path = require('path');
const NoteService = require('./note-service');

const noteRouter = express.Router();

const sanitizeNote = note => ({
  name: xss(note.name),
  description: xss(note.description),
  date_added: note.date_added,
  folder_id: note.folder_id
});

noteRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    NoteService.getNotes(db)
      .then(notes => res.status(200).json(notes.map(note => sanitizeNote(note))))
      .catch(next);
  })
  .post((req, res, next) => {
    const db = req.app.get('db');
    const { name, description, date_added, folder_id } = req.body;
    const newNote = { name, description };

    if(!name || !description || !folder_id) {
      return res.status(400).json({error: {message: 'Invalid data - name, description, and folder id are required'}});
    }

    sanitizeNote(newNote);
    newNote.date_added = date_added;
    newNote.folder_id = folder_id;

    NoteService.addNote(db, newNote)
      .then(note => {
        return res.status(201).location(path.posix.join(req.originalUrl, `/${note.id}`)).json(sanitizeNote(note));
      })
      .catch(next);
  });

noteRouter
  .route('/:note_id')
  .all((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.note_id;

    NoteService.getNoteByID(db, id)
      .then(note => {
        if(!note) {
          return res.status(400).json({error: {message: 'Note does not exist'}});
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => res.status(200).json(sanitizeNote(res.note)))
  .patch((req, res, next) => {

  });

module.exports = noteRouter;