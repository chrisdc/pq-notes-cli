'use strict';

const db = require('../db');
const editor = require('./editor');
const inquirer = require('inquirer');

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

  return new Promise((resolve, reject) => {
    // Get the name
    if (name) {
      toSave.name = name;
      return resolve(name);
    } else {
      return inquirer
        .prompt([{
          name: 'name',
          message: 'Enter a title:'
        }]).then(answer => {
          toSave.name = answer.name;
          return answer.name;
        });
    }
  }).then((name) => {
    // Does the note already exist?
    return db.select('name', 'content')
      .from('notes')
      .where('name', name)
      .then((result) => {
        return result.length > 0 ? result[0] : { name: name, content: '' };
      });
  }).then((note) => {
    var content = '';

    return Promise.resolve().then(() => {
      if (typeof options.content === 'string') {
        return _merge(note.content, options.content, options);
      } else if (!process.stdin.isTTY) {
        return new Promise((resolve) => {
          // Get content from stdin.
          process.stdin.on('readable', () => {
            const chunk = process.stdin.read();
            if (chunk !== null) {
              content = content + chunk;
            }
          });

          process.stdin.on('end', () => {
            return resolve(_merge(note.content, content, options));
          });
        });
      } else {
        // Open an editor to get user input. May throw an error.
        return editor(note.content);
      }
    }).then((content) => {
      return Object.assign(note, {
        content: content
      });
    });
  }).then((note) => {
    if (note.id) {
      // merge and update
      return db('notes')
        .where('id', note.id)()
        .update(note);
    } else {
      // insert
      return db('notes')
        .insert(note);
    }
  });
}

module.exports = write;
