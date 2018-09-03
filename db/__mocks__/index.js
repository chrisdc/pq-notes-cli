'use strict';

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-memory'));
PouchDB.plugin(require('pouchdb-erase'));
var db = new PouchDB('notes', {adapter: 'memory'});
db.on('error', () => {
  debugger;
});
module.exports = db;


/*
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-memory'));

class DBWrapper {
  constructor() {
    this.db = new PouchDB('notes', {adapter: 'memory'});
  }

  resetDB() {
    return this.db.destroy().then(() => {
      return this.db = new PouchDB('notes', {adapter: 'memory'});
    });
  }
}

module.exports = new DBWrapper();
*/
