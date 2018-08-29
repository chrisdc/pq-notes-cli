'use strict';
const { edit } = require('external-editor');

var content;

try {
  content = edit();
} catch (err) {
  console.log(err);
}

//var content = edit();
console.log(content);
