'use strict';

var db = require('../db');
const editor = require('./editor');
const makeId = require('./makeid');

function write(name, options = {}) {
  // Check if the document exists
  return db.query('name_index', {
    key: name,
    include_docs : true
  }).then((result) => {
    if (result.total_rows === 0) {
      return {
        _id: makeId(),
        name: name
      };
    } else {
      return result.rows[0].doc;
    }
  }).then((note) => {
    return new Promise((resolve) => {
      var content = '';

      if (typeof options.content === 'string') {
        // Get content from --content
        return resolve(options.content);
      } else if (!process.stdin.isTTY) {
        // Get content from stdin.
        process.stdin.on('readable', () => {
          const chunk = process.stdin.read();
          if (chunk !== null) {
            content = content + chunk;
          }
        });

        process.stdin.on('end', () => {
          return resolve(content);
        });
      } else {
        // Open an editor to get user input. May throw an error.
        return resolve(editor());
      }
    }).then((content) => {
      const newNote = Object.assign(note, {
        content: content
      });

      // Attempt to save to the database
      return db.put(newNote);
    });
  });
}

module.exports = write;
