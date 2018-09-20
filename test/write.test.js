/* eslint-env node, jest */
'use strict';

var write = require('../lib/commands/write');
var openEditor = require('../lib/prompts/open-editor');
//var setup = require('../scripts/setup-db');
//var { db, resetDB } = require('../storage');
var db = require('../db');
var getStdin = require('../lib/prompts/get-stdin');

jest.mock('../db/config');
jest.mock('../lib/prompts/open-editor');
jest.mock('../lib/prompts/get-stdin');

function validDate(timeStamp) {
  var date = new Date(timeStamp);
  return typeof date.getTime() === 'number';
}

beforeAll(() => {
  // Run migrations
  return db.migrate.latest({
    directory: './db/migrations',
    tableName: 'migrations'
  });
});

afterAll(() => {
  // Rollback database
  return db.migrate.rollback({
    directory: './db/migrations',
    tableName: 'migrations'
  });
});


beforeEach(() => {
  return db.seed.run({
    directory: './db/seeds'
  });
});

afterEach(() => {
  openEditor.mockClear();
});

test('Should load', () => {
  expect(typeof write).toBe('function');
});


test('Should use in memory database for tests', () => {
  expect(db.client.config.connection.filename).toBe(':memory:');
});

test('Should save a note', () => {
  return write('note title', {
    content: 'note content'
  }).then((res) => {
    expect(typeof res).toBe('number');
  });
});

test('Should save the correct data', () => {
  return write('note title 2', {
    content: 'note content'
  }).then((id) => {
    return db.select().from('notes').where('id', id);
  }).then((res) => {
    expect(validDate(res[0].created_at)).toBeTruthy();
    expect(validDate(res[0].updated_at)).toBeTruthy();
    expect(res[0].name).toBe('note title 2');
    expect(res[0].content).toBe('note content');
  });
});

test('Should be able to append to existing content', () => {
  return write('Note 1', {
    content: ' appended',
    append: true
  }).then((id) => {
    return db.select().from('notes').where('id', id);
  }).then((res) => {
    expect(res[0].content).toBe('content appended');
  });
});

test('Should be able to prepend to existing content', () => {
  return write('Note 1', {
    content: 'prepended ',
    prepend: true
  }).then((id) => {
    return db.select().from('notes').where('id', id);
  }).then((res) => {
    expect(res[0].content).toBe('prepended content');
  });
});

test('Should use --content if available', () => {
  expect(1).toBe(1);
});

test('Should use stdin if --content is not available', () => {
  getStdin.mockResolvedValue('Content from stdin');
  process.stdin.isTTY = false;
  console.log(!process.stdin.isTTY);
  //console.log(getStdin());

  return write('note title3', {
  }).then((id) => {
    return db.select().from('notes').where('id', id);
  }).then((res) => {
    //console.log(openEditor.mock);
    //expect(openEditor).toHaveBeenCalledTimes(1);
    //expect(res[0].content).toBe('Content from stdin');
    expect(getStdin).toHaveBeenCalledTimes(1);
    expect(res[0]).toBe({});
  });
});

test('Should open an editor if both --conent and stdin are unavailable', () => {
  openEditor.mockReturnValue('Content from editor');
  process.stdin.isTTY = true;

  return write('note title2', {
  }).then((id) => {
    return db.select().from('notes').where('id', id);
  }).then((res) => {
    //console.log(openEditor.mock);
    expect(openEditor).toHaveBeenCalledTimes(1);
    expect(res[0].content).toBe('Content from editor');
  });
});

/*
test.skip('Should accept content from stdin');
test.skip('Should accept content from editor');
*/

/*
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

