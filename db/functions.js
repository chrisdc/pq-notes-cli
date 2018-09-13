'use strict';

const db = require('.');

function getNote(name) {
  return db.select('id', 'name', 'content')
    .from('notes').where('name', name)
    .then((result) => {
      return result.length > 0 ? result[0] : { name: name, content: '' };
    });
}

function upsertNote(note) {
  if (note.id) {
    return db('notes')
      .where('id', note.id)
      .update({
        content: note.content,
        updated_at: db.fn.now()
      }).then(() => {
        return note.id;
      });
  } else {
    return db('notes')
      .insert(note)
      .then((res) => {
        return res[0];
      });
  }
}

module.exports = {
  getNote: getNote,
  upsertNote: upsertNote
};
