const express = require('express');
const xss = require('xss');
const FolderService = require('./folder-service');
const path = require('path');

const folderRouter = express.Router();

const sanitizeFolder = folder => ({
  name: xss(folder.name)
});

folderRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    FolderService.getFolders(db)
      .then(folders => res.status(200).json(folders))
      .catch(error => next(error));
  })
  .post((req, res, next) => {
    const db = req.app.get('db');
    const { name } = req.body;
    const newFolder = { name };

    if(!name) {
      return res.status(400).json({error: {message: 'Invalid data - name is required'}});
    }

    FolderService.addFolder(db, newFolder)
      .then(affected => {
        return res.status(201).location(path.posix.join(req.originalUrl, `/${affected.id}`)).json(sanitizeFolder(newFolder));
      })
      .catch(error => next(error));
  });

folderRouter
  .route('/:folder_ID')
  .all((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.folder_ID;

    FolderService.getFolderByID(db, id)
      .then(folder => {
        if(!folder) {
          return res.status(400).json({error: {message: 'Invalid data - folder not found'}});
        }
        res.folder = folder;
        next();
      })
      .catch(error => next(error));
  })
  .get((req, res, next) => {
    return res.status(200).json(sanitizeFolder(res.folder));
  })
  .patch((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.folder_ID;
    const { name } = req.body;
    const updateData = { name };

    if(!name) {
      return res.status(400).json({error: {message: 'Invalid data - name is required'}});
    }
    FolderService.updateFolder(db, id, sanitizeFolder(updateData))
      .then(affected => {
        return res.status(204).end();
      })
      .catch(error => next(error));
  })
  .delete((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.folder_ID;

    FolderService.deleteFolder(db, id)
      .then(affected => res.status(204).end())
      .catch(next);
  });

module.exports = folderRouter;