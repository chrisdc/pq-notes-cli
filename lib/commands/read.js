'use strict';

const db = require('../../db/functions');
const { Readable } = require('stream');

class noteStream extends Readable {
  constructor(names, options) {
    super(options);
    this.names = Array.isArray(names) ? names : [names];
  }

  _read(size) {

  }
}

function read(names) {
  if (!Array.isArray(names)) {
    names = [names];
  }

  const noteStream = new Readable();

  for (var i = 0; i < names.length; i++) {
    // Get record
    db.getNote(names[i]).then((note) => {
      process.stdout.write(note.content);
    });
    // Print results
  }

  db.allDocs().then(results => {
    console.log(results);
  });
}

module.exports = read;

