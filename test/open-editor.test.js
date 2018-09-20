/* eslint-env node, jest */
'use strict';
const openEditor = require('../lib/prompts/open-editor');

const {
  __setInput,
  __setError,
  __setCleanupError,
  __resetErrors,
  ExternalEditor,
  CreateFileError,
  ReadFileError,
  RemoveFileError,
  LaunchEditorError
} = require('external-editor');

var editor = new ExternalEditor();

const console = global.console;

afterEach(() => {
  ExternalEditor.mockClear();
  editor.cleanup.mockClear();
  editor.run.mockClear();
  __resetErrors();
  global.console = console;
});

test('Should load', () => {
  expect(typeof openEditor).toBe('function');
});

test('Should return user input', () => {
  __setInput('Hello World!');
  expect(openEditor()).toBe('Hello World!');
});

test('Should pass existing content to editor', () => {
  __setInput(' Additional Content');
  openEditor('Initial Content');
  expect(ExternalEditor.mock.calls[0][0]).toBe('Initial Content');
});

test('Should throw an error when external-editor can\'t create file', () => {
  __setError(new CreateFileError());
  expect(() => openEditor()).toThrow('Failed to create the temporary file');
});

test('Should throw an error when external-editor can\'t read the file', () => {
  __setError(new ReadFileError());
  expect(() => openEditor()).toThrow('Failed to read the temporary file');
});

test('Should throw an error when external-editor can\'t open the editor', () => {
  __setError(new LaunchEditorError());
  expect(() => openEditor()).toThrow('Failed to launch your editor');
});

test('Should throw any other errors from editor.run()', () => {
  __setError(new Error('Test Error'));
  expect(() => openEditor()).toThrow('Test Error');
});

test('Should attempt to cleanup after an error', () => {
  __setError(new ReadFileError());

  try {
    openEditor();
  } catch (err) {
    expect(editor.cleanup).toHaveBeenCalledTimes(1);
  }
});

test('Should display an error if the temporary file cannot be deleted.', () => {
  const logMock = jest.fn();

  Object.defineProperty(global.console, 'log', {
    value: logMock
  });

  __setCleanupError(new RemoveFileError());

  openEditor();

  expect(logMock).toBeCalledWith('Failed to remove the temporary file');
});

test('Should throw other errors from editor.cleanup', () => {
  __setCleanupError(new Error('Test Error'));
  expect(() => openEditor()).toThrow('Test Error');
});
