/* eslint-env node, jest */
'use strict';

var write = require('../lib/write');
var setup = require('../scripts/setup-db');
//var { db, resetDB } = require('../storage');
var db = require('../db');
jest.mock('../db');


beforeAll(() => {
  //return setup();
});


beforeEach(() => {
  return setup();
});

afterEach(() => {
  return db.erase();
  //db.destroy();
  //jest.resetModules();
  //return storage.resetDB();
});

test('Should load', () => {
  expect(typeof write).toBe('function');
});

test('Should use in memory database for tests', () => {
  db.info().then((result) => {
    expect(result.adapter).toBe('memory');
  });
});

test('Should save a note', () => {
  return write('note title', {
    content: 'note content'
  }).then((res) => {
    expect(res.ok).toBe(true);
  });
});

test('Should save the correct data', () => {
  return write('note title', {
    content: 'note content'
  }).then((res) => {
    return db.get(res.id);
  }).then((res) => {
    expect(res.name).toBe('note title');
    expect(res.content).toBe('note content');
  });
});

test('Should save the correct data2', () => {
  return write('note title', {
    content: 'note content'
  }).then((res) => {
    return db.get(res.id);
  }).then((res) => {
    expect(res.name).toBe('note title');
    expect(res.content).toBe('note content');
  });
});

/*
test('Should save the correct contents', () => {
  return write('note title', {
    content: 'note content'
  }).then(() => {
    return db.query('name_index', {
      key: 'note title',
      include_docs : true
    });
  }).then((res) => {
    expect(res.rows[0].doc.name).toBe('note title');
  });
});
*/
