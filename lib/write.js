'use strict';

const db = require('./db');
const editor = require('./editor');
const makeId = require('./makeid');

function write(name, options = {}) {
  // Check if the document exists
  return db.get(name)
    .catch((err) => {
      if (err.name === 'not_found') {
        // Return an object containing a new _id.
        return {
          _id: makeId()
        };
      } else {
        throw err;
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
          name: name,
          content: content
        });

        // Attempt to save to the database
        return db.put(newNote);
      });
    }).catch((err) => {
      console.error(err);
    });
}

module.exports = write;
