'use strict';

const db = require('../../db');
const merge = require('../merge');
const openEditor = require('../prompts/open-editor');
const getName = require('../prompts/get-name');
const getStdin = require('../prompts/get-stdin');
const getConfirmation = require('../prompts/get-confirmation');

function write(name, options = {}) {
  var toSave = {};

  return new Promise((resolve) => {
    // 1. Get the note title.
    if (name) {
      resolve(name);
    } else {
      // Ask the user for a name.
      return getName();
    }
  }).then((name) => {
    // 2. Check if the note already exists.
    return db.select('id', 'name', 'content')
      .from('notes').where('name', name)
      .then((result) => {
        return result.length > 0 ? result[0] : { name: name, content: '' };
      });
  }).then((note) => {
    // 3. Get the new (or edited) content.
    toSave = note;

    if (typeof options.content === 'string') {
      // Get content from options.
      return merge(note.content, options.content, options);
    } else if (!process.stdin.isTTY) {
      // Get content from stdin.
      return getStdin().then((res) => {
        return merge(note.content, res, options);
      });
    } else {
      // Get content from editor.
      return openEditor(note.content);
    }
  }).then((content) => {
    // 4. Save the note.
    toSave.content = content;

    if (toSave.id) {
      return Promise.resolve().then(() => {
        if (!options.prepend && !options.append && !options.force) {
          // Seek confirmation before overwriting the note.
          return getConfirmation('Are you sure want to overwrite \'' + toSave.name + '\'');
        } else {
          return 'confirmed';
        }
      }).then((confirmed) => {
        if (confirmed) {
          return db('notes')
            .where('id', toSave.id)
            .update({
              content: toSave.content,
              updated_at: db.fn.now()
            }).then(() => {
              return toSave.id;
            });
        } else {
          console.log('Cancelled');
        }
      });
    } else {
      // insert
      return db('notes')
        .insert(toSave)
        .then((res) => {
          return res[0];
        });
    }
  }).catch((err) => {
    console.log(err);
  });
}

module.exports = write;
