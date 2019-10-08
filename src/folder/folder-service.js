const FolderService = {
  getFolders: (db) => {
    return db('folder')
      .select('*');
  },
  getFolderByID: (db, id) => {
    return db('folder')
      .select('*')
      .where({ id })
      .first();
  },
  addFolder: (db, data) => {
    return db('folder')
      .insert(data)
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  updateFolder: (db, id, data) => {
    return db('folder')
      .where({ id })
      .update(data);
  },
  deleteFolder: (db, id) => {
    return db('folder')
      .where({ id })
      .delete();
  }

};

module.exports = FolderService;