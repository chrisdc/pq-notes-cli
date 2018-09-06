'use strict';

const db = require('../../db');
const editor = require('../prompts/open-editor');
//const inquirer = require('inquirer');
const getName = require('../lib/prompts/get-name');

// Merge new and exsiting content according to options.
function _merge(existingContent, newContent, options) {
  var content;

  if (options.append) {
    content = existingContent + newContent;
  } else if (options.prepend) {
    content = newContent + existingContent;
  } else {
    content = options.content;
  }

  return content;
}

function write(name, options = {}) {
  var toSave = {};

  return Promise.resolve().then(() => {
    if (name) {
      return name;
    } else {
      // Ask the user for a name.
      return getName();
    }
  }).then((name) => {
    // Does the note already exist?
    return db.select('id', 'name', 'content')
      .from('notes')
      .where('name', name)
      .then((result) => {
        return result.length > 0 ? result[0] : { name: name, content: '' };
      });
  }).then((note) => {
    var content = '';
    toSave = note;

    if (typeof options.content === 'string') {
      return _merge(note.content, options.content, options);
    } else if (!process.stdin.isTTY) {
      return new Promise((resolve, reject) => {
        // Get content from stdin.
        process.stdin.on('readable', () => {
          const chunk = process.stdin.read();
          if (chunk !== null) {
            content = content + chunk;
          }
        });

        process.stdin.on('error', (err) => {
          reject(err);
        });

        process.stdin.on('end', () => {
          resolve(_merge(note.content, content, options));
        });
      });
    } else {
      // Open an editor to get user input. May throw an error.
      return editor(note.content);
    }
  }).then((content) => {
    toSave.content = content;

    if (toSave.id) {
      return Promise.resolve().then(() => {
        if (!options.prepend && !options.append && !options.force) {
          // Seek confirmation before overwriting the note.
          return confirm();
        } else {
          return;
        }
      }).then((res) => {
        // update
        return db('notes')
          .where('id', toSave.id)
          .update({
            content: toSave.content,
            updated_at: db.fn.now()
          }).then(() => {
            return toSave.id;
          });
      });
    } else {
      // insert
      return db('notes')
        .insert(toSave)
        .then((res) => {
          return res[0];
        });
    }
  });
}

module.exports = write;
