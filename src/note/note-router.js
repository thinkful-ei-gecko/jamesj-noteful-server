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
  });

module.exports = noteRouter;