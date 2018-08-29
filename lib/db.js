'use strict';

const PouchDB = require('pouchdb');
var db = new PouchDB('notes');

db.changes({
  since: 'now'
}).on('change', function(change) {
  console.log(change);
});

module.exports = db;

/*
function createNote() {

}

function readNote() {

}

function updateNote() {

}

function deleteNote() {

}

module.exports = {
  createNote: createNote,
  readNote: readNote,
  updateNote: updateNote,
  deleteNote: deleteNote
};*/


/*db.info().then(function (info) {
  console.log(info);
})

var doc = {
  _id: ''
  name: ''
  content: '',
  tags: []
}*/
