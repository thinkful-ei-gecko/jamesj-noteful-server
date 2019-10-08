const FolderService = {
  getFolders: (db) => {
    db('folder')
      .select('*');
  },
  getFolderByID: (db, id) => {
    db('folder')
      .select('*')
      .where({ id })
      .first();
  },
  addFolder: (db, data) => {
    db('folder')
      .insert(data)
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  updateFolder: (db, id, data) => {
    db('folder')
      .where({ id })
      .update(data);
  },
  deleteFolder: (db, id) => {
    db('folder')
      .where({ id })
      .delete();
  }

};

module.exports = FolderService;