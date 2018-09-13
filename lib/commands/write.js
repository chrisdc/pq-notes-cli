'use strict';

//const db = require('../../db');
const db = require('../../db/functions');
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
      return getName();
    }
  }).then((name) => {
    // 2. Check if the note already exists.
    return db.getNote(name);
  }).then((note) => {
    // 3. Get the new (or edited) content.
    toSave = note;

    if (typeof options.content === 'string') {
      // Use --content
      return merge(note.content, options.content, options);
    } else if (!process.stdin.isTTY) {
      // Use stdin.
      return getStdin().then((res) => {
        return merge(note.content, res, options);
      });
    } else {
      // Use editor
      return openEditor(note.content);
    }
  }).then((content) => {
    // 4. Seek confirmation before overwriting the note. (if applicable).
    toSave.content = content;

    if (
      toSave.id &&
      !options.prepend &&
      !options.append &&
      !options.force
    ) {
      return getConfirmation(
        'Are you sure want to overwrite \'' + toSave.name + '\''
      ).then((confirmed) => {
        if (!confirmed) {
          return new Error('Cancelled');
        }
      });
    } else {
      return true;
    }
  }).then(() => {
    // 5. Upsert the note.
    return db.upsertNote(toSave);
  }).catch((err) => {
    console.log(err);
  });
}

module.exports = write;
