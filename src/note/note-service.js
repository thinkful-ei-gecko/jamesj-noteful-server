const NoteService = {
  getNotes: (db) => {
    return db('note')
      .select('*');
  },
  getNoteByID: (db, id) => {
    return db('note')
      .select('*')
      .where({ id })
      .first();
  },
  addNote: (db, data) => {
    return db('note')
      .insert(data)
      .returning('*')
      .then(res => {
        return res[0];
      });
  },
  updateNote: (db, id, data) => {
    return db('note')
      .update(data)
      .where({ id });
  },
  deleteNote: (db, id) => {
    return db('note')
      .delete()
      .where({ id });
  }
};

module.exports = NoteService;