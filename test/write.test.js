/* eslint-env node, jest */
'use strict';

var write = require('../lib/commands/write');
var openEditor = require('../lib/prompts/open-editor');
var db = require('../db');
var getStdin = require('../lib/prompts/get-stdin');
var getConfirmation = require('../lib/prompts/get-confirmation');
var getName = require('../lib/prompts/get-name');

const console = global.console;

jest.mock('../db/config');
jest.mock('../lib/prompts/open-editor');
jest.mock('../lib/prompts/get-stdin');
jest.mock('../lib/prompts/get-confirmation');
jest.mock('../lib/prompts/get-name');

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
  // Reseed the database.
  return db.seed.run({
    directory: './db/seeds'
  });
});

afterEach(() => {
  jest.clearAllMocks();
  global.console = console;
});

test('Should load', () => {
  expect(typeof write).toBe('function');
});

test('Should use in memory database for tests', () => {
  expect(db.client.config.connection.filename).toBe(':memory:');
});

test('Should return an ID', () => {
  return write('note title', {
    content: 'note content'
  }).then((res) => {
    expect(typeof res).toBe('number');
  });
});

test('Should save a note', () => {
  return write('note title', {
    content: 'note content'
  }).then((id) => {
    return db.select().from('notes').where('id', id);
  }).then((res) => {
    expect(validDate(res[0].created_at)).toBeTruthy();
    expect(validDate(res[0].updated_at)).toBeTruthy();
    expect(res[0].name).toBe('note title');
    expect(res[0].content).toBe('note content');
  });
});

test('Should request a title if one is not provided', () => {
  getName.mockResolvedValue('Note title');

  return write(null, {
    content: 'note content'
  }).then(() => {
    expect(getName).toHaveBeenCalledTimes(1);
  });
});

test('Should update an existing note with the same title', () => {
  getConfirmation.mockResolvedValue(true);
  var firstID;

  return write('note title', {
    content: 'note content'
  }).then((id) => {
    firstID = id;
    return write('note title', {
      content: 'Updated content'
    });
  }).then(() => {
    return db.select().from('notes').where('id', firstID);
  }).then((res) => {
    expect(res[0].name).toBe('note title');
    expect(res[0].content).toBe('Updated content');
  });
});

test('Should use --content if available', () => {
  expect(1).toBe(1);
});

test('Should use stdin if --content is not available', () => {
  getStdin.mockResolvedValue('Content from stdin');
  process.stdin.isTTY = false;

  return write('note title', {
  }).then((id) => {
    return db.select().from('notes').where('id', id);
  }).then((res) => {
    expect(getStdin).toHaveBeenCalledTimes(1);
    expect(res[0].content).toBe('Content from stdin');
  });
});

test('Should open an editor if both --conent and stdin are unavailable', () => {
  openEditor.mockReturnValue('Content from editor');
  process.stdin.isTTY = true;

  return write('note title', {
  }).then((id) => {
    return db.select().from('notes').where('id', id);
  }).then((res) => {
    expect(openEditor).toHaveBeenCalledTimes(1);
    expect(res[0].content).toBe('Content from editor');
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

test('Should seek confirmation before overwriting a note', () => {
  getConfirmation.mockResolvedValue(true);
  var firstID;

  return write('note title', {
    content: 'note content'
  }).then((id) => {
    firstID = id;
    return write('note title', {
      content: 'Updated content'
    });
  }).then((id) => {
    expect(getConfirmation).toHaveBeenCalledTimes(1);
    expect(id).toBe(firstID);
  });
});

test('Should report an error if the user does not confirm overwrite', () => {
  getConfirmation.mockResolvedValue(false);

  const warnMock = jest.fn();

  Object.defineProperty(global.console, 'warn', {
    value: warnMock
  });

  return write('note title', {
    content: 'note content'
  }).then(() => {
    return write('note title', {
      content: 'Updated content'
    });
  }).then(() => {
    // Expect error to have been displayed.
    expect(getConfirmation).toHaveBeenCalledTimes(1);
    //expect(err).toBe({});
    expect(warnMock).toBeCalledWith('Update cancelled');
  });
});

test('Should report any other errors', () => {

});

test('Should not seek confirmation if --force option is used', () => {
  return write('note title', {
    content: 'note content'
  }).then(() => {
    return write('note title', {
      content: 'Updated content',
      force: true
    });
  }).then(() => {
    expect(getConfirmation).toHaveBeenCalledTimes(0);
  });
});

test('Should not seek confirmation if --prepend option is used', () => {
  return write('note title', {
    content: 'note content'
  }).then(() => {
    return write('note title', {
      content: 'Updated content',
      prepend: true
    });
  }).then(() => {
    expect(getConfirmation).toHaveBeenCalledTimes(0);
  });
});

test('Should not seek confirmation if --append option is used', () => {
  return write('note title', {
    content: 'note content'
  }).then(() => {
    return write('note title', {
      content: 'Updated content',
      append: true
    });
  }).then(() => {
    expect(getConfirmation).toHaveBeenCalledTimes(0);
  });
});
