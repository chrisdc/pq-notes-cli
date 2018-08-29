'use strict';

const nanoid = require('nanoid');

function makeId() {
  const now = process.hrtime();
  return '' + now[0] +  now[1] + nanoid(10);
}

module.exports = makeId;
