const express = require('express');
const xss = require('xss');
const FolderService = require('./folder-service');
const path = require('path');

const folderRouter = express.Router();

folderRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    FolderService.getFolders(db)
      .then(folders => res.status(200).json(folders));
  });
