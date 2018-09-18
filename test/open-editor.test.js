/* eslint-env node, jest */
'use strict';
const openEditor = require('../lib/prompts/open-editor');

const {
  __setInput,
  __setError,
  __setCleanupError,
  __reset, __get,
  ExternalEditor,
  CreateFileError,
  ReadFileError,
  RemoveFileError,
  LaunchEditorError
} = require('external-editor');

var editor = new ExternalEditor();
/*
global.console = {
  warn: jest.fn(),
  log: jest.fn()
};*/

const console = global.console;

afterEach(() => {
  ExternalEditor.mockClear();
  editor.cleanup.mockReset();
  __reset();
  //editor.run.mockReset();
});

afterAll(() => {
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

test('Should return an error when external-editor can\'t create file', () => {
  __setError(new CreateFileError());
  expect(() => openEditor()).toThrow('Failed to create the temporary file');
});

test('Should return an error when external-editor can\'t read the file', () => {
  __setError(new ReadFileError());
  expect(() => openEditor()).toThrow('Failed to read the temporary file');
});

test('Should return an error when external-editor can\'t open the editor', () => {
  __setError(new LaunchEditorError());
  expect(() => openEditor()).toThrow('Failed to launch your editor');
});

test('Should attempt to cleanup after an error', () => {
  __setError(new CreateFileError());

  try {
    openEditor();
  } catch (err) {
    //expect(editor.cleanup.mock.calls.length).toBe(1);
    expect(editor.cleanup).toHaveBeenCalledTimes(1);
  }
});

test('Should report a failure to cleanup', () => {
  /*const logMock = jest.fn();
  global.console = () => ({
    log: logMock
  });*/

  __setCleanupError(new Error('gg'));
  //openEditor();
  console.log(editor.cleanup.mock);
  //expect(1).toBe(1);

  expect(() => openEditor()).toThrow();


  //openEditor();

  //expect(editor.cleanup).toHaveBeenCalledTimes(1);
  //expect(logMock).toBeCalled();


  //expect(() => openEditor()).toThrow('Failed to remove the temporary file');
  //console['log'] = jest.fn();
  //expect(console.log).toHaveBeenCalledWith('Failed to remove the temporary file');
});
