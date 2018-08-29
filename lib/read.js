'use strict';

const db = require('./db');

function read(names) {
  db.allDocs().then(results => {
    console.log(results);
  });
}

module.exports = read;

