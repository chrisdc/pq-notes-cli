'use strict';

const PouchDB = require('pouchdb');
var db = new PouchDB('notes');

module.exports = db;
