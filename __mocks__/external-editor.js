/* eslint-env node, jest */
'use strict';

const editorParent = jest.genMockFromModule('external-editor');
var userInput = '';
var err;
var cleanupErr;

function __setInput(input) {
  userInput = input;
}

function __setError(error) {
  err = error;
}

function __setCleanupError(error) {
  cleanupErr = error;
}

function __reset() {
  err = null;
  cleanupErr = null;
}

function __get() {
  return cleanupErr;
}

const mockRun = jest.fn().mockImplementation(() => {
  if (err) {
    throw err;
  }
  return userInput;
});

const mockCleanup = jest.fn().mockImplementation(() => {
  throw new Error('jj');
  if (cleanupErr) {
    throw cleanupErr;
  }
  return;
});

const mock = jest.fn().mockImplementation(() => {
  return {
    run: mockRun,
    cleanup: mockCleanup
  };
});

editorParent.__setInput = __setInput;
editorParent.__setError = __setError;
editorParent.__setCleanupError = __setCleanupError;
editorParent.__reset = __reset;
editorParent.__get = __get;
editorParent.ExternalEditor = mock;

module.exports = editorParent;
